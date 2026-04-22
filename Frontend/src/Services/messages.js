import { supabase } from '../lib/supabase';

// ============ CONVERSATION FUNCTIONS ============

/**
 * Generate a unique room ID for a conversation between two users
 * Sorts IDs so room is the same from both sides
 */
export function getRoomId(userId1, userId2) {
  return [userId1, userId2].sort().join('_');
}

/**
 * Get or start a conversation with another user
 * Returns the room ID and loads existing messages
 */
export async function startConversation(otherUserId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be logged in');
  
  const roomId = getRoomId(user.id, otherUserId);
  
  return {
    roomId,
    otherUserId,
    currentUserId: user.id
  };
}

// ============ MESSAGE FUNCTIONS ============

/**
 * Send a new message
 */
export async function sendMessage(receiverId, content, roomId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be logged in');
  if (!content.trim()) throw new Error('Message cannot be empty');
  
  const { data, error } = await supabase
    .from('messages')
    .insert({
      content: content.trim(),
      sender_id: user.id,
      receiver_id: receiverId,
      room_id: roomId,
      is_read: false
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Edit an existing message
 */
export async function editMessage(messageId, newContent) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be logged in');
  if (!newContent.trim()) throw new Error('Message cannot be empty');
  
  const { data, error } = await supabase
    .from('messages')
    .update({ 
      content: newContent.trim(),
      updated_at: new Date()
    })
    .eq('id', messageId)
    .eq('sender_id', user.id)  // Only sender can edit
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Delete a message
 */
export async function deleteMessage(messageId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be logged in');
  
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', messageId)
    .eq('sender_id', user.id);  // Only sender can delete
  
  if (error) throw error;
  return true;
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(roomId, senderId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be logged in');
  
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('room_id', roomId)
    .eq('sender_id', senderId)
    .eq('receiver_id', user.id)
    .eq('is_read', false);
  
  if (error) throw error;
  return true;
}

// ============ LOADING FUNCTIONS ============

/**
 * Load previous messages for a conversation
 */
export async function loadMessages(roomId, limit = 50) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be logged in');
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
}

/**
 * Get all conversations for the current user
 * Returns the latest message from each conversation
 */
export async function getConversations() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be logged in');
  
  // Get all messages where user is sender or receiver
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Group by room_id and get latest message per conversation
  const conversationsMap = new Map();
  
  data?.forEach(message => {
    const roomId = message.room_id;
    if (!conversationsMap.has(roomId)) {
      // Get the other user's ID
      const otherUserId = message.sender_id === user.id 
        ? message.receiver_id 
        : message.sender_id;
      
      conversationsMap.set(roomId, {
        roomId,
        otherUserId,
        lastMessage: message,
        unreadCount: message.receiver_id === user.id && !message.is_read ? 1 : 0
      });
    } else {
      // Update unread count for existing conversation
      const conv = conversationsMap.get(roomId);
      if (message.receiver_id === user.id && !message.is_read) {
        conv.unreadCount += 1;
      }
    }
  });
  
  return Array.from(conversationsMap.values());
}

/**
 * Get unread message count for current user
 */
export async function getUnreadCount() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;
  
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', user.id)
    .eq('is_read', false);
  
  if (error) return 0;
  return count || 0;
}

// ============ REALTIME SUBSCRIPTION ============

/**
 * Subscribe to real-time messages in a conversation
 * Returns a channel that you need to unsubscribe from later
 */
export function subscribeToMessages(roomId, onInsert, onUpdate, onDelete) {
  const channel = supabase
    .channel(`chat:${roomId}`)
    .on('postgres_changes', 
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      }, 
      (payload) => {
        if (onInsert) onInsert(payload.new);
      }
    )
    .on('postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      },
      (payload) => {
        if (onUpdate) onUpdate(payload.new);
      }
    )
    .on('postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      },
      (payload) => {
        if (onDelete) onDelete(payload.old);
      }
    )
    .subscribe();
  
  return channel;
}

/**
 * Subscribe to global notifications (for unread badge updates)
 */
export async function subscribeToNotifications(onNewMessage) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const channel = supabase
    .channel('notifications')
    .on('postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`
      },
      (payload) => {
        if (onNewMessage) onNewMessage(payload.new);
      }
    )
    .subscribe();
  
  return channel;
}
// ==================== NOTIFICATION FUNCTIONS ====================
import { supabase } from "../lib/supabase";

// --------------------- GET NOTIFICATIONS ---------------------
export const getNotifications = async (userId, options = {}) => {
  const {
    limit = 20,
    offset = 0,
    unreadOnly = false
  } = options;

  try {
    let query = supabase
      .from('notifications_with_details')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      notifications: data || [],
      total: count || 0,
      hasMore: data?.length === limit
    };
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

// --------------------- MARK NOTIFICATION AS READ ---------------------
export const markNotificationAsRead = async (notificationId, userId) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// --------------------- MARK ALL NOTIFICATIONS AS READ ---------------------
export const markAllNotificationsAsRead = async (userId) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// --------------------- GET UNREAD NOTIFICATION COUNT ---------------------
export const getUnreadNotificationCount = async (userId) => {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    return 0;
  }
};

// --------------------- DELETE NOTIFICATION ---------------------
export const deleteNotification = async (notificationId, userId) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// --------------------- SUBSCRIBE TO NOTIFICATIONS (REAL-TIME) ---------------------
export const subscribeToNotifications = (userId, callback) => {
  if (!userId) {
    console.error('User ID is required for notification subscription');
    return null;
  }

  const subscription = supabase
    .channel(`notifications-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return subscription;
};

// --------------------- UNSUBSCRIBE FROM NOTIFICATIONS ---------------------
export const unsubscribeFromNotifications = (subscription) => {
  if (subscription) {
    supabase.removeChannel(subscription);
  }
};
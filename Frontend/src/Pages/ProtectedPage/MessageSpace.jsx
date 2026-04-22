import { useState, useEffect, useRef, useContext } from "react";
import {
  Search, Send, ArrowLeft, MoreVertical,
  ImagePlus, Smile, Check, CheckCheck, Edit2,
  MessageSquarePlus, X, Loader2,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavbarPrivate from "../../Components/Private/Navbarprivate";
import { UserContext } from "../../Context/userContext";
import { useTheme } from "../../Context/themeContext";
import { getUserFollowers, getUserFollowing } from "../../Services/user";
import { supabase } from "../../lib/supabase";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function avatar(user) {
  return user?.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || user?.id || "user"}`;
}

// ─── Message Status Icon ──────────────────────────────────────────────────────
function StatusIcon({ status, isLight }) {
  if (status === "read") return <CheckCheck className={`w-3.5 h-3.5 text-blue-400`} />;
  if (status === "delivered") return <CheckCheck className={`w-3.5 h-3.5 ${isLight ? "text-gray-400" : "text-slate-500"}`} />;
  return <Check className={`w-3.5 h-3.5 ${isLight ? "text-gray-400" : "text-slate-500"}`} />;
}

// ─── Conversation List Item ───────────────────────────────────────────────────
function ConversationItem({ conv, active, onClick, theme }) {
  const isLight = theme === "light";
  
  // Get relation badge text
  const getRelationBadge = () => {
    if (conv.user.relation === 'mutual') {
      return { text: 'Mutual', color: isLight ? "bg-green-100 text-green-600" : "bg-green-900/30 text-green-400" };
    }
    if (conv.user.relation === 'follower') {
      return { text: 'Follows you', color: isLight ? "bg-gray-100 text-gray-500" : "bg-slate-700 text-slate-400" };
    }
    if (conv.user.relation === 'following') {
      return { text: 'Following', color: isLight ? "bg-blue-100 text-blue-600" : "bg-blue-900/30 text-blue-400" };
    }
    return null;
  };
  
  const relationBadge = getRelationBadge();
  
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all duration-200 text-left
        ${active
          ? isLight ? "bg-blue-50/80 border-r-2 border-blue-500" : "bg-blue-900/20 border-r-2 border-blue-500"
          : isLight ? "hover:bg-gray-50" : "hover:bg-slate-700/30"
        }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={avatar(conv.user)}
          alt={conv.user.full_name}
          className="w-11 h-11 rounded-2xl object-cover"
          style={{ border: isLight ? "2px solid #e5e7eb" : "2px solid rgba(255,255,255,0.08)" }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-1 mb-0.5">
          <span className={`font-semibold text-sm truncate
            ${isLight ? "text-gray-900" : "text-white"}`}>
            {conv.user.full_name}
          </span>
          {relationBadge && (
            <span className={`text-[9px] px-1.5 py-0.5 rounded ${relationBadge.color}`}>
              {relationBadge.text}
            </span>
          )}
          <span className={`text-[10px] flex-shrink-0 ml-auto
            ${conv.last_message?.unread > 0
              ? isLight ? "text-blue-600 font-semibold" : "text-blue-400 font-semibold"
              : isLight ? "text-gray-400" : "text-slate-500"
            }`}>
            {conv.last_message?.time || ""}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className={`text-xs truncate flex-1
            ${conv.last_message?.unread > 0
              ? isLight ? "text-gray-800 font-medium" : "text-gray-200 font-medium"
              : isLight ? "text-gray-500" : "text-slate-400"
            }`}>
            {conv.last_message?.mine && (
              <span className={`mr-1 ${isLight ? "text-gray-400" : "text-slate-500"}`}>You:</span>
            )}
            {conv.last_message?.text || "No messages yet. Send a message!"}
          </p>
          {conv.last_message?.unread > 0 && (
            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold">
              {conv.last_message.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, isLight, prevMine, currentUserId }) {
  const isMine = msg.sender_id === currentUserId;
  
  return (
    <div
      className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}
        ${prevMine === isMine ? "mt-0.5" : "mt-3"}`}
    >
      <div
        className={`max-w-[72%] px-4 py-2.5 text-sm leading-relaxed
          ${isMine
            ? "text-white rounded-2xl rounded-br-md"
            : isLight
              ? "bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100"
              : "bg-slate-700 text-gray-100 rounded-2xl rounded-bl-md"
          }`}
        style={isMine ? { background: "linear-gradient(135deg, #2563eb, #7c3aed)" } : {}}
      >
        {msg.content}
        <div className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
          <span className={`text-[10px] ${isMine ? "text-white/60" : isLight ? "text-gray-400" : "text-slate-500"}`}>
            {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          {isMine && <StatusIcon status={msg.status} isLight={isLight} />}
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyChat({ theme }) {
  const isLight = theme === "light";
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #2563eb20, #7c3aed20)" }}
      >
        <MessageSquarePlus className={`w-9 h-9 ${isLight ? "text-blue-500" : "text-blue-400"}`} />
      </div>
      <div>
        <h3 className={`font-bold text-base mb-1 ${isLight ? "text-gray-900" : "text-white"}`}>
          Your Messages
        </h3>
        <p className={`text-sm max-w-[240px] leading-relaxed ${isLight ? "text-gray-500" : "text-slate-400"}`}>
          Select a conversation to start reading, or send a new message to someone you know.
        </p>
      </div>
    </div>
  );
}

// ─── Main MessagesPage ────────────────────────────────────────────────────────
export default function MessagesPage() {
  const { theme } = useTheme();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isLight = theme === "light";

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [sending, setSending] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeConv = conversations.find((c) => c.id === activeId);

  // Fetch followers and following
  const fetchFollowers = async () => {
    try {
      const targetUserId = user?.id;
      const followersData = await getUserFollowers(targetUserId);
      setFollowers(followersData);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  const fetchFollowing = async () => {
    try {
      const targetUserId = user?.id;
      const followingData = await getUserFollowing(targetUserId);
      setFollowing(followingData);
    } catch (error) {
      console.error("Error fetching following:", error);
    }
  };

  // Build conversations from both followers AND following (no duplicates)
  const buildConversations = async () => {
    setLoading(true);
    
    // Combine followers and following into one unique list
    const allUsers = new Map();
    
    // Add following
    following.forEach(followUser => {
      allUsers.set(followUser.id, {
        id: followUser.id,
        full_name: followUser.full_name,
        username: followUser.username,
        avatar_url: followUser.avatar_url,
        source: 'following'
      });
    });
    
    // Add followers (won't duplicate if already in following)
    followers.forEach(followerUser => {
      if (!allUsers.has(followerUser.id)) {
        allUsers.set(followerUser.id, {
          id: followerUser.id,
          full_name: followerUser.full_name,
          username: followerUser.username,
          avatar_url: followerUser.avatar_url,
          source: 'follower'
        });
      } else {
        // User is both follower AND following
        const existing = allUsers.get(followerUser.id);
        existing.source = 'mutual';
        allUsers.set(followerUser.id, existing);
      }
    });
    
    const uniqueUsers = Array.from(allUsers.values());
    
    // If no users at all
    if (uniqueUsers.length === 0) {
      setConversations([]);
      setLoading(false);
      return;
    }
    
    // For each user, check if they have any message history
    const convPromises = uniqueUsers.map(async (targetUser) => {
      const roomId = [user?.id, targetUser.id].sort().join('_');
      
      // Check for existing messages
      const { data: lastMessage } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      const hasMessages = lastMessage && lastMessage.length > 0;
      const latestMsg = hasMessages ? lastMessage[0] : null;
      
      // Get unread count for this conversation
      const { count: unreadCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('room_id', roomId)
        .eq('receiver_id', user?.id)
        .eq('is_read', false);
      
      return {
        id: targetUser.id,
        user: {
          id: targetUser.id,
          full_name: targetUser.full_name,
          username: targetUser.username,
          avatar_url: targetUser.avatar_url,
          online: false,
          relation: targetUser.source,
        },
        last_message: hasMessages ? {
          text: latestMsg.content,
          time: (() => {
            const date = new Date(latestMsg.created_at);
            const now = new Date();
            const diff = now - date;
            const hours = diff / (1000 * 60 * 60);
            if (hours < 1) return `${Math.floor(diff / (1000 * 60))}m ago`;
            if (hours < 24) return `${Math.floor(hours)}h ago`;
            return date.toLocaleDateString();
          })(),
          unread: unreadCount || 0,
          mine: latestMsg?.sender_id === user?.id,
        } : null,
      };
    });
    
    const convs = await Promise.all(convPromises);
    
    // Sort: conversations with messages first, then by most recent message
    convs.sort((a, b) => {
      if (a.last_message && !b.last_message) return -1;
      if (!a.last_message && b.last_message) return 1;
      return 0;
    });
    
    setConversations(convs);
    setLoading(false);
  };

  // Load messages for a specific conversation
  const loadMessagesForConversation = async (otherUserId) => {
    const roomId = [user?.id, otherUserId].sort().join('_');
    
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });
    
    // Add status to each message
    const messagesWithStatus = (data || []).map(msg => ({
      ...msg,
      status: msg.is_read ? "read" : "delivered"
    }));
    
    setMessages(messagesWithStatus);
    
    // Mark messages as read
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('room_id', roomId)
      .eq('receiver_id', user?.id)
      .eq('is_read', false);
    
    // Update unread count in conversation list
    setConversations(prev => prev.map(conv => 
      conv.id === otherUserId
        ? {
            ...conv,
            last_message: conv.last_message ? {
              ...conv.last_message,
              unread: 0
            } : null
          }
        : conv
    ));
    
    return messagesWithStatus;
  };

  // Subscribe to real-time messages
  const subscribeToMessages = (otherUserId) => {
    // Unsubscribe from previous channel
    if (channel) {
      channel.unsubscribe();
    }
    
    const roomId = [user?.id, otherUserId].sort().join('_');
    
    const newChannel = supabase
      .channel(`chat:${roomId}`)
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          // Add new message to state
          const newMsg = {
            ...payload.new,
            status: "delivered"
          };
          setMessages(prev => [...prev, newMsg]);
          
          // Update conversation list with latest message
          setConversations(prev => prev.map(conv => 
            conv.id === otherUserId
              ? {
                  ...conv,
                  last_message: {
                    text: payload.new.content,
                    time: "now",
                    unread: payload.new.receiver_id === user?.id ? (conv.last_message?.unread || 0) + 1 : 0,
                    mine: payload.new.sender_id === user?.id,
                  }
                }
              : conv
          ));
          
          // Scroll to bottom
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      )
      .subscribe();
    
    setChannel(newChannel);
    return newChannel;
  };

  // Send a message
  const handleSend = async () => {
    if (!input.trim() || !activeId) return;
    setSending(true);
    
    const roomId = [user?.id, activeId].sort().join('_');
    
    const { data, error } = await supabase
      .from('messages')
      .insert({
        content: input.trim(),
        sender_id: user?.id,
        receiver_id: activeId,
        room_id: roomId,
        is_read: false
      })
      .select()
      .single();
    
    if (!error && data) {
      // Message sent successfully
      const newMsg = {
        ...data,
        status: "delivered"
      };
      setMessages(prev => [...prev, newMsg]);
      setInput("");
      
      // Update conversation list
      setConversations(prev => prev.map(conv => 
        conv.id === activeId
          ? {
              ...conv,
              last_message: {
                text: input.trim(),
                time: "now",
                unread: 0,
                mine: true,
              }
            }
          : conv
      ));
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    
    setSending(false);
  };

  // Handle selecting a conversation
  const handleSelectConv = async (id) => {
    setActiveId(id);
    setInput("");
    await loadMessagesForConversation(id);
    subscribeToMessages(id);
    
    if (window.innerWidth < 768) setShowSidebar(false);
  };

  // Initial data fetch
  useEffect(() => {
    if (user?.id) {
      fetchFollowers();
      fetchFollowing();
    }
  }, [user?.id]);

  // Build conversations when BOTH followers AND following data is loaded
  useEffect(() => {
    if (followers.length > 0 && following.length > 0 && user?.id) {
      buildConversations();
    }
  }, [followers, following, user?.id]);

  // Handle user query parameter to start conversation
  useEffect(() => {
    const userId = searchParams.get('user');
    if (userId && user?.id && conversations.length > 0) {
      // Check if user is in conversations list
      const exists = conversations.some(c => c.id === userId);
      
      if (exists) {
        handleSelectConv(userId);
      } else {
        console.log("You can only message people you're connected with");
      }
      
      // Clear query parameter
      navigate('/messages', { replace: true });
    }
  }, [searchParams, conversations, user?.id]);

  // Cleanup channel on unmount
  useEffect(() => {
    return () => {
      if (channel) {
        channel.unsubscribe();
      }
    };
  }, [channel]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Filter conversations by search
  const filtered = conversations.filter((c) =>
    c.user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.user.username?.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, c) => sum + (c.last_message?.unread || 0), 0);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading && conversations.length === 0) {
    return (
      <>
        <NavbarPrivate />
        <div className={`min-h-screen pt-20 flex items-center justify-center ${isLight ? "bg-gray-50" : "bg-slate-900"}`}>
          <Loader2 className={`w-8 h-8 animate-spin ${isLight ? "text-blue-600" : "text-blue-400"}`} />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .msg-enter { animation: fadeUp 0.2s ease forwards; }
      `}</style>

      <NavbarPrivate />

      <div className={`min-h-screen pt-20 md:pt-24 flex flex-col items-center justify-center px-3 md:px-6 lg:px-8
        ${isLight ? "bg-gray-50" : "bg-slate-900"}`}
      >
        <div className={`w-full max-w-7xl h-[calc(100vh-7rem)] rounded-2xl overflow-hidden shadow-2xl
          ${isLight ? "bg-white border border-gray-200" : "bg-slate-800 border border-slate-700"}`}
        >
          <div className="flex w-full h-full">
            {/* ── Sidebar ── */}
            <div
              className={`
                flex flex-col flex-shrink-0 border-r overflow-hidden
                ${isLight ? "border-gray-200 bg-white" : "border-slate-700 bg-slate-800"}
                ${showSidebar ? "w-full md:w-80 lg:w-96" : "hidden md:flex md:w-80 lg:w-96"}
              `}
            >
              {/* Sidebar header */}
              <div className={`px-4 pt-5 pb-3 border-b
                ${isLight ? "border-gray-100" : "border-slate-700/60"}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                      Messages
                    </h1>
                    {totalUnread > 0 && (
                      <p className={`text-xs ${isLight ? "text-gray-500" : "text-slate-400"}`}>
                        {totalUnread} unread
                      </p>
                    )}
                  </div>
                </div>

                {/* Search */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl
                  ${isLight ? "bg-gray-100" : "bg-slate-700/60"}`}
                >
                  <Search className={`w-3.5 h-3.5 flex-shrink-0 ${isLight ? "text-gray-400" : "text-slate-500"}`} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search messages…"
                    className={`flex-1 bg-transparent text-xs focus:outline-none
                      ${isLight ? "text-gray-800 placeholder:text-gray-400" : "text-gray-200 placeholder:text-slate-500"}`}
                  />
                  {search && (
                    <button onClick={() => setSearch("")}>
                      <X className={`w-3 h-3 ${isLight ? "text-gray-400" : "text-slate-500"}`} />
                    </button>
                  )}
                </div>
              </div>

              {/* Conversation list */}
              <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className={`text-center py-12 text-sm ${isLight ? "text-gray-400" : "text-slate-500"}`}>
                    {followers.length === 0 && following.length === 0 ? (
                      <>
                        <p>You don't have any connections yet.</p>
                        <p className="text-xs mt-1">Follow some writers to start messaging!</p>
                      </>
                    ) : (
                      "No matching conversations found"
                    )}
                  </div>
                ) : (
                  filtered.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conv={conv}
                      active={conv.id === activeId}
                      onClick={() => handleSelectConv(conv.id)}
                      theme={theme}
                    />
                  ))
                )}
              </div>
            </div>

            {/* ── Chat area ── */}
            <div
              className={`flex-1 flex flex-col overflow-hidden
                ${!showSidebar || activeId ? "flex" : "hidden md:flex"}
              `}
            >
              {!activeConv ? (
                <EmptyChat theme={theme} />
              ) : (
                <>
                  {/* Chat header */}
                  <div className={`flex items-center justify-between px-4 py-3.5 border-b flex-shrink-0
                    ${isLight ? "bg-white border-gray-100" : "bg-slate-800 border-slate-700/60"}`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowSidebar(true)}
                        className={`md:hidden p-1.5 rounded-xl transition-colors
                          ${isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-slate-700 text-gray-400"}`}
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>

                      <div className="relative">
                        <img
                          src={avatar(activeConv.user)}
                          alt={activeConv.user.full_name}
                          className="w-10 h-10 rounded-2xl object-cover"
                          style={{ border: isLight ? "2px solid #e5e7eb" : "2px solid rgba(255,255,255,0.08)" }}
                        />
                      </div>

                      <div>
                        <p
                          className={`font-bold text-sm cursor-pointer hover:underline ${isLight ? "text-gray-900" : "text-white"}`}
                          onClick={() => navigate(`/profile/${activeConv.user.id}`)}
                        >
                          {activeConv.user.full_name}
                        </p>
                        <p className={`text-xs ${isLight ? "text-gray-500" : "text-slate-400"}`}>
                          @{activeConv.user.username}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors
                        ${isLight ? "hover:bg-gray-100 text-gray-500" : "hover:bg-slate-700 text-slate-400"}`}>
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div
                    className={`flex-1 overflow-y-auto px-4 py-4 space-y-0.5
                      ${isLight ? "bg-gray-50/50" : "bg-slate-900/40"}`}
                  >
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <p className={`text-sm ${isLight ? "text-gray-400" : "text-slate-500"}`}>
                          No messages yet. Say hello! 👋
                        </p>
                      </div>
                    ) : (
                      messages.map((msg, i) => (
                        <div key={msg.id} className="msg-enter">
                          <MessageBubble
                            msg={msg}
                            isLight={isLight}
                            prevMine={i > 0 ? messages[i - 1].sender_id === user?.id : null}
                            currentUserId={user?.id}
                          />
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input bar */}
                  <div className={`px-4 py-3 border-t flex-shrink-0
                    ${isLight ? "bg-white border-gray-100" : "bg-slate-800 border-slate-700/60"}`}
                  >
                    <div className={`flex items-end gap-3 px-4 py-2.5 rounded-2xl border transition-all
                      ${isLight
                        ? "bg-gray-50 border-gray-200 focus-within:border-blue-400 focus-within:bg-white"
                        : "bg-slate-700/60 border-slate-600 focus-within:border-blue-500"
                      }`}
                    >
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Message ${activeConv.user.full_name}…`}
                        rows={1}
                        className={`flex-1 bg-transparent text-sm resize-none focus:outline-none max-h-32
                          ${isLight ? "text-gray-800 placeholder:text-gray-400" : "text-gray-200 placeholder:text-slate-500"}`}
                        style={{ lineHeight: "1.5" }}
                        onInput={(e) => {
                          e.target.style.height = "auto";
                          e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
                        }}
                      />

                      <button
                        onClick={handleSend}
                        disabled={!input.trim() || sending}
                        className={`flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl transition-all
                          ${input.trim()
                            ? "text-white shadow-md hover:opacity-90 active:scale-95"
                            : isLight ? "text-gray-300 bg-gray-100" : "text-slate-600 bg-slate-700"
                          }`}
                        style={input.trim()
                          ? { background: "linear-gradient(135deg, #2563eb, #7c3aed)" }
                          : {}
                        }
                      >
                        {sending
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Send className="w-4 h-4" />
                        }
                      </button>
                    </div>
                    <p className={`text-center text-[10px] mt-1.5 ${isLight ? "text-gray-300" : "text-slate-600"}`}>
                      Press Enter to send · Shift+Enter for new line
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
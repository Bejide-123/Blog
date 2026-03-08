import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "../../Context/themeContext";
import { supabase } from "../../lib/supabase";
import { getNotifications, getUnreadNotificationCount, markNotificationAsRead } from "../../Services/notification";
import { Bell, Heart, MessageCircle, UserPlus, AtSign, Share2, X, Check, ChevronRight } from "lucide-react";

export default function MobileNotificationModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notifications when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      
      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Fetch latest 10 notifications for mobile
      const { notifications: realNotifications } = await getNotifications(user.id, {
        limit: 10,
        offset: 0,
        unreadOnly: false
      });
      
      // Get unread count
      const unread = await getUnreadNotificationCount(user.id);
      setUnreadCount(unread);
      
      // Transform to match component structure
      const transformedNotifications = realNotifications.map(notif => {
        // Format time ago
        const formatTimeAgo = (timestamp) => {
          if (!timestamp) return 'Just now';
          const date = new Date(timestamp);
          const now = new Date();
          const diffInSeconds = Math.floor((now - date) / 1000);
          
          if (diffInSeconds < 60) return 'Just now';
          if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
          if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
          if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        };
        
        // Get message
        const getMessage = () => {
          if (notif.message) {
            const username = notif.sender_username;
            if (username && !notif.message.includes('@')) {
              if (notif.type === 'like_post' && notif.message.includes('liked your post:')) {
                const postTitlePart = notif.message.replace('liked your post:', '').trim();
                return { primary: `@${username} liked your post`, secondary: postTitlePart };
              }
              if (notif.type === 'comment' && notif.message.includes('commented on your post:')) {
                const postTitlePart = notif.message.replace('commented on your post:', '').trim();
                return { primary: `@${username} commented on your post`, secondary: postTitlePart };
              }
              
              const messages = {
                'like_post': `@${username} liked your post`,
                'comment': `@${username} commented on your post`,
                'follow': `@${username} started following you`,
                'mention': `@${username} mentioned you`,
                'repost': `@${username} shared your post`
              };
              return { primary: messages[notif.type] || notif.message, secondary: null };
            }
            return { primary: notif.message, secondary: null };
          }
          
          const username = notif.sender_username || 'Someone';
          return { primary: getDefaultMessage(notif.type, username), secondary: null };
        };

        const messageData = getMessage();
        
        return {
          id: notif.id,
          avatar: notif.sender_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${notif.sender_id}`,
          message: typeof messageData === 'string' ? messageData : messageData.primary,
          secondary: typeof messageData === 'object' ? messageData.secondary : null,
          time: formatTimeAgo(notif.created_at),
          isRead: notif.is_read,
          type: notif.type,
          rawData: notif
        };
      });
      
      setNotifications(transformedNotifications);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setIsLoading(false);
    }
  };

  // Helper function to generate default message if none exists
  const getDefaultMessage = (type, username) => {
    const usernameDisplay = username ? `@${username}` : 'Someone';
    
    const messages = {
      'like_post': `${usernameDisplay} liked your post`,
      'comment': `${usernameDisplay} commented on your post`,
      'follow': `${usernameDisplay} started following you`,
      'repost': `${usernameDisplay} shared your post`,
      'mention': `${usernameDisplay} mentioned you`
    };
    
    return messages[type] || 'New notification';
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read if unread
      if (!notification.isRead) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await markNotificationAsRead(notification.id, user.id);
          setNotifications(prev => prev.map(n => 
            n.id === notification.id ? { ...n, isRead: true } : n
          ));
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
      
      // Navigate based on notification type
      onClose();
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case 'like_post':
        return <Heart className={`${iconClass} text-red-500`} fill="currentColor" />;
      case 'comment':
        return <MessageCircle className={`${iconClass} text-blue-500`} />;
      case 'follow':
        return <UserPlus className={`${iconClass} text-green-500`} />;
      case 'mention':
        return <AtSign className={`${iconClass} text-purple-500`} />;
      case 'repost':
        return <Share2 className={`${iconClass} text-cyan-500`} />;
      default:
        return <Bell className={`${iconClass} text-gray-500`} />;
    }
  };

  // close on Esc key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="md:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-t-3xl shadow-2xl border-t ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300`}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className={`w-12 h-1 rounded-full ${theme === 'light' ? 'bg-gray-300' : 'bg-slate-600'}`} />
        </div>

        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-3 border-b ${theme === 'light' ? 'border-gray-200 bg-gradient-to-r from-blue-50/50 to-purple-50/50' : 'border-slate-700 bg-gradient-to-r from-blue-900/10 to-purple-900/10'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/30'}`}>
              <Bell className={`w-5 h-5 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
            </div>
            <div>
              <p className={`text-lg font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                Notifications
              </p>
              {unreadCount > 0 && (
                <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} font-medium`}>
                  {unreadCount} new notification{unreadCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 ${theme === 'light' ? 'text-slate-500 hover:text-slate-700 hover:bg-gray-100' : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700'} rounded-full transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mark all as read button */}
        {unreadCount > 0 && (
          <div className={`px-4 py-2 border-b ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}`}>
            <button className={`w-full py-2 ${theme === 'light' ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'} text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2`}>
              <Check className="w-4 h-4" />
              Mark all as read
            </button>
          </div>
        )}

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            // Loading skeleton
            <div className="p-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className={`flex items-start p-3 mb-3 ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-700/30'} rounded-xl animate-pulse`}
                >
                  <div className={`w-12 h-12 rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'} mr-3 flex-shrink-0`} />
                  <div className="flex-1">
                    <div className={`w-full h-3 rounded ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'} mb-2`} />
                    <div className={`w-3/4 h-3 rounded ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'} mb-2`} />
                    <div className={`w-1/3 h-2 rounded ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'}`} />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="p-3">
              {notifications.map((n, index) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`flex items-start p-3 mb-3 rounded-2xl cursor-pointer transition-all duration-200 active:scale-[0.98] ${
                    !n.isRead 
                      ? `${theme === 'light' ? 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500' : 'bg-blue-900/20 hover:bg-blue-900/30 border-l-4 border-blue-400'}` 
                      : `${theme === 'light' ? 'bg-gray-50/50 hover:bg-gray-100' : 'bg-slate-700/20 hover:bg-slate-700/40'}`
                  } animate-in fade-in slide-in-from-right-4`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Avatar with notification icon badge */}
                  <div className="relative mr-3 flex-shrink-0">
                    <img
                      src={n.avatar}
                      className={`w-12 h-12 rounded-full border-2 ${theme === 'light' ? 'border-white' : 'border-slate-800'} shadow-sm`}
                      alt="avatar"
                    />
                    <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-md ring-2 ${theme === 'light' ? 'ring-white' : 'ring-slate-800'}`}>
                      {getNotificationIcon(n.type)}
                    </div>
                  </div>

                  {/* Message content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'} font-medium leading-snug`}>
                      {n.message}
                    </p>
                    {n.secondary && (
                      <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mt-1 line-clamp-2`}>
                        "{n.secondary}"
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} font-medium`}>
                        {n.time}
                      </p>
                      {!n.isRead && (
                        <span className={`w-1.5 h-1.5 rounded-full ${theme === 'light' ? 'bg-blue-500' : 'bg-blue-400'} animate-pulse`} />
                      )}
                    </div>
                  </div>

                  {/* Chevron icon */}
                  <ChevronRight className={`w-5 h-5 ${theme === 'light' ? 'text-gray-400' : 'text-slate-500'} flex-shrink-0 ml-2`} />
                </div>
              ))}
            </div>
          ) : (
            // Empty state
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className={`w-20 h-20 mb-5 ${theme === 'light' ? 'bg-gradient-to-br from-blue-100 to-purple-100' : 'bg-gradient-to-br from-blue-900/30 to-purple-900/30'} rounded-full flex items-center justify-center`}>
                <Bell className={`w-10 h-10 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
              </div>
              <p className={`text-lg font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'} mb-2`}>
                All caught up!
              </p>
              <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} text-center`}>
                You don't have any notifications right now
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className={`border-t ${theme === 'light' ? 'border-gray-200 bg-white' : 'border-slate-700 bg-slate-800'} p-4`}>
            <button 
              onClick={() => {
                navigate("/notifications");
                onClose();
              }}
              className={`w-full py-3 ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'} text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 active:scale-95`}
            >
              View all notifications
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === 'light' ? '#f3f4f6' : '#1e293b'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === 'light' ? '#d1d5db' : '#475569'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'light' ? '#9ca3af' : '#64748b'};
        }
      `}</style>
    </div>
  );
}
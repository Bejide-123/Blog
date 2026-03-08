import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "../../Context/themeContext";
import { supabase } from "../../lib/supabase";
import { getNotifications, getUnreadNotificationCount, markNotificationAsRead } from "../../Services/notification";
import { Bell, Heart, MessageCircle, UserPlus, AtSign, Share2, Check } from "lucide-react";

export default function NotificationDropdown({ isOpen, onClose }) {
  const navigate = useNavigate(); 
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { notifications: realNotifications } = await getNotifications(user.id, {
        limit: 8,
        offset: 0,
        unreadOnly: false
      });

      // Get unread count
      const unread = await getUnreadNotificationCount(user.id);
      setUnreadCount(unread);

      // Transform data
      const transformedNotifications = realNotifications.map(notif => {
        // Format time
        const formatTime = (timestamp) => {
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
              const messages = {
                'like_post': `@${username} liked your post`,
                'comment': `@${username} commented on your post`,
                'follow': `@${username} started following you`,
                'mention': `@${username} mentioned you`
              };
              
              if (notif.type === 'like_post' && notif.message.includes('liked your post:')) {
                const postTitlePart = notif.message.replace('liked your post:', '').trim();
                return { primary: `@${username} liked your post`, secondary: postTitlePart };
              }
              if (notif.type === 'comment' && notif.message.includes('commented on your post:')) {
                const postTitlePart = notif.message.replace('commented on your post:', '').trim();
                return { primary: `@${username} commented on your post`, secondary: postTitlePart };
              }
              
              return { primary: messages[notif.type] || notif.message, secondary: null };
            }
            return { primary: notif.message, secondary: null };
          }
          
          const username = notif.sender_username || 'Someone';
          const messages = {
            'like_post': { primary: `@${username} liked your post`, secondary: null },
            'comment': { primary: `@${username} commented on your post`, secondary: null },
            'follow': { primary: `@${username} started following you`, secondary: null },
            'mention': { primary: `@${username} mentioned you`, secondary: null }
          };
          return messages[notif.type] || { primary: 'New notification', secondary: null };
        };

        const messageData = getMessage();

        return {
          id: notif.id,
          avatar: notif.sender_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${notif.sender_id}`,
          message: typeof messageData === 'string' ? messageData : messageData.primary,
          secondary: typeof messageData === 'object' ? messageData.secondary : null,
          time: formatTime(notif.created_at),
          isRead: notif.is_read,
          type: notif.type
        };
      });

      setNotifications(transformedNotifications);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setIsLoading(false);
    }
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
      // You can customize this based on your notification structure
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
    <>
      {/* Click outside overlay */}
      <div className="fixed inset-0 z-10" onClick={onClose} />

      <div className={`absolute right-0 mt-2 w-96 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl shadow-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200`}>
        {/* Header */}
        <div className={`px-5 py-4 border-b ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} bg-gradient-to-r ${theme === 'light' ? 'from-blue-50/50 to-purple-50/50' : 'from-blue-900/10 to-purple-900/10'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/30'}`}>
                <Bell className={`w-4 h-4 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
              </div>
              <div>
                <p className={`text-base font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                  Notifications
                </p>
                {unreadCount > 0 && (
                  <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    {unreadCount} unread
                  </p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <button className={`px-3 py-1.5 ${theme === 'light' ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'} text-xs font-medium rounded-lg transition-colors flex items-center gap-1`}>
                <Check className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div 
          className="max-h-[28rem] overflow-y-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: theme === 'light' ? '#d1d5db #f3f4f6' : '#475569 #1e293b'
          }}
        >
          {isLoading ? (
            // Loading skeleton
            <div className="p-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className={`flex items-start p-3 rounded-xl mb-2 ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-700/30'}`}>
                  <div className={`w-11 h-11 rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'} mr-3 animate-pulse`} />
                  <div className="flex-1">
                    <div className={`w-full h-3 rounded ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'} mb-2 animate-pulse`} />
                    <div className={`w-3/4 h-3 rounded ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'} mb-2 animate-pulse`} />
                    <div className={`w-20 h-2 rounded ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'} animate-pulse`} />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="p-2">
              {notifications.map((n, index) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`flex items-start p-3 rounded-xl mb-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                    !n.isRead 
                      ? `${theme === 'light' ? 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500' : 'bg-blue-900/20 hover:bg-blue-900/30 border-l-4 border-blue-400'}` 
                      : `${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700/30'}`
                  } animate-in fade-in slide-in-from-right-2`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Avatar with notification icon badge */}
                  <div className="relative mr-3 flex-shrink-0">
                    <img
                      src={n.avatar}
                      className={`w-11 h-11 rounded-full border-2 ${theme === 'light' ? 'border-white' : 'border-slate-800'} shadow-sm`}
                      alt="avatar"
                    />
                    <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} shadow-md`}>
                      {getNotificationIcon(n.type)}
                    </div>
                  </div>

                  {/* Message + Time stacked */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'} font-medium leading-snug`}>
                      {n.message}
                    </p>
                    {n.secondary && (
                      <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mt-1 line-clamp-1`}>
                        "{n.secondary}"
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                      <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} font-medium`}>
                        {n.time}
                      </p>
                      {!n.isRead && (
                        <span className={`w-1.5 h-1.5 rounded-full ${theme === 'light' ? 'bg-blue-500' : 'bg-blue-400'} animate-pulse`} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty state
            <div className="px-4 py-12 text-center">
              <div className={`w-16 h-16 mx-auto mb-4 ${theme === 'light' ? 'bg-gradient-to-br from-blue-100 to-purple-100' : 'bg-gradient-to-br from-blue-900/30 to-purple-900/30'} rounded-full flex items-center justify-center`}>
                <Bell className={`w-8 h-8 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
              </div>
              <p className={`text-base font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-white'} mb-1`}>
                All caught up!
              </p>
              <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                No notifications to show
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div 
            onClick={() => {
              navigate("/notifications");
              onClose();
            }} 
            className={`border-t ${theme === 'light' ? 'border-gray-200 bg-gray-50/50 hover:bg-gray-100/50' : 'border-slate-700 bg-slate-700/20 hover:bg-slate-700/40'} px-5 py-3 text-center cursor-pointer transition-colors`}
          >
            <button className={`text-sm ${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'} font-semibold flex items-center justify-center gap-1 w-full transition-colors`}>
              View all notifications
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "../../Context/themeContext";
import { supabase } from "../../lib/supabase";
import { getNotifications, getUnreadNotificationCount } from "../../Services/notification";

export default function NotificationDropdown({ isOpen, onClose }) {
  const navigate = useNavigate(); 
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        limit: 5,
        offset: 0,
        unreadOnly: false
      });

      // Transform data
      const transformedNotifications = realNotifications.map(notif => {
        // Format time
        const formatTime = (timestamp) => {
          if (!timestamp) return 'Just now';
          const date = new Date(timestamp);
          const now = new Date();
          const diffInSeconds = Math.floor((now - date) / 1000);
          
          if (diffInSeconds < 60) return 'Just now';
          if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
          if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
          return date.toLocaleDateString();
        };

        // Get message
        // Get message
const getMessage = () => {
  // If message already exists, use it
  if (notif.message) {
    // Check if message already has @username, if not, add it
    const username = notif.sender_username;
    if (username && !notif.message.includes('@')) {
      // Add username to beginning of message
      const messages = {
        'like_post': `@${username} liked your post`,
        'comment': `@${username} commented on your post`,
        'follow': `@${username} started following you`,
        'mention': `@${username} mentioned you`
      };
      
      // If it's a like/comment with post title, preserve the title
      if (notif.type === 'like_post' && notif.message.includes('liked your post:')) {
        const postTitlePart = notif.message.replace('liked your post:', '').trim();
        return `@${username} liked your post:${postTitlePart}`;
      }
      if (notif.type === 'comment' && notif.message.includes('commented on your post:')) {
        const postTitlePart = notif.message.replace('commented on your post:', '').trim();
        return `@${username} commented on your post:${postTitlePart}`;
      }
      
      return messages[notif.type] || notif.message;
    }
    return notif.message;
  }
  
  // If no message, create one with username
  const username = notif.sender_username || 'Someone';
  switch (notif.type) {
    case 'like_post': return `@${username} liked your post`;
    case 'comment': return `@${username} commented on your post`;
    case 'follow': return `@${username} started following you`;
    case 'mention': return `@${username} mentioned you`;
    default: return 'New notification';
  }
};

        return {
          id: notif.id,
          avatar: notif.sender_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${notif.sender_id}`,
          message: getMessage(),
          time: formatTime(notif.created_at),
          isRead: notif.is_read
        };
      });

      setNotifications(transformedNotifications);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setIsLoading(false);
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

      <div className={`absolute right-0 mt-2 w-80 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg shadow-lg border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} z-20`}>
        <div className={`px-4 py-2 border-b ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}`}>
          <p className={`text-sm font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            Notifications
          </p>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={`flex items-start px-4 py-3 ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700'}`}>
                <div className={`w-11 h-11 rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'} mr-3 animate-pulse`} />
                <div className="flex-1">
                  <div className={`w-48 h-3 rounded ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'} mb-2 animate-pulse`} />
                  <div className={`w-24 h-2 rounded ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'} animate-pulse`} />
                </div>
              </div>
            ))
          ) : notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start px-4 py-3 ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700'} transition-colors ${!n.isRead ? `${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/10'}` : ''}`}
              >
                {/* Avatar */}
                <img
                  src={n.avatar}
                  className={`w-11 h-11 rounded-full border-2 ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} mr-3`}
                  alt="avatar"
                />

                {/* Message + Time stacked */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'} line-clamp-2`}>
                    {n.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                      {n.time}
                    </p>
                    {!n.isRead && (
                      <span className={`w-2 h-2 rounded-full ${theme === 'light' ? 'bg-blue-500' : 'bg-blue-400'}`} />
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Empty state
            <div className="px-4 py-8 text-center">
              <div className={`w-12 h-12 mx-auto mb-3 ${theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'} rounded-full flex items-center justify-center`}>
                <svg className={`w-6 h-6 ${theme === 'light' ? 'text-gray-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                No notifications
              </p>
            </div>
          )}
        </div>
        <div onClick={() => {
          navigate("/notifications");
          onClose();
        }} className={`border-t ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} px-4 py-2 text-center`}>
          <button className={`text-sm ${theme === 'light' ? 'text-blue-600' : 'text-blue-500'} hover:underline`}>
            View all notifications
          </button>
        </div>
      </div>
    </>
  );
}
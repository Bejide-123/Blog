import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "../../Context/themeContext";
import { supabase } from "../../lib/supabase";
import { getNotifications, getUnreadNotificationCount } from "../../Services/notification";

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
      
      // Fetch latest 5 notifications
      const { notifications: realNotifications } = await getNotifications(user.id, {
        limit: 5,
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
          if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
          if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
          if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
          return date.toLocaleDateString();
        };
        
        // Get avatar URL
        const getAvatarUrl = () => {
          return notif.sender_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${notif.sender_id}`;
        };
        
        return {
          id: notif.id,
          avatar: getAvatarUrl(),
          message: notif.message || getDefaultMessage(notif.type, notif.sender_username),
          time: formatTimeAgo(notif.created_at),
          isRead: notif.is_read,
          type: notif.type,
          rawData: notif // Keep original data
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
    
    switch (type) {
      case 'like_post':
        return `${usernameDisplay} liked your post`;
      case 'comment':
        return `${usernameDisplay} commented on your post`;
      case 'follow':
        return `${usernameDisplay} started following you`;
      case 'repost':
        return `${usernameDisplay} shared your post`;
      case 'mention':
        return `${usernameDisplay} mentioned you`;
      default:
        return 'New notification';
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
      className="md:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-t-2xl shadow-lg border-t ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} animate-slide-up max-h-[90vh]`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}`}>
          <div className="flex items-center gap-2">
            <p className={`text-base font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              Notifications
            </p>
            {unreadCount > 0 && (
              <span className={`px-2 py-0.5 ${theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-900/30 text-blue-400'} text-xs font-medium rounded-full`}>
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className={`${theme === 'light' ? 'text-slate-500 hover:text-slate-700' : 'text-slate-400 hover:text-slate-300'} text-lg`}
          >
            ✕
          </button>
        </div>

        {/* Notification List */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={`flex items-start px-4 py-3 ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-700/50'} rounded-lg animate-pulse`}
              >
                <div className={`w-11 h-11 rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'} mr-3`} />
                <div className="flex-1">
                  <div className={`w-3/4 h-4 rounded ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'} mb-2`} />
                  <div className={`w-1/2 h-3 rounded ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'}`} />
                </div>
              </div>
            ))
          ) : notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start px-4 py-3 ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700'} transition-colors rounded-lg ${!n.isRead ? `${theme === 'light' ? 'bg-blue-50/50' : 'bg-blue-900/10'} border-l-2 ${theme === 'light' ? 'border-blue-500' : 'border-blue-400'}` : ''}`}
              >
                <img
                  src={n.avatar}
                  className={`w-11 h-11 rounded-full border-2 ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} mr-3`}
                  alt="avatar"
                />
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
            <div className="text-center py-8">
              <div className={`w-16 h-16 mx-auto mb-4 ${theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'} rounded-full flex items-center justify-center`}>
                <svg className={`w-8 h-8 ${theme === 'light' ? 'text-gray-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <p className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                No notifications yet
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div onClick={() => {
          navigate("/notifications");
          onClose();
        }} className={`border-t ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} px-4 py-3 text-center`}>
          <button className={`text-sm ${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-500 hover:text-blue-400'} hover:underline font-medium flex items-center justify-center gap-1 w-full`}>
            View all notifications
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
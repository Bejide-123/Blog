import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "../../Context/themeContext";

export default function MobileNotificationModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const sampleNotifications = [
    {
      id: 1,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      message: "New comment on your post",
      time: "2m ago",
    },
    {
      id: 2,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
      message: "Your post was liked by Sarah",
      time: "10m ago",
    },
    {
      id: 3,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      message: "You have a new follower",
      time: "1h ago",
    },
  ];

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
        className={`w-full max-w-md ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-t-2xl shadow-lg border-t ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} animate-slide-up`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}`}>
          <p className={`text-base font-semibold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            Notifications
          </p>
          <button
            onClick={onClose}
            className={`${theme === 'light' ? 'text-slate-500 hover:text-slate-700' : 'text-slate-400 hover:text-slate-300'} text-lg`}
          >
            ✕
          </button>
        </div>

        {/* Notification List */}
        <div className="max-h-[70vh] overflow-y-auto p-2">
          {sampleNotifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start px-4 py-3 ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700'} transition-colors rounded-lg`}
            >
              <img
                src={n.avatar}
                className={`w-11 h-11 rounded-full border-2 ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} mr-3`}
                alt="avatar"
              />
              <div>
                <p className={`text-sm ${theme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>
                  {n.message}
                </p>
                <p className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'} mt-1`}>
                  {n.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div onClick={() => navigate("/notifications")} className={`border-t ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} px-4 py-3 text-center`}>
          <button className={`text-sm ${theme === 'light' ? 'text-blue-600' : 'text-blue-500'} hover:underline`}>
            View all
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect } from "react";

export default function NotificationDropdown({ isOpen, onClose }) {
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
    <>
      {/* Click outside overlay */}
      <div className="fixed inset-0 z-10" onClick={onClose} />

      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-20">
        <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Notifications
          </p>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {sampleNotifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              {/* Avatar */}
              <img
                src={n.avatar}
                className="w-11 h-11 rounded-full border-2 border-gray-200 dark:border-slate-700 mr-3"
                alt="avatar"
              />

              {/* Message + Time stacked */}
              <div>
                <p className="text-sm text-slate-800 dark:text-slate-200">
                  {n.message}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {n.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 dark:border-slate-700 px-4 py-2 text-center">
          <button className="text-sm text-blue-600 dark:text-blue-500 hover:underline">
            View all
          </button>
        </div>
      </div>
    </>
  );
}


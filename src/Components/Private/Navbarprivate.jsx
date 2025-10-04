import { useState } from "react";
import {
  Home,
  Bookmark,
  PlusCircle,
  Bell,
  User,
  Search,
  LogOut,
  LayoutDashboard,
  Settings,
  Moon,
  Sun,
  Feather,
} from "lucide-react";
import { useNavigate } from "react-router";
import NotificationDropdown from "./Notification";

export default function NavbarPrivate() {
  const [currentPath, setCurrentPath] = useState("/feed");
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationCount] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const nav = useNavigate();

  const user = {
    username: "johndoe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe",
  };

  const isActive = (path) => currentPath === path;

  const handleNavClick = (path) => {
    setCurrentPath(path);
    setShowAvatarMenu(false);
    nav(path);
  };

  const handleLogout = () => {
    alert("Logging out... (Clear localStorage and redirect to /login)");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
      setShowSearchModal(false);
      setSearchQuery("");
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const navItems = [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/saved", icon: Bookmark, label: "Saved" },
    { path: "/create", icon: PlusCircle, label: "Create", isCenter: true },
    {
      icon: Bell,
      label: "Notifications",
      badge: notificationCount,
      isNotification: true,
    },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div
      className={` bg-gray-50 dark:bg-slate-900 ${isDarkMode ? "dark" : ""}`}
    >
      {/* Desktop/Tablet Top Navbar */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 bg-white dark:bg-slate-800 shadow-md dark:shadow-slate-900/50 border-b border-gray-200 dark:border-slate-700 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo & Links */}
            <div className="flex items-center gap-10">
              <button
                onClick={() => handleNavClick("/feed")}
                className="group flex items-center gap-2"
              >
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors duration-200">
                  Scribe
                </h1>
                <Feather className="w-7 h-7 md:w-8 md:h-8 text-blue-600 dark:text-blue-500" />
              </button>
              <div className="hidden lg:flex items-center gap-10">
                <button
                  onClick={() => {
                    handleNavClick("/feed"), nav("/home");
                  }}
                  className={`text-lg font-semibold transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 dark:after:bg-blue-500 after:transition-all after:duration-200 hover:after:w-full ${
                    isActive("/feed")
                      ? "text-blue-600 dark:text-blue-500"
                      : "text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-500"
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    handleNavClick("/saved"), nav("/saved");
                  }}
                  className={`text-lg font-semibold transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 dark:after:bg-blue-500 after:transition-all after:duration-200 hover:after:w-full ${
                    isActive("/saved")
                      ? "text-blue-600 dark:text-blue-500"
                      : "text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-500"
                  }`}
                >
                  Saved
                </button>
              </div>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                  placeholder="Search posts..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                {isDarkMode ? (
                  <Sun className="w-6 h-6" />
                ) : (
                  <Moon className="w-6 h-6" />
                )}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsNotificationModalOpen(!isNotificationModalOpen)
                  }
                  className="relative p-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 
               dark:hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-slate-700 
               rounded-lg transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {notificationCount > 0 && (
                    <span
                      className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white 
                       text-xs font-bold rounded-full flex items-center justify-center"
                    >
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* Dropdown injected here */}
                <NotificationDropdown
                  isOpen={isNotificationModalOpen}
                  onClose={() => setIsNotificationModalOpen(false)}
                />
              </div>

              {/* Create Post Button */}
              <button
                onClick={() => handleNavClick("/create")}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 active:bg-blue-800 dark:active:bg-blue-800 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 font-semibold"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create</span>
              </button>

              {/* User Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                  className="w-10 h-10 rounded-full border-2 border-blue-600 dark:border-blue-500 overflow-hidden hover:border-blue-700 dark:hover:border-blue-400 transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* Dropdown Menu */}
                {showAvatarMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowAvatarMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg dark:shadow-slate-900/50 border border-gray-200 dark:border-slate-700 py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          @{user.username}
                        </p>
                      </div>
                      <button
                        onClick={() => handleNavClick("/profile")}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-500 transition-colors text-left cursor-pointer"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </button>
                      <button
                        onClick={() => handleNavClick("/dashboard")}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-500 transition-colors text-left cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </button>
                      <button
                        onClick={() => handleNavClick("/settings")}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-500 transition-colors text-left cursor-pointer"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <div className="border-t border-gray-200 dark:border-slate-700 my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-md dark:shadow-slate-900/50 z-50">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("/feed")}
            className="group flex items-center gap-2"
          >
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors duration-200">
              Scribe
            </h1>
            <Feather className="w-6 h-6 text-blue-600 dark:text-blue-500" />
          </button>

          {/* Right: Dark Mode, Search & Avatar */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowAvatarMenu(!showAvatarMenu)}
              className="w-8 h-8 rounded-full border-2 border-blue-600 dark:border-blue-500 overflow-hidden"
            >
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        {/* Mobile Avatar Dropdown */}
        {showAvatarMenu && (
          <>
            <div
              className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40"
              onClick={() => setShowAvatarMenu(false)}
            />
            <div className="absolute right-4 top-16 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg dark:shadow-slate-900/50 border border-gray-200 dark:border-slate-700 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  @{user.username}
                </p>
              </div>
              <button
                onClick={() => handleNavClick("/profile")}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-500 transition-colors text-left"
              >
                <User className="w-4 h-4" />
                My Profile
              </button>
              <button
                onClick={() => handleNavClick("/dashboard")}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-500 transition-colors text-left"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => handleNavClick("/settings")}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-500 transition-colors text-left"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <div className="border-t border-gray-200 dark:border-slate-700 my-1" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Search Modal */}
      {showSearchModal && (
        <div className="md:hidden fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <button
              onClick={() => setShowSearchModal(false)}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
            >
              ← Back
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
              placeholder="Search posts..."
              autoFocus
              className="flex-1 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500"
            />
          </div>
        </div>
      )}
      
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 shadow-lg dark:shadow-slate-900/50 z-50">
        {/* Mobile Notifications Modal */}
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(
            ({ path, icon: Icon, label, isCenter, badge, isNotification }) => (
              <button
                key={path || label}
                onClick={() => {
                  if (isNotification) {
                    setIsNotificationModalOpen(!isNotificationModalOpen);
                  } else {
                    handleNavClick(path);
                  }
                }}
                className={`relative flex flex-col items-center justify-center transition-all ${
                  isCenter
                    ? "w-14 h-14 -mt-6 bg-blue-600 dark:bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-700 dark:hover:bg-blue-700 active:scale-95"
                    : "flex-1 py-2 hover:text-blue-600 dark:hover:text-blue-500"
                } ${
                  isActive(path) && !isCenter
                    ? "text-blue-600 dark:text-blue-500"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                <Icon className={isCenter ? "w-7 h-7" : "w-6 h-6"} />
                {!isCenter && (
                  <span className="text-xs mt-1 font-medium">{label}</span>
                )}
                {badge > 0 && !isCenter && (
                  <span className="absolute top-1 right-1/4 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </button>
            )
          )}
        </div>
      </nav>
    </div>
  );
}

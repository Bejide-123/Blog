import { useState, useEffect } from "react";
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
  Feather,
  X,
  Sparkles,
  TrendingUp,
  BookOpen,
  Hash,
  Sun,
  Moon,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import NotificationDropdown from "./Notification";
import MobileNotificationModal from "./mobileNotification";
import { useUser } from "../../Context/userContext";
import { signOut } from "../../Services/api";
import { useTheme } from "../../Context/themeContext";
import { getUnreadNotificationCount, subscribeToNotifications, unsubscribeFromNotifications } from "../../Services/notification";
import { supabase } from "../../lib/supabase";

export default function NavbarPrivate() {
  const { user, logout } = useUser();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const nav = useNavigate();

  // Update current path on location change
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  // Close dropdowns on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowAvatarMenu(false);
        setShowSearchModal(false);
        setShowSearchSuggestions(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Fetch notification count on mount and when user changes
  useEffect(() => {
    if (user?.id) {
      fetchNotificationCount();
    }
  }, [user?.id]);

  // Set up real-time subscription for notifications
  useEffect(() => {
    let subscription = null;
    if (user?.id) {
      subscription = subscribeToNotifications(user.id, (payload) => {
        // Update count when new notification arrives
        if (payload.eventType === 'INSERT') {
          setNotificationCount(prev => prev + 1);
        }
      });
    }
    return () => {
      if (subscription) {
        unsubscribeFromNotifications(subscription);
      }
    };
  }, [user?.id]);

  const fetchNotificationCount = async () => {
    if (!user?.id) return;
    try {
      const count = await getUnreadNotificationCount(user.id);
      setNotificationCount(count);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  // Generate avatar URL fallback
  const getAvatarUrl = () => {
    if (!user) return "https://api.dicebear.com/7.x/avataaars/svg?seed=default";
    return user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || user?.email || "user"}`;
  };

  // Get display username
  const getDisplayUsername = () => {
    if (!user) return "User";
    return user?.username || user?.email?.split('@')[0] || "User";
  };

  const handleNavClick = (path) => {
    setCurrentPath(path);
    setShowAvatarMenu(false);
    nav(path);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      logout();
      nav("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  // SMART SEARCH FUNCTION WITH TYPE DETECTION
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Smart search type detection
      let searchType = 'all';
      
      // Check if search starts with @ (user search)
      if (searchQuery.trim().startsWith('@')) {
        searchType = 'users';
      } 
      // Check if search starts with # (tag search)
      else if (searchQuery.trim().startsWith('#')) {
        searchType = 'tags';
      }
      // Otherwise, it's a general search - prioritize posts
      else {
        searchType = 'posts';
      }
      
      // Navigate with the detected search type
      nav(`/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}&sort=relevance`);
      setShowSearchModal(false);
      setShowSearchSuggestions(false);
      setSearchQuery("");
    }
  };

  // Search suggestions (example)
  const searchSuggestions = [
    { icon: <Hash className="w-4 h-4" />, text: "#react", type: "tag" },
    { icon: <TrendingUp className="w-4 h-4" />, text: "Trending posts", type: "trending" },
    { icon: <BookOpen className="w-4 h-4" />, text: "Tutorials", type: "category" },
    { icon: <User className="w-4 h-4" />, text: "@popularuser", type: "user" },
  ];

  // Desktop navigation items
  const desktopNavItems = [
    { path: "/home", label: "Feed", active: currentPath === "/home" },
    { path: "/saved", label: "Saved", active: currentPath === "/saved" },
  ];

  // Mobile navigation items
  const mobileNavItems = [
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
    <div className={theme === 'light' ? "bg-gray-50" : "bg-slate-900"}>
      {/* Desktop/Tablet Top Navbar */}
      <nav className={`hidden md:block fixed top-0 left-0 right-0 ${theme === 'light' ? 'bg-white/95' : 'bg-slate-800/95'} backdrop-blur-lg border-b ${theme === 'light' ? 'border-gray-200/50' : 'border-slate-700/50'} shadow-sm z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick("/home")}
                className="group flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity" />
                  <Feather className={`relative w-8 h-8 ${theme === 'light' ? 'text-blue-600' : 'text-blue-500'}`} />
                </div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r ${theme === 'light' ? 'from-blue-600 to-purple-600' : 'from-blue-500 to-purple-500'} bg-clip-text text-transparent`}>
                  Scribe
                </h1>
                <Sparkles className="w-4 h-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center gap-1 ml-8">
                {desktopNavItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      item.active
                        ? `${theme === 'light' ? 'text-blue-600 bg-blue-50' : 'text-blue-400 bg-blue-900/20'}`
                        : `${theme === 'light' ? 'text-gray-600 hover:text-blue-600 hover:bg-gray-50' : 'text-gray-400 hover:text-blue-400 hover:bg-slate-700/50'}`
                    }`}
                  >
                    {item.label}
                    {item.active && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-2xl mx-8 hidden lg:flex">
              <div className="relative">
                <div className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchSuggestions(e.target.value.length > 0);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                    onFocus={() => searchQuery.length > 0 && setShowSearchSuggestions(true)}
                    placeholder="@username, #topic, or keywords..."
                    className={`w-full pl-12 pr-4 py-2.5 border ${theme === 'light' ? 'border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-400 group-hover:bg-white' : 'border-slate-600 bg-slate-700 text-white placeholder:text-slate-500 group-hover:bg-slate-600'} rounded-full focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:ring-blue-500/50 focus:border-blue-500' : 'focus:ring-blue-400/50 focus:border-blue-400'} transition-all duration-200`}
                  />
                  <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'light' ? 'text-gray-400 group-hover:text-blue-500' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`} />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 ${theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-slate-500 hover:text-slate-300'} transition-colors`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Search Suggestions */}
                {showSearchSuggestions && searchQuery && (
                  <div className={`absolute top-full left-0 right-0 mt-2 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-xl shadow-lg border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} py-2 z-20`}>
                    <div className={`px-4 py-2 border-b ${theme === 'light' ? 'border-gray-100' : 'border-slate-700'}`}>
                      <p className={`text-xs font-semibold ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'} uppercase tracking-wider`}>
                        Quick Search
                      </p>
                    </div>
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(suggestion.text);
                          handleSearch({ preventDefault: () => {} });
                        }}
                        className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm ${theme === 'light' ? 'text-gray-700 hover:bg-gray-50 hover:text-blue-600' : 'text-gray-300 hover:bg-slate-700/50 hover:text-blue-400'} transition-colors text-left`}
                      >
                        {suggestion.icon}
                        <span>{suggestion.text}</span>
                        <span className={`ml-auto text-xs px-2 py-1 ${theme === 'light' ? 'bg-gray-100 text-gray-500' : 'bg-slate-700 text-slate-400'} rounded-full`}>
                          {suggestion.type}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${theme === 'light' ? 'text-gray-600 hover:text-blue-600 hover:bg-gray-100' : 'text-gray-400 hover:text-blue-400 hover:bg-slate-700/50'} transition-colors relative group`}
                title={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
                <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 ${theme === 'light' ? 'bg-gray-900 text-white' : 'bg-slate-700 text-slate-200'} text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none`}>
                  {theme === 'dark' ? "Light mode" : "Dark mode"}
                </div>
              </button>

              {/* Create Post Button */}
              <button
                onClick={() => handleNavClick("/create")}
                className={`hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r ${theme === 'light' ? 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 'from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'} text-white rounded-lg active:scale-95 transition-all duration-200 font-semibold shadow-md hover:shadow-lg`}
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create Story</span>
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationModalOpen(!isNotificationModalOpen)}
                  className={`relative p-2 rounded-lg ${theme === 'light' ? 'text-gray-600 hover:text-blue-600 hover:bg-gray-100' : 'text-gray-400 hover:text-blue-400 hover:bg-slate-700/50'} transition-colors group`}
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                      {notificationCount}
                    </span>
                  )}
                  <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 ${theme === 'light' ? 'bg-gray-900 text-white' : 'bg-slate-700 text-slate-200'} text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none`}>
                    Notifications
                  </div>
                </button>
                <NotificationDropdown
                  isOpen={isNotificationModalOpen}
                  onClose={() => setIsNotificationModalOpen(false)}
                />
              </div>

              {/* User Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                  className={`w-10 h-10 rounded-full border-2 border-transparent ${theme === 'light' ? 'hover:border-blue-500' : 'hover:border-blue-400'} overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95 group`}
                  title="Profile menu"
                >
                  <img
                    src={getAvatarUrl()}
                    alt={getDisplayUsername()}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                {/* Avatar Dropdown Menu */}
                {showAvatarMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowAvatarMenu(false)}
                    />
                    <div className={`absolute right-0 mt-2 w-64 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-xl shadow-xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} py-2 z-20 animate-in slide-in-from-top-2`}>
                      <div className={`px-4 py-3 border-b ${theme === 'light' ? 'border-gray-100' : 'border-slate-700'}`}>
                        <p className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          @{getDisplayUsername()}
                        </p>
                        <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'} mt-1`}>
                          {user?.email || "Welcome to Scribe!"}
                        </p>
                      </div>
                      
                      <div className="py-2">
                        <button
                          onClick={() => {
                            handleNavClick("/profile");
                            setShowAvatarMenu(false);
                          }}
                          className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm ${theme === 'light' ? 'text-gray-700 hover:bg-gray-50 hover:text-blue-600' : 'text-gray-300 hover:bg-slate-700/50 hover:text-blue-400'} transition-colors text-left`}
                        >
                          <User className="w-4 h-4" />
                          <span>My Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            handleNavClick("/dashboard");
                            setShowAvatarMenu(false);
                          }}
                          className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm ${theme === 'light' ? 'text-gray-700 hover:bg-gray-50 hover:text-blue-600' : 'text-gray-300 hover:bg-slate-700/50 hover:text-blue-400'} transition-colors text-left`}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Dashboard</span>
                        </button>
                        <button
                          onClick={() => {
                            handleNavClick("/settings");
                            setShowAvatarMenu(false);
                          }}
                          className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm ${theme === 'light' ? 'text-gray-700 hover:bg-gray-50 hover:text-blue-600' : 'text-gray-300 hover:bg-slate-700/50 hover:text-blue-400'} transition-colors text-left`}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                      </div>
                      
                      <div className={`border-t ${theme === 'light' ? 'border-gray-100' : 'border-slate-700'} pt-2`}>
                        <button
                          onClick={handleLogout}
                          className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm ${theme === 'light' ? 'text-red-600 hover:bg-red-50' : 'text-red-400 hover:bg-red-900/20'} transition-colors text-left`}
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className={`md:hidden fixed top-0 left-0 right-0 ${theme === 'light' ? 'bg-white/95' : 'bg-slate-800/95'} backdrop-blur-lg border-b ${theme === 'light' ? 'border-gray-200/50' : 'border-slate-700/50'} shadow-sm z-50`}>
        <div className="flex items-center justify-between px-4 h-14">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("/home")}
            className="group flex items-center gap-2"
          >
            <Feather className={`w-6 h-6 ${theme === 'light' ? 'text-blue-600' : 'text-blue-500'}`} />
            <h1 className={`text-lg font-bold bg-gradient-to-r ${theme === 'light' ? 'from-blue-600 to-purple-600' : 'from-blue-500 to-purple-500'} bg-clip-text text-transparent`}>
              Scribe
            </h1>
          </button>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearchModal(true)}
              className={`p-2 ${theme === 'light' ? 'text-gray-600 hover:text-blue-600 hover:bg-gray-100' : 'text-gray-400 hover:text-blue-500 hover:bg-slate-700/50'} rounded-lg transition-colors`}
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowAvatarMenu(!showAvatarMenu)}
              className={`w-8 h-8 rounded-full border-2 border-transparent ${theme === 'light' ? 'hover:border-blue-500' : 'hover:border-blue-400'} overflow-hidden transition-colors`}
            >
              <img
                src={getAvatarUrl()}
                alt={getDisplayUsername()}
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        {/* Mobile Avatar Dropdown - REMOVED BACKDROP COLOR */}
        {showAvatarMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowAvatarMenu(false)}
            />
            <div className={`absolute right-4 top-14 w-56 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-xl shadow-xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} py-2 z-50 animate-in slide-in-from-top-2`}>
              <div className={`px-4 py-3 border-b ${theme === 'light' ? 'border-gray-100' : 'border-slate-700'}`}>
                <p className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  @{getDisplayUsername()}
                </p>
              </div>
              <div className="py-2">
                <button
                  onClick={() => {
                    handleNavClick("/profile");
                    setShowAvatarMenu(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm ${theme === 'light' ? 'text-gray-700 hover:bg-gray-50 hover:text-blue-600' : 'text-gray-300 hover:bg-slate-700/50 hover:text-blue-400'} transition-colors text-left`}
                >
                  <User className="w-4 h-4" />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    handleNavClick("/dashboard");
                    setShowAvatarMenu(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm ${theme === 'light' ? 'text-gray-700 hover:bg-gray-50 hover:text-blue-600' : 'text-gray-300 hover:bg-slate-700/50 hover:text-blue-400'} transition-colors text-left`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    handleNavClick("/settings");
                    setShowAvatarMenu(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm ${theme === 'light' ? 'text-gray-700 hover:bg-gray-50 hover:text-blue-600' : 'text-gray-300 hover:bg-slate-700/50 hover:text-blue-400'} transition-colors text-left`}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
              <div className={`border-t ${theme === 'light' ? 'border-gray-100' : 'border-slate-700'} pt-2`}>
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm ${theme === 'light' ? 'text-red-600 hover:bg-red-50' : 'text-red-400 hover:bg-red-900/20'} transition-colors text-left`}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile Search Modal */}
      {showSearchModal && (
        <div className={`md:hidden fixed inset-0 ${theme === 'light' ? 'bg-white' : 'bg-slate-900'} z-50 flex flex-col animate-in slide-in-from-top`}>
          <div className={`flex items-center gap-3 px-4 py-3 border-b ${theme === 'light' ? 'border-gray-200 bg-white' : 'border-slate-700 bg-slate-800'}`}>
            <button
              onClick={() => setShowSearchModal(false)}
              className={`${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'} font-medium transition-colors`}
            >
              Cancel
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                placeholder="@username, #topic, or keywords..."
                autoFocus
                className={`w-full px-4 py-3 ${theme === 'light' ? 'bg-gray-100 text-gray-900 placeholder:text-gray-400' : 'bg-slate-700 text-white placeholder:text-slate-500'} rounded-xl focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:ring-blue-500' : 'focus:ring-blue-400'}`}
              />
              <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'light' ? 'text-gray-400' : 'text-slate-500'}`} />
            </div>
          </div>
          {/* Search Suggestions */}
          <div className="flex-1 overflow-y-auto p-4">
            <p className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'} mb-3`}>
              Trending Searches
            </p>
            <div className="space-y-2">
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(suggestion.text);
                    handleSearch({ preventDefault: () => {} });
                  }}
                  className={`flex items-center gap-3 w-full p-3 rounded-lg ${theme === 'light' ? 'bg-gray-50 hover:bg-gray-100' : 'bg-slate-800 hover:bg-slate-700'} transition-colors text-left`}
                >
                  {suggestion.icon}
                  <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 ${theme === 'light' ? 'bg-white/95' : 'bg-slate-800/95'} backdrop-blur-lg border-t ${theme === 'light' ? 'border-gray-200/50' : 'border-slate-700/50'} shadow-lg z-50`}>
        <div className="flex items-center justify-around px-2 py-3">
          {mobileNavItems.map(({ path, icon: Icon, label, isCenter, badge, isNotification }) => (
            <button
              key={path || label}
              onClick={() => {
                if (isNotification) {
                  setIsNotificationModalOpen(!isNotificationModalOpen);
                } else if (path) {
                  handleNavClick(path);
                }
              }}
              className={`relative flex flex-col items-center justify-center transition-all duration-200 ${
                isCenter
                  ? `w-16 h-16 -mt-6 bg-gradient-to-r ${theme === 'light' ? 'from-blue-600 to-purple-600' : 'from-blue-500 to-purple-500'} text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95`
                  : `flex-1 py-2 ${theme === 'light' ? 'hover:text-blue-600' : 'hover:text-blue-400'}`
              } ${
                currentPath === path && !isCenter
                  ? `${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`
                  : `${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`
              }`}
            >
              <div className="relative">
                <Icon className={isCenter ? "w-7 h-7" : "w-6 h-6"} />
                {badge > 0 && !isCenter && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {badge}
                  </span>
                )}
              </div>
              {!isCenter && (
                <span className="text-xs mt-1 font-medium">{label}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Notifications Modal */}
      <MobileNotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    </div>
  );
}
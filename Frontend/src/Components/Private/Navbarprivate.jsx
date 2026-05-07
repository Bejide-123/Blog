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
  MessageSquare,
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
  const [messagesCount, setMessagesCount] = useState(0);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const nav = useNavigate();

  useEffect(() => { setCurrentPath(location.pathname); }, [location.pathname]);

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

  useEffect(() => {
    if (user?.id) fetchNotificationCount();
  }, [user?.id]);

  useEffect(() => {
    let subscription = null;
    if (user?.id) {
      subscription = subscribeToNotifications(user.id, (payload) => {
        if (payload.eventType === 'INSERT') setNotificationCount(prev => prev + 1);
      });
    }
    return () => { if (subscription) unsubscribeFromNotifications(subscription); };
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

  const getAvatarUrl = () => {
    if (!user) return "https://api.dicebear.com/7.x/avataaars/svg?seed=default";
    return user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || user?.email || "user"}`;
  };

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      let searchType = 'posts';
      if (searchQuery.trim().startsWith('@')) searchType = 'users';
      else if (searchQuery.trim().startsWith('#')) searchType = 'tags';
      nav(`/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}&sort=relevance`);
      setShowSearchModal(false);
      setShowSearchSuggestions(false);
      setSearchQuery("");
    }
  };

  const searchSuggestions = [
    { icon: <Hash className="w-4 h-4" />, text: "#react", type: "tag" },
    { icon: <TrendingUp className="w-4 h-4" />, text: "Trending posts", type: "trending" },
    { icon: <BookOpen className="w-4 h-4" />, text: "Tutorials", type: "category" },
    { icon: <User className="w-4 h-4" />, text: "@popularuser", type: "user" },
  ];

  const desktopNavItems = [
    { path: "/home", label: "Feed", active: currentPath === "/home" },
    { path: "/saved", label: "Saved", active: currentPath === "/saved" },
    { path: "/messages", label: "Messages", active: currentPath === "/messages" },
  ];

  const mobileNavItems = [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/saved", icon: Bookmark, label: "Saved" },
    { path: "/create", icon: PlusCircle, label: "Create", isCenter: true },
    { path: "/messages", icon: MessageSquare, label: "Messages", badge: messagesCount },
    { icon: Bell, label: "Alerts", badge: notificationCount, isNotification: true },
  ];

  const isLight = theme === "light";

  return (
    <div className={isLight ? "bg-gray-50" : "bg-slate-900"}>

      {/* ── Desktop/Tablet Top Navbar ── */}
      <nav className={`hidden md:block fixed top-0 left-0 right-0
        ${isLight ? 'bg-white/95 border-gray-200/50' : 'bg-slate-800/95 border-slate-700/50'}
        backdrop-blur-lg border-b shadow-sm z-50`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <button onClick={() => handleNavClick("/home")}
                className="group flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity" />
                  <Feather className={`relative w-8 h-8 ${isLight ? 'text-blue-600' : 'text-blue-500'}`} />
                </div>
                <h1 className={`text-2xl font-bold bg-gradient-to-r ${isLight ? 'from-blue-600 to-purple-600' : 'from-blue-500 to-purple-500'} bg-clip-text text-transparent`}>
                  Scribe
                </h1>
                <Sparkles className="w-4 h-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <div className="hidden md:flex items-center gap-1 ml-8">
                {desktopNavItems.map((item) => (
                  <button key={item.path} onClick={() => handleNavClick(item.path)}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${item.active
                        ? isLight ? 'text-blue-600 bg-blue-50' : 'text-blue-400 bg-blue-900/20'
                        : isLight ? 'text-gray-600 hover:text-blue-600 hover:bg-gray-50' : 'text-gray-400 hover:text-blue-400 hover:bg-slate-700/50'
                      }`}
                  >
                    {item.label}
                    {item.active && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-2xl mx-8 hidden lg:flex">
              <div className="relative w-full">
                <div className="relative group">
                  <input type="text" value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowSearchSuggestions(e.target.value.length > 0); }}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                    onFocus={() => searchQuery.length > 0 && setShowSearchSuggestions(true)}
                    placeholder="@username, #topic, or keywords..."
                    className={`w-full pl-12 pr-4 py-2.5 border rounded-full focus:outline-none focus:ring-2 transition-all duration-200
                      ${isLight
                        ? 'border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-400 group-hover:bg-white focus:ring-blue-500/50 focus:border-blue-500'
                        : 'border-slate-600 bg-slate-700 text-white placeholder:text-slate-500 group-hover:bg-slate-600 focus:ring-blue-400/50 focus:border-blue-400'
                      }`}
                  />
                  <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isLight ? 'text-gray-400 group-hover:text-blue-500' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`} />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 ${isLight ? 'text-gray-400 hover:text-gray-600' : 'text-slate-500 hover:text-slate-300'} transition-colors`}>
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {showSearchSuggestions && searchQuery && (
                  <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg border py-2 z-20
                    ${isLight ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700'}`}>
                    <div className={`px-4 py-2 border-b ${isLight ? 'border-gray-100' : 'border-slate-700'}`}>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Quick Search</p>
                    </div>
                    {searchSuggestions.map((s, i) => (
                      <button key={i} onClick={() => { setSearchQuery(s.text); handleSearch({ preventDefault: () => {} }); }}
                        className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors text-left
                          ${isLight ? 'text-gray-700 hover:bg-gray-50 hover:text-blue-600' : 'text-gray-300 hover:bg-slate-700/50 hover:text-blue-400'}`}>
                        {s.icon}
                        <span>{s.text}</span>
                        <span className={`ml-auto text-xs px-2 py-1 rounded-full ${isLight ? 'bg-gray-100 text-gray-500' : 'bg-slate-700 text-slate-400'}`}>{s.type}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button onClick={() => handleNavClick("/create")}
                className={`hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r text-white rounded-lg active:scale-95 transition-all duration-200 font-semibold shadow-md hover:shadow-lg
                  ${isLight ? 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 'from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'}`}>
                <PlusCircle className="w-5 h-5" />
                <span>Create Story</span>
              </button>

              <div className="relative">
                <button onClick={() => setIsNotificationModalOpen(!isNotificationModalOpen)}
                  className={`relative p-2 rounded-lg transition-colors group
                    ${isLight ? 'text-gray-600 hover:text-blue-600 hover:bg-gray-100' : 'text-gray-400 hover:text-blue-400 hover:bg-slate-700/50'}`}>
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                      {notificationCount}
                    </span>
                  )}
                </button>
                <NotificationDropdown isOpen={isNotificationModalOpen} onClose={() => setIsNotificationModalOpen(false)} />
              </div>

              <div className="relative">
                <button onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                  className={`w-10 h-10 rounded-full border-2 border-transparent overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95
                    ${isLight ? 'hover:border-blue-500' : 'hover:border-blue-400'}`}>
                  <img src={getAvatarUrl()} alt={getDisplayUsername()} className="w-full h-full object-cover" />
                </button>
                {showAvatarMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowAvatarMenu(false)} />
                    <div className={`absolute right-0 mt-2 w-64 rounded-xl shadow-xl border py-2 z-20
                      ${isLight ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700'}`}>
                      <div className={`px-4 py-3 border-b ${isLight ? 'border-gray-100' : 'border-slate-700'}`}>
                        <p className={`text-sm font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>@{getDisplayUsername()}</p>
                        <p className={`text-xs mt-1 ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>{user?.email || "Welcome to Scribe!"}</p>
                      </div>
                      <div className="py-2">
                        {[
                          { path: "/profile", icon: User, label: "My Profile" },
                          { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
                          { path: "/settings", icon: Settings, label: "Settings" },
                        ].map(({ path, icon: Icon, label }) => (
                          <button key={path} onClick={() => { handleNavClick(path); setShowAvatarMenu(false); }}
                            className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors text-left
                              ${isLight ? 'text-gray-700 hover:bg-gray-50 hover:text-blue-600' : 'text-gray-300 hover:bg-slate-700/50 hover:text-blue-400'}`}>
                            <Icon className="w-4 h-4" />
                            <span>{label}</span>
                          </button>
                        ))}
                      </div>
                      <div className={`border-t pt-2 ${isLight ? 'border-gray-100' : 'border-slate-700'}`}>
                        <button onClick={handleLogout}
                          className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors text-left
                            ${isLight ? 'text-red-600 hover:bg-red-50' : 'text-red-400 hover:bg-red-900/20'}`}>
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

      {/* ── Mobile Top Bar ── */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-50
        ${isLight ? 'bg-white/95 border-gray-200/50' : 'bg-slate-800/95 border-slate-700/50'}
        backdrop-blur-lg border-b shadow-sm`}
      >
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={() => handleNavClick("/home")} className="group flex items-center gap-2">
            <Feather className={`w-6 h-6 ${isLight ? 'text-blue-600' : 'text-blue-500'}`} />
            <h1 className={`text-lg font-bold bg-gradient-to-r ${isLight ? 'from-blue-600 to-purple-600' : 'from-blue-500 to-purple-500'} bg-clip-text text-transparent`}>
              Scribe
            </h1>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowSearchModal(true)}
              className={`p-2 rounded-lg transition-colors ${isLight ? 'text-gray-600 hover:text-blue-600 hover:bg-gray-100' : 'text-gray-400 hover:text-blue-500 hover:bg-slate-700/50'}`}>
              <Search className="w-5 h-5" />
            </button>
            <button onClick={() => setShowAvatarMenu(!showAvatarMenu)}
              className={`w-8 h-8 rounded-full border-2 border-transparent overflow-hidden transition-colors ${isLight ? 'hover:border-blue-500' : 'hover:border-blue-400'}`}>
              <img src={getAvatarUrl()} alt={getDisplayUsername()} className="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        {showAvatarMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowAvatarMenu(false)} />
            <div className={`absolute right-4 top-14 w-56 rounded-xl shadow-xl border py-2 z-50
              ${isLight ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700'}`}>
              <div className={`px-4 py-3 border-b ${isLight ? 'border-gray-100' : 'border-slate-700'}`}>
                <p className={`text-sm font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>@{getDisplayUsername()}</p>
              </div>
              <div className="py-2">
                {[
                  { path: "/profile", icon: User, label: "My Profile" },
                  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
                  { path: "/settings", icon: Settings, label: "Settings" },
                ].map(({ path, icon: Icon, label }) => (
                  <button key={path} onClick={() => { handleNavClick(path); setShowAvatarMenu(false); }}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors text-left
                      ${isLight ? 'text-gray-700 hover:bg-gray-50 hover:text-blue-600' : 'text-gray-300 hover:bg-slate-700/50 hover:text-blue-400'}`}>
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
              <div className={`border-t pt-2 ${isLight ? 'border-gray-100' : 'border-slate-700'}`}>
                <button onClick={handleLogout}
                  className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors text-left
                    ${isLight ? 'text-red-600 hover:bg-red-50' : 'text-red-400 hover:bg-red-900/20'}`}>
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Mobile Search Modal ── */}
      {showSearchModal && (
        <div className={`md:hidden fixed inset-0 z-50 flex flex-col ${isLight ? 'bg-white' : 'bg-slate-900'}`}>
          <div className={`flex items-center gap-3 px-4 py-3 border-b ${isLight ? 'border-gray-200 bg-white' : 'border-slate-700 bg-slate-800'}`}>
            <button onClick={() => setShowSearchModal(false)}
              className={`${isLight ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'} font-medium transition-colors`}>
              Cancel
            </button>
            <div className="flex-1 relative">
              <input type="text" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                placeholder="@username, #topic, or keywords..."
                autoFocus
                className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2
                  ${isLight ? 'bg-gray-100 text-gray-900 placeholder:text-gray-400 focus:ring-blue-500' : 'bg-slate-700 text-white placeholder:text-slate-500 focus:ring-blue-400'}`}
              />
              <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isLight ? 'text-gray-400' : 'text-slate-500'}`} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <p className={`text-sm font-semibold mb-3 ${isLight ? 'text-gray-500' : 'text-slate-400'}`}>Trending Searches</p>
            <div className="space-y-2">
              {searchSuggestions.map((s, i) => (
                <button key={i} onClick={() => { setSearchQuery(s.text); handleSearch({ preventDefault: () => {} }); }}
                  className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors text-left
                    ${isLight ? 'bg-gray-50 hover:bg-gray-100' : 'bg-slate-800 hover:bg-slate-700'}`}>
                  {s.icon}
                  <span className={isLight ? 'text-gray-700' : 'text-gray-300'}>{s.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Bottom Navigation ── */}
      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50
          ${isLight ? 'bg-white/96 border-gray-200/60' : 'bg-slate-900/96 border-slate-700/50'}
          border-t backdrop-blur-xl`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-end justify-around px-1 pt-2 pb-2">
          {mobileNavItems.map(({ path, icon: Icon, label, isCenter, badge, isNotification }) => {
            const isActive = !isCenter && !isNotification && currentPath === path;

            // ── Floating Create button ──
            if (isCenter) {
              return (
                <button
                  key={label}
                  onClick={() => handleNavClick(path)}
                  className="relative flex flex-col items-center -mt-6 active:scale-95 transition-transform duration-150"
                >
                  <div
                    className="w-14 h-14 flex items-center justify-center rounded-2xl shadow-lg transition-shadow duration-200 hover:shadow-xl"
                    style={{
                      background: isLight
                        ? "linear-gradient(135deg, #2563eb, #7c3aed)"
                        : "linear-gradient(135deg, #3b82f6, #6d28d9)",
                      boxShadow: isLight
                        ? "0 8px 24px rgba(37,99,235,0.45), 0 2px 8px rgba(124,58,237,0.3)"
                        : "0 8px 24px rgba(59,130,246,0.4), 0 2px 8px rgba(109,40,217,0.35)",
                    }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-[10px] font-semibold mt-1.5 ${isLight ? 'text-gray-400' : 'text-slate-500'}`}>
                    {label}
                  </span>
                </button>
              );
            }

            // ── Regular nav item ──
            return (
              <button
                key={path || label}
                onClick={() => {
                  if (isNotification) setIsNotificationModalOpen(!isNotificationModalOpen);
                  else if (path) handleNavClick(path);
                }}
                className="relative flex flex-col items-center flex-1 py-0.5 active:scale-95 transition-transform duration-150"
              >
                {/* Pill indicator */}
                <div
                  className={`relative flex items-center justify-center w-11 h-7 rounded-full mb-1 transition-all duration-200
                    ${isActive
                      ? isLight ? 'bg-blue-50' : 'bg-blue-900/30'
                      : 'bg-transparent'
                    }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-all duration-200
                      ${isActive
                        ? isLight ? 'text-blue-600' : 'text-blue-400'
                        : isLight ? 'text-gray-400' : 'text-slate-500'
                      }`}
                    strokeWidth={isActive ? 2.3 : 1.8}
                  />
                  {/* Badge */}
                  {badge > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-[10px] font-semibold leading-none transition-colors duration-200
                    ${isActive
                      ? isLight ? 'text-blue-600' : 'text-blue-400'
                      : isLight ? 'text-gray-400' : 'text-slate-500'
                    }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
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
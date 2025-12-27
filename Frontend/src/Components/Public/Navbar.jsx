import React, { useState, useEffect, useRef, useCallback } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { FiFeather, FiUser, FiLogIn, FiHome, FiInfo, FiBook, FiMail, FiChevronRight, FiSun, FiMoon } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../Context/themeContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Update scrolled state
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Update active section
      const sections = ['home', 'about', 'posts', 'contact'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle body overflow when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const toggleSidebar = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleNavigate = useCallback((path) => {
    navigate(path);
    setIsOpen(false);
  }, [navigate]);

  // Handle scrolling to sections with improved logic
  const scrollToSection = useCallback((sectionId) => {
    setIsOpen(false);
    
    const isOnLandingPage = location.pathname === "/" || location.pathname === "";
    
    if (!isOnLandingPage) {
      navigate("/", { replace: true });
      // Clear any existing timeout
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      timeoutRef.current = setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ 
            behavior: "smooth", 
            block: "start" 
          });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: "smooth", 
          block: "start" 
        });
      }
    }
    
    // Update active section immediately for better UX
    setActiveSection(sectionId);
  }, [location.pathname, navigate]);

  const navItems = [
    { id: "home", label: "Home", icon: <FiHome className="w-4 h-4" /> },
    { id: "about", label: "About", icon: <FiInfo className="w-4 h-4" /> },
    { id: "posts", label: "Stories", icon: <FiBook className="w-4 h-4" /> },
    { id: "contact", label: "Contact", icon: <FiMail className="w-4 h-4" /> },
  ];

  const isLandingPage = location.pathname === "/" || location.pathname === "";

  return (
    <>
      {/* Progress Bar */}
      <div className={`fixed top-0 left-0 right-0 h-1 ${theme === 'light' ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20' : 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10'} z-50`}>
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ 
            width: `${Math.min((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100, 100)}%` 
          }}
        />
      </div>

      <nav
        className={`fixed top-1 left-0 w-full z-40 transition-all duration-500 ${
          isScrolled 
            ? theme === 'light' ? "bg-white/95 backdrop-blur-lg shadow-lg py-2" : "bg-gray-900/95 backdrop-blur-lg shadow-lg py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
          {/* Logo with enhanced styling */}
          <button 
            onClick={() => scrollToSection("home")} 
            className="group flex items-center gap-2.5 focus:outline-none"
            onMouseEnter={() => setHoveredItem('logo')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="relative">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isScrolled 
                  ? "bg-gradient-to-br from-blue-600 to-purple-600" 
                  : "bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm"
              } ${hoveredItem === 'logo' ? 'scale-110' : ''}`}>
                <FiFeather className={`w-6 h-6 transition-all duration-300 ${
                  isScrolled ? 'text-white' : 'text-white'
                } ${hoveredItem === 'logo' ? 'rotate-12' : ''}`} />
              </div>
              {hoveredItem === 'logo' && (
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20 animate-pulse" />
              )}
            </div>
            
            <div className="flex flex-col items-start">
              <h1
                className={`text-xl sm:text-2xl font-bold tracking-tight transition-all duration-300 ${
                  isScrolled ? (theme === 'light' ? "text-slate-900" : "text-white") : "text-white"
                } ${hoveredItem === 'logo' ? 'scale-105' : ''}`}
              >
                Scribe
              </h1>
              <span className={`text-xs transition-all duration-300 ${
                isScrolled ? (theme === 'light' ? "text-slate-500" : "text-white/70") : "text-white/70"
              }`}>
                Share your story
              </span>
            </div>
          </button>

          {/* Center Links - Desktop */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className={`flex items-center gap-2 ${isScrolled ? (theme === 'light' ? 'bg-white/10' : 'bg-gray-800/10') : 'bg-white/10'} backdrop-blur-sm rounded-2xl p-1.5 border ${isScrolled ? (theme === 'light' ? 'border-gray-200/50' : 'border-gray-700/50') : 'border-white/20'}`}>
              {navItems.map((item) => {
                const isActive = activeSection === item.id && isLandingPage;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 relative group ${
                      isScrolled 
                        ? isActive 
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" 
                          : theme === 'light' ? "text-slate-700 hover:text-blue-600" : "text-gray-300 hover:text-blue-400"
                        : isActive
                          ? "bg-white/20 text-white backdrop-blur-sm"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                    )}
                    
                    {/* Hover effect */}
                    {hoveredItem === item.id && !isActive && (
                      <div className="absolute inset-0 bg-white/5 rounded-xl" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`group flex items-center gap-2 py-2.5 px-2.5 rounded-xl font-semibold transition-all duration-300 active:scale-95 ${
                isScrolled
                  ? theme === 'light' ? "text-slate-700 hover:bg-slate-100 border border-slate-200" : "text-gray-300 hover:bg-gray-800 border border-gray-700"
                  : "text-white hover:bg-white/10 border border-white/30"
              }`}
              onMouseEnter={() => setHoveredItem('theme')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {theme === 'light' ? <FiMoon className="w-4 h-4" /> : <FiSun className="w-4 h-4" />}
            </button>
            <button
              onClick={() => navigate("/login?mode=login")}
              className={`group flex items-center gap-2 py-2.5 px-5 rounded-xl font-semibold transition-all duration-300 active:scale-95 ${
                isScrolled
                  ? theme === 'light' ? "text-slate-700 hover:bg-slate-100 border border-slate-200" : "text-gray-300 hover:bg-gray-800 border border-gray-700"
                  : "text-white hover:bg-white/10 border border-white/30"
              }`}
              onMouseEnter={() => setHoveredItem('login')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <FiLogIn className={`w-4 h-4 transition-transform duration-300 ${
                hoveredItem === 'login' ? 'translate-x-0.5' : ''
              }`} />
              <span>Login</span>
            </button>

            <button
              onClick={() => navigate("/login?mode=register")}
              className="group relative py-2.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 overflow-hidden"
              onMouseEnter={() => setHoveredItem('signup')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative flex items-center gap-2">
                <FiUser className="w-4 h-4" />
                Sign Up
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className={`lg:hidden p-2.5 rounded-xl transition-all duration-300 active:scale-95 group ${
              isScrolled 
                ? theme === 'light' ? "hover:bg-slate-100" : "hover:bg-gray-800"
                : "hover:bg-white/20"
            }`}
            aria-label="Toggle menu"
            onMouseEnter={() => setHoveredItem('menu')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="relative">
              <GiHamburgerMenu
                className={`w-6 h-6 transition-all duration-300 ${
                  isScrolled ? (theme === 'light' ? "text-slate-700" : "text-white") : "text-white"
                } ${hoveredItem === 'menu' ? 'rotate-90' : ''}`}
              />
              {hoveredItem === 'menu' && (
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-sm" />
              )}
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 ${theme === 'light' ? 'bg-gradient-to-b from-white via-gray-50 to-white' : 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900'} shadow-2xl transform transition-all duration-500 ease-out z-50 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center justify-between p-6 border-b ${theme === 'light' ? 'border-gray-200/50' : 'border-gray-700/50'} flex-shrink-0`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <FiFeather className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Scribe</h2>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Your writing platform</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-xl ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-800'} transition-all duration-300 active:scale-95 group`}
            aria-label="Close menu"
          >
            <div className="relative">
              <IoMdClose className={`w-6 h-6 ${theme === 'light' ? 'text-gray-700 group-hover:text-gray-900' : 'text-gray-300 group-hover:text-white'} transition-colors`} />
              <div className="absolute -inset-1 bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity" />
            </div>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-grow overflow-y-auto">
          {/* Sidebar Navigation */}
          <nav className="flex flex-col p-6">
            <h3 className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider mb-4`}>
              Navigation
            </h3>
            
            <div className="flex flex-col gap-1 mb-8">
              {navItems.map((item) => {
                const isActive = activeSection === item.id && isLandingPage;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 text-left ${
                      isActive
                        ? theme === 'light' ? "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100" : "bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-800/50"
                        : theme === 'light' ? "hover:bg-gray-50" : "hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : theme === 'light' ? "bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600" : "bg-gray-800 text-gray-400 group-hover:bg-blue-900/50 group-hover:text-blue-400"
                      }`}>
                        {item.icon}
                      </div>
                      <span className={`font-medium ${
                        isActive ? (theme === 'light' ? "text-gray-900" : "text-white") : (theme === 'light' ? "text-gray-700 group-hover:text-gray-900" : "text-gray-300 group-hover:text-white")
                      }`}>
                        {item.label}
                      </span>
                    </div>
                    <FiChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                      isActive ? "text-blue-600 rotate-0" : "text-gray-400 group-hover:text-gray-600 -rotate-90"
                    }`} />
                  </button>
                );
              })}
            </div>

            {/* Mobile Auth Buttons */}
            <h3 className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider mb-4`}>
              Account
            </h3>
            
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => handleNavigate("/login?mode=login")}
                className={`group flex items-center gap-3 w-full py-3.5 px-4 rounded-xl font-medium ${theme === 'light' ? 'text-gray-700 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50' : 'text-gray-300 border-2 border-gray-700 hover:border-blue-500 hover:bg-blue-900/50'} transition-all duration-300 active:scale-95`}
              >
                <div className={`w-9 h-9 rounded-lg ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'} flex items-center justify-center ${theme === 'light' ? 'group-hover:bg-blue-100' : 'group-hover:bg-blue-900/50'} transition-colors`}>
                  <FiLogIn className={`w-4 h-4 ${theme === 'light' ? 'text-gray-600 group-hover:text-blue-600' : 'text-gray-400 group-hover:text-blue-400'}`} />
                </div>
                <span>Login to your account</span>
              </button>

              <button
                onClick={() => handleNavigate("/login?mode=register")}
                className="group relative w-full py-4 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 overflow-hidden flex items-center gap-3"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                  <FiUser className="w-5 h-5" />
                </div>
                <span className="relative">Create free account</span>
              </button>
              
              <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} text-center mt-4 px-2`}>
                Join 10,000+ writers sharing their stories
              </p>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className={`flex-shrink-0 p-6 border-t ${theme === 'light' ? 'border-gray-200/50' : 'border-gray-700/50'} ${theme === 'light' ? 'bg-gradient-to-r from-blue-50/30 to-purple-50/30' : 'bg-gradient-to-r from-blue-900/20 to-purple-900/20'}`}>
          <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-center`}>
            Ready to start your writing journey?
          </p>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default React.memo(Navbar);

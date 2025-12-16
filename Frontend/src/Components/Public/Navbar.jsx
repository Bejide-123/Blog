import React, { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { FiFeather } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  // Handle scrolling to sections
  const scrollToSection = (sectionId) => {
    setIsOpen(false);
    
    // Check if we're on the landing page
    const isOnLandingPage = location.pathname === "/" || location.pathname === "";
    
    if (!isOnLandingPage) {
      // Navigate to home first
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    } else {
      // Already on landing page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between py-4 px-6 w-full max-w-7xl mx-auto">
          {/* Logo */}
          <button onClick={() => scrollToSection("home")} className="group">
            <h1
              className={`text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 group-hover:text-blue-600 transition-colors duration-200 ${
                isScrolled ? "text-slate-900" : "text-white"
              }`}
            >
              Scribe{" "}
              <FiFeather className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />
            </h1>
          </button>

          {/* Center Links - Desktop */}
          <div className="hidden lg:flex flex-1 justify-center">
            <div className="flex items-center gap-10">
              <button
                onClick={() => scrollToSection("home")}
                className={`text-lg font-semibold hover:text-blue-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 cursor-pointer after:transition-all after:duration-200 hover:after:w-full ${
                  isScrolled ? "text-slate-700" : "text-white"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className={`text-lg font-semibold cursor-pointer hover:text-blue-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-200 hover:after:w-full ${
                  isScrolled ? "text-slate-700" : "text-white"
                }`}
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("posts")}
                className={`text-lg font-semibold cursor-pointer hover:text-blue-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-200 hover:after:w-full ${
                  isScrolled ? "text-slate-700" : "text-white"
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className={`text-lg font-semibold cursor-pointer hover:text-blue-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-200 hover:after:w-full ${
                  isScrolled ? "text-slate-700" : "text-white"
                }`}
              >
                Contact
              </button>
            </div>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => navigate("/login?mode=login")}
              className={`py-2.5 px-6 rounded-lg font-semibold text-base transition-all duration-200 active:scale-95 cursor-pointer ${
                isScrolled
                  ? "text-slate-700 hover:bg-gray-100"
                  : "text-white hover:bg-white hover:text-blue-600"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => navigate("/login?mode=signup")}
              className="py-2.5 px-6 rounded-lg font-semibold text-base text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className={`lg:hidden p-2 rounded-lg transition-colors duration-200 active:scale-95 ${
              isScrolled ? "hover:bg-gray-100" : "hover:bg-white/20"
            }`}
            aria-label="Toggle menu"
          >
            <GiHamburgerMenu
              className={`w-6 h-6 ${
                isScrolled ? "text-slate-700" : "text-white"
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-slate-900">Menu</h2>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 active:scale-95"
            aria-label="Close menu"
          >
            <IoMdClose className="w-6 h-6 text-slate-700" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex flex-col p-6">
          <div className="flex flex-col gap-2 mb-6">
            <button
              onClick={() => scrollToSection("home")}
              className="text-lg font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg transition-all duration-200 text-left"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-lg font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg transition-all duration-200 text-left"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("posts")}
              className="text-lg font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg transition-all duration-200 text-left"
            >
              Posts
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-lg font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg transition-all duration-200 text-left"
            >
              Contact
            </button>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => handleNavigate("/login?mode=login")}
              className="w-full py-3 px-5 rounded-lg font-semibold text-base text-slate-700 border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-all duration-200 active:scale-95"
            >
              Login
            </button>

            <button
              onClick={() => handleNavigate("/login?mode=signup")}
              className="w-full py-3 px-5 rounded-lg font-semibold text-base text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
            >
              Sign Up
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Navbar;
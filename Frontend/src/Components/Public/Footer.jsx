import React, { useState } from "react";
import { 
  FaTwitter, 
  FaFacebookF, 
  FaLinkedinIn, 
  FaInstagram,
  FaGithub,
  FaYoutube,
  FaHeart,
  FaArrowUp
} from "react-icons/fa";
import { 
  FiFeather, 
  FiMail, 
  FiChevronRight,
  FiExternalLink 
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../Context/themeContext";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Check scroll position for scroll-to-top button
  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const isOnLandingPage = location.pathname === "/" || location.pathname === "";
    
    if (!isOnLandingPage) {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log("Subscribed:", email);
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const socialLinks = [
    { icon: <FaTwitter />, label: "Twitter", url: "#", color: "hover:text-blue-400" },
    { icon: <FaFacebookF />, label: "Facebook", url: "#", color: "hover:text-blue-600" },
    { icon: <FaLinkedinIn />, label: "LinkedIn", url: "#", color: "hover:text-blue-700" },
    { icon: <FaInstagram />, label: "Instagram", url: "#", color: "hover:text-pink-500" },
    { icon: <FaGithub />, label: "GitHub", url: "#", color: "hover:text-gray-300" },
    { icon: <FaYoutube />, label: "YouTube", url: "#", color: "hover:text-red-500" },
  ];

  const quickLinks = [
    { label: "Latest Stories", action: () => scrollToSection("posts") },
    { label: "Get Started", action: () => navigate("/login?mode=register") },
    { label: "About Us", action: () => scrollToSection("about") },
    { label: "Contact", action: () => scrollToSection("contact") },
  ];

  const resources = [
    { label: "Terms of Service", url: "#" },
    { label: "Privacy Policy", url: "#" },
    { label: "Help Center", url: "#" },
    { label: "Community Guidelines", url: "#" },
  ];

  const platformLinks = [
    { label: "For Writers", url: "#" },
    { label: "For Readers", url: "#" },
    { label: "Success Stories", url: "#" },
    { label: "Blog", url: "#" },
  ];

  return (
    <>
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center group"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="w-5 h-5 transform group-hover:-translate-y-1 transition-transform" />
        </button>
      )}

      <footer className={`relative overflow-hidden ${theme === 'light' ? 'bg-gradient-to-br from-gray-100 via-white to-gray-100 text-gray-700' : 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300'} pt-16 pb-8`}>
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <FiFeather className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-20 blur-sm" />
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Scribe</h3>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Share Your Story</p>
                </div>
              </div>
              
              <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} leading-relaxed mb-8 max-w-md`}>
                A community-driven platform where writers and readers connect through authentic storytelling. 
                Share your voice, discover new perspectives, and grow together.
              </p>

              {/* Newsletter Subscription */}
              <div className="mb-8">
                <h4 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-4 flex items-center gap-2`}>
                  <FiMail className="w-5 h-5" />
                  Stay Updated
                </h4>
                <form onSubmit={handleSubscribe} className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className={`w-full px-4 py-3 pr-12 rounded-xl ${theme === 'light' ? 'bg-gray-200/50 border-gray-300/50 text-gray-800 placeholder-gray-500' : 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all`}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition-all duration-300"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </form>
                {isSubscribed && (
                  <p className="mt-2 text-sm text-green-400 animate-fade-in">
                    🎉 Thanks for subscribing!
                  </p>
                )}
              </div>

              {/* Social Links */}
              <div>
                <h4 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-4`}>
                  Connect With Us
                </h4>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className={`w-10 h-10 rounded-lg ${theme === 'light' ? 'bg-gray-200/50 border-gray-300/50' : 'bg-gray-800/50 border-gray-700'} flex items-center justify-center 
                                ${social.color} ${theme === 'light' ? 'hover:bg-gray-300/50' : 'hover:bg-gray-700/50'} hover:scale-110 
                                transition-all duration-300 group relative`}
                      aria-label={social.label}
                      onMouseEnter={() => setHoveredLink(social.label)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      {social.icon}
                      {hoveredLink === social.label && (
                        <span className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 ${theme === 'light' ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'} text-xs rounded whitespace-nowrap`}>
                          {social.label}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Quick Links */}
              <div>
                <h4 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-6 pb-2 border-b ${theme === 'light' ? 'border-gray-300/50' : 'border-gray-700/50'}`}>
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <button
                        onClick={link.action}
                        className={`group flex items-center gap-2 ${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'} transition-all duration-300 hover:translate-x-1`}
                      >
                        <FiChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-6 pb-2 border-b ${theme === 'light' ? 'border-gray-300/50' : 'border-gray-700/50'}`}>
                  Resources
                </h4>
                <ul className="space-y-3">
                  {resources.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.url}
                        className={`group flex items-center gap-2 ${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'} transition-all duration-300 hover:translate-x-1`}
                      >
                        <FiExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Platform */}
              <div>
                <h4 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-6 pb-2 border-b ${theme === 'light' ? 'border-gray-300/50' : 'border-gray-700/50'}`}>
                  Platform
                </h4>
                <ul className="space-y-3">
                  {platformLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.url}
                        className={`group flex items-center gap-2 ${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'} transition-all duration-300 hover:translate-x-1`}
                      >
                        <FiChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-6 pb-2 border-b ${theme === 'light' ? 'border-gray-300/50' : 'border-gray-700/50'}`}>
                  Contact Info
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${theme === 'light' ? 'bg-gray-200/50' : 'bg-gray-800/50'} flex items-center justify-center flex-shrink-0`}>
                      <FiMail className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Email</p>
                      <a href="mailto:hello@scribe.com" className={`${theme === 'light' ? 'text-gray-800 hover:text-blue-600' : 'text-white hover:text-blue-400'} transition-colors`}>
                        hello@scribe.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${theme === 'light' ? 'bg-gray-200/50' : 'bg-gray-800/50'} flex items-center justify-center flex-shrink-0`}>
                      <FiFeather className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Office</p>
                      <p className={`${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>123 Story Street<br />Creative City, CC 10001</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`mt-12 pt-8 border-t ${theme === 'light' ? 'border-gray-300/50' : 'border-gray-700/50'}`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className={`flex items-center gap-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-sm`}>
                <p>
                  © {new Date().getFullYear()} Scribe. All rights reserved.
                </p>
                <span className="hidden md:inline">•</span>
                <p className="flex items-center gap-1">
                  Made with <FaHeart className="w-3 h-3 text-red-400 animate-pulse" /> for storytellers
                </p>
              </div>
              
              <div className={`flex flex-wrap gap-4 justify-center text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                <a href="#" className={`${theme === 'light' ? 'hover:text-gray-800' : 'hover:text-white'} transition-colors`}>Cookies Policy</a>
                <span className="hidden md:inline">•</span>
                <a href="#" className={`${theme === 'light' ? 'hover:text-gray-800' : 'hover:text-white'} transition-colors`}>Accessibility</a>
                <span className="hidden md:inline">•</span>
                <a href="#" className={`${theme === 'light' ? 'hover:text-gray-800' : 'hover:text-white'} transition-colors`}>Sitemap</a>
                <span className="hidden md:inline">•</span>
                <span>v2.1.0</span>
              </div>
            </div>
            
            {/* Stats */}
            <div className={`mt-6 pt-6 border-t ${theme === 'light' ? 'border-gray-300/30' : 'border-gray-700/30'}`}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {[
                  { label: "Active Writers", value: "10K+" },
                  { label: "Stories Published", value: "50K+" },
                  { label: "Countries", value: "150+" },
                  { label: "Monthly Readers", value: "1M+" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-1`}>{stat.value}</div>
                    <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider`}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default React.memo(Footer);

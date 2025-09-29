import React from "react";
import { FaTwitter, FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { FiFeather } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300 py-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
        
        {/* Brand / About */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center sm:justify-start gap-2">
            Scribe <FiFeather className="w-6 h-6 text-blue-500" />
          </h3>
          <p className="text-gray-400 leading-relaxed">
            Share your stories, insights, and experiences with a community of passionate writers.
          </p>
        </div>

        {/* Quick Links + Resources combined */}
        <div className="grid grid-cols-2 gap-6 sm:col-span-1 md:col-span-2 justify-center sm:justify-start">
          <div>
            <h4 className="text-xl font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/blogs" className="hover:text-blue-500 transition-colors duration-200">Latest Stories</a></li>
              <li><a href="/register" className="hover:text-blue-500 transition-colors duration-200">Get Started</a></li>
              <li><a href="#about" className="hover:text-blue-500 transition-colors duration-200">About Us</a></li>
              <li><a href="#contact" className="hover:text-blue-500 transition-colors duration-200">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-500 transition-colors duration-200">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors duration-200">Help Center</a></li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="mb-6 md:mb-0">
          <h4 className="text-xl font-semibold text-white mb-4">Follow Us</h4>
          <div className="flex justify-center sm:justify-start gap-4">
            {[FaTwitter, FaFacebookF, FaLinkedinIn, FaInstagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="hover:text-blue-500 transition-colors duration-200 transform hover:scale-110"
              >
                <Icon size={22} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Scribe. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

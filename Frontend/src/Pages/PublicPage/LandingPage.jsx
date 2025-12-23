import React, { useCallback, useRef, useState } from "react";
import Navbar from "../../Components/Public/Navbar";
import { Link } from "react-router-dom";
import backgroundImage from "../../assets/Hero.jpg";
import { SlideUp } from "../../Components/Public/FadeInSection"; 
import About from "../../Components/Public/About";
import Posts from "../../Components/Public/Posts";
import ContactSection from "../../Components/Public/Contact";
import Footer from "../../Components/Public/Footer";
import { FiChevronDown, FiFeather, FiPenTool, FiArrowUpRight, FiZap } from "react-icons/fi";

const LandingPage = () => {
  const postsSectionRef = useRef(null);
  const heroRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: "smooth", 
        block: "start" 
      });
    }
  }, []);

  const handleExploreClick = useCallback((e) => {
    e.preventDefault();
    scrollToSection("posts");
  }, [scrollToSection]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section
        ref={heroRef}
        aria-label="Hero section"
        className="relative min-h-screen bg-cover bg-center flex items-center justify-center overflow-hidden"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundAttachment: "fixed"
        }}
        id="home"
      >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-pink-900/20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white max-w-4xl mx-auto">
            <SlideUp delay={0.2} duration={1}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Share Your Stories with the World
              </h1>
            </SlideUp>

            <SlideUp delay={0.4} duration={1}>
              <p className="text-xl md:text-2xl lg:text-3xl mb-10 leading-relaxed">
                Write, publish, and connect with readers on{" "}
                <span className="font-bold text-blue-300">Scribe</span>.
              </p>
            </SlideUp>

            <SlideUp delay={0.6} duration={1}>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  to="/login?mode=register"
                  className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 
                           font-semibold text-lg text-white shadow-lg hover:shadow-xl 
                           hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
                  aria-label="Get started with Scribe"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    <FiFeather className="w-5 h-5" />
                    Start Writing Free
                  </span>
                </Link>
                
                <button
                  onClick={handleExploreClick}
                  className="group relative px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm 
                           border-2 border-white/30 font-semibold text-lg text-white 
                           hover:bg-white/20 hover:border-white/50 hover:scale-105 active:scale-95 
                           transition-all duration-300 overflow-hidden"
                  aria-label="Explore posts section"
                >
                  <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    <FiPenTool className="w-5 h-5" />
                    Explore Stories
                  </span>
                </button>
              </div>
            </SlideUp>

            <SlideUp delay={0.8} duration={1}>
              <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-center mt-16">
                {[
                  { value: "10K+", label: "Writers", icon: <FiFeather className="inline w-4 h-4 mb-1 ml-1" /> },
                  { value: "1M+", label: "Readers", icon: <FiPenTool className="inline w-4 h-4 mb-1 ml-1" /> },
                  { value: "50K+", label: "Stories", icon: <FiZap className="inline w-4 h-4 mb-1 ml-1" /> },
                  { value: "99%", label: "Satisfaction", icon: "💫" },
                ].map((stat, index) => (
                  <div key={index} className="group">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                      {stat.value}{stat.icon}
                    </div>
                    <div className="text-sm md:text-base text-gray-300 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </SlideUp>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={handleExploreClick}
            className="group flex flex-col items-center text-white hover:text-blue-300 
                     transition-all duration-300 animate-bounce"
            aria-label="Scroll to explore more"
          >
            <span className="text-sm mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Explore more
            </span>
            <FiChevronDown className="w-8 h-8 transform group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </section>

      {/* Main Content */}
      <main>
        <About />   

        <div ref={postsSectionRef} id="posts">
          <SlideUp>
            <Posts />
          </SlideUp>
        </div>

        <SlideUp>
          <ContactSection />
        </SlideUp>
      </main>

      <SlideUp>
        <Footer />
      </SlideUp>

      {/* Floating CTA Button - Bottom Right */}
      <div className="fixed bottom-8 right-8 z-50">
        <Link
          to="/login?mode=register"
          className="group relative flex items-center gap-3 px-6 py-4 rounded-full 
                   bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 
                   text-white font-semibold shadow-2xl shadow-blue-500/30 
                   hover:shadow-blue-500/50 hover:scale-105 active:scale-95 
                   transition-all duration-300 overflow-hidden"
          aria-label="Quick start writing"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Main content */}
          <div className="relative flex items-center gap-2">
            <div className="relative">
              <FiFeather className="w-6 h-6 transform group-hover:rotate-12 transition-transform duration-300" />
              {/* Animated sparkles */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping animation-delay-300"></div>
            </div>
            
            <div className="flex flex-col items-start">
              <span className={`hidden sm:inline transition-all duration-300 ${isHovered ? 'text-white' : 'text-white/90'}`}>
                Start Writing
              </span>
              <span className="sm:hidden">Write</span>
              <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-y-0 translate-y-2">
                It's free! ✨
              </span>
            </div>
            
            <FiArrowUpRight className="w-5 h-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
          </div>
        </Link>

        {/* Optional: Scroll to Top Button - appears when scrolling down */}
        {/* <button
          onClick={scrollToTop}
          className="mt-3 w-full px-4 py-2 rounded-full bg-gray-800/80 backdrop-blur-sm 
                   text-gray-300 text-sm font-medium hover:text-white hover:bg-gray-700/80 
                   transition-all duration-300 opacity-0 hover:opacity-100 border border-gray-700/50"
        >
          ↑ Back to top
        </button> */}
      </div>

      {/* Optional: Progress indicator */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gray-800 z-40">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ 
            width: `${Math.min((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100, 100)}%` 
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(LandingPage);
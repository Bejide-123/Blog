import React, { useState } from "react";
import { 
  FiEdit3, FiUsers, FiBookOpen, FiTrendingUp, FiHeart, FiStar,
  FiChevronRight, FiCheck, FiAward, FiGlobe, FiZap 
} from "react-icons/fi";
import { useNavigate } from "react-router-dom"; 

const About = () => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const features = [
    {
      icon: <FiEdit3 className="w-6 h-6" />,
      title: "Write Freely",
      description: "Express your thoughts without limits. Our intuitive editor makes writing a breeze, whether you're crafting a quick update or a detailed article.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FiBookOpen className="w-6 h-6" />,
      title: "Discover Stories",
      description: "Explore diverse content from tech to lifestyle. Find articles that inspire, educate, and entertain from writers around the world.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "Build Community",
      description: "Connect with readers and fellow writers. Engage through comments, build your audience, and grow together.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Track Growth",
      description: "Monitor your impact with analytics. See how your stories perform and understand your audience better.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <FiStar className="w-6 h-6" />,
      title: "Quality First",
      description: "Join a platform that values quality. Every story matters, and great writing gets the spotlight it deserves.",
      gradient: "from-yellow-500 to-amber-500"
    },
    {
      icon: <FiHeart className="w-6 h-6" />,
      title: "Share Passion",
      description: "Write about what you love. From personal experiences to professional insights, your passion finds a home here.",
      gradient: "from-rose-500 to-red-500"
    }
  ];

  const stats = [
    { label: "Active Writers", value: "10K+", icon: <FiEdit3 /> },
    { label: "Monthly Readers", value: "1M+", icon: <FiBookOpen /> },
    { label: "Stories Published", value: "50K+", icon: <FiAward /> },
    { label: "Countries", value: "150+", icon: <FiGlobe /> }
  ];

  const benefits = [
    "No hidden fees or premium walls",
    "Full ownership of your content",
    "Built-in SEO optimization",
    "Real-time analytics dashboard",
    "Mobile-responsive designs",
    "24/7 community support"
  ];

  return (
    <section id="about" className="relative overflow-hidden py-20 bg-gradient-to-b from-white via-gray-50/50 to-white">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50/50 to-transparent" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
            ✨ Platform Features
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Why Writers Love <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Scribe</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A modern platform designed for storytellers who want to share their voice and connect with engaged readers worldwide.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gray-100 text-gray-600">
                  {stat.icon}
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {stat.value}
                </span>
              </div>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Description */}
        <div className="mb-16">
          <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 md:p-10 shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 to-purple-500/5 rounded-full -translate-y-16 translate-x-16" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                More Than Just a Blogging Platform
              </h3>
              <div className="space-y-4 text-lg text-gray-700">
                <p className="leading-relaxed">
                  <span className="font-semibold text-blue-600">Scribe</span> redefines digital storytelling by combining powerful writing tools with a thriving community. We believe every voice deserves to be heard, and every story deserves an audience.
                </p>
                <p className="leading-relaxed">
                  Our platform is built on the principles of simplicity, creativity, and connection. Whether you're documenting your journey, sharing expertise, or exploring new ideas, Scribe provides the perfect environment for your words to flourish.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              Everything You Need to Succeed
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you write better, reach further, and grow faster.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="relative group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 
                  group-hover:opacity-10 transition-opacity duration-500 blur-xl
                `} />
                
                <div className={`
                  relative bg-white rounded-2xl p-7 border border-gray-200/50 
                  transition-all duration-500 hover:-translate-y-2
                  ${hoveredIndex === index ? 'shadow-2xl scale-[1.02]' : 'shadow-sm hover:shadow-lg'}
                  overflow-hidden
                `}>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 to-gray-200 group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-500" />
                  
                  <div className={`
                    w-14 h-14 rounded-xl flex items-center justify-center mb-6
                    bg-gradient-to-br ${feature.gradient} text-white
                    transform group-hover:scale-110 transition-transform duration-500
                  `}>
                    {feature.icon}
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                  </h4>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors">
                    <span>Learn more</span>
                    <FiChevronRight className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits List */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100/50">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                What You Get With Scribe
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <FiCheck className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Writing Journey?
            </h3>
            <p className="text-gray-600 text-lg">
              Join thousands of writers who've found their voice on Scribe. No experience required—just your passion for storytelling.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate("/login?mode=register")}
              className="group relative px-8 py-4 rounded-xl font-semibold text-lg text-white 
                       bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                       transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95
                       overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center">
                Start Writing Free
                <FiZap className="ml-2 w-5 h-5" />
              </span>
            </button>
            
            <button 
              onClick={() => navigate("/login?mode=login")}
              className="px-8 py-4 rounded-xl font-semibold text-lg 
                       text-gray-700 bg-white border-2 border-gray-300 
                       hover:border-gray-400 hover:bg-gray-50 
                       transition-all duration-300 active:scale-95 shadow-sm"
            >
              Sign In to Continue
            </button>
          </div>
          
          <p className="mt-6 text-gray-500 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default React.memo(About);
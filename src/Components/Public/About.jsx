import React from "react";
import { FiEdit3, FiUsers, FiBookOpen, FiTrendingUp, FiHeart, FiStar } from "react-icons/fi";

const About = () => {
  const features = [
    {
      icon: <FiEdit3 className="w-7 h-7" />,
      title: "Write Freely",
      description: "Express your thoughts without limits. Our intuitive editor makes writing a breeze, whether you're crafting a quick update or a detailed article."
    },
    {
      icon: <FiBookOpen className="w-7 h-7" />,
      title: "Discover Stories",
      description: "Explore diverse content from tech to lifestyle. Find articles that inspire, educate, and entertain from writers around the world."
    },
    {
      icon: <FiUsers className="w-7 h-7" />,
      title: "Build Community",
      description: "Connect with readers and fellow writers. Engage through comments, build your audience, and grow together."
    },
    {
      icon: <FiTrendingUp className="w-7 h-7" />,
      title: "Track Growth",
      description: "Monitor your impact with analytics. See how your stories perform and understand your audience better."
    },
    {
      icon: <FiStar className="w-7 h-7" />,
      title: "Quality Content",
      description: "Join a platform that values quality. Every story matters, and great writing gets the spotlight it deserves."
    },
    {
      icon: <FiHeart className="w-7 h-7" />,
      title: "Share Your Passion",
      description: "Write about what you love. From personal experiences to professional insights, your passion finds a home here."
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            About Scribe
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Your platform for authentic storytelling and meaningful connections
          </p>
        </div>

        {/* Main Description */}
        <div className="max-w-4xl mx-auto mb-14">
          <div className="bg-white rounded-xl shadow-md p-8 md:p-10 border border-gray-100">
            <p className="text-lg text-slate-700 leading-relaxed mb-4">
              <span className="font-bold text-blue-600">Scribe</span> is more than just a blogging platform—it's a vibrant community where writers and storytellers from all walks of life come together to share their unique perspectives.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              Whether you're a seasoned writer or just starting your journey, Scribe provides the perfect space to express yourself. From technology and lifestyle to personal growth and creative arts, all voices are welcome here.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-10">
            Why Choose Scribe?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-5 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
            Join our growing community of writers and readers. Your story matters.
          </p>
          <a href="/register">
            <button className="py-3 px-8 rounded-lg font-semibold text-base text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95">
              Get Started for Free
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
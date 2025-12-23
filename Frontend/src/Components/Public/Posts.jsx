import React, { useState } from "react";
import { 
  FiCalendar, 
  FiUser, 
  FiArrowRight, 
  FiClock,
  FiEye,
  FiHeart,
  FiBookmark,
  FiShare2,
  FiTrendingUp,
  FiChevronRight
} from "react-icons/fi";
import ai from "../../Images/Ai.jpg";
import Healthy from "../../Images/Healthy.jpg";
import business from "../../Images/Business.jpg";
import personalGrowth from "../../Images/PersonalGrowth.jpg";
import education from "../../Images/Education.jpg";
import web from "../../Images/Web.jpg"; 
import { useNavigate } from "react-router-dom";

const Posts = () => {
  const navigate = useNavigate();
  const [hoveredPost, setHoveredPost] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const posts = [
    {
      id: 1,
      image: web,
      category: "Technology",
      title: "The Future of Web Development in 2025",
      excerpt: "Exploring the latest trends and technologies shaping the future of web development, from AI integration to advanced frameworks.",
      author: "John Doe",
      date: "Jan 15, 2025",
      readTime: "5 min read",
      views: "2.4K",
      likes: 145,
      trending: true,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      image: Healthy,
      category: "Lifestyle",
      title: "10 Healthy Habits for a Better Life",
      excerpt: "Discover simple yet effective habits that can transform your daily routine and improve your overall well-being.",
      author: "Jane Smith",
      date: "Jan 12, 2025",
      readTime: "4 min read",
      views: "3.1K",
      likes: 234,
      trending: true,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 3,
      image: business,
      category: "Business",
      title: "Building a Successful Startup from Scratch",
      excerpt: "Learn the essential steps and strategies for launching and growing a successful startup in today's competitive market.",
      author: "Mike Johnson",
      date: "Jan 10, 2025",
      readTime: "8 min read",
      views: "1.8K",
      likes: 89,
      trending: false,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 4,
      image: personalGrowth,
      category: "Personal Growth",
      title: "Mastering the Art of Self-Discipline",
      excerpt: "Practical tips and mindset shifts to help you develop stronger self-discipline and achieve your goals.",
      author: "Sarah Williams",
      date: "Jan 8, 2025",
      readTime: "6 min read",
      views: "4.2K",
      likes: 321,
      trending: true,
      color: "from-amber-500 to-orange-500"
    },
    {
      id: 5,
      image: education,
      category: "Education",
      title: "The Power of Lifelong Learning",
      excerpt: "Why continuous learning is essential in the modern world and how to make it a sustainable part of your life.",
      author: "David Brown",
      date: "Jan 5, 2025",
      readTime: "7 min read",
      views: "2.9K",
      likes: 156,
      trending: false,
      color: "from-indigo-500 to-violet-500"
    },
    {
      id: 6,
      image: ai,
      category: "Technology",
      title: "Understanding AI and Machine Learning",
      excerpt: "A beginner-friendly guide to artificial intelligence and machine learning concepts that everyone should know.",
      author: "Emily Davis",
      date: "Jan 3, 2025",
      readTime: "10 min read",
      views: "5.7K",
      likes: 412,
      trending: true,
      color: "from-blue-600 to-purple-600"
    }
  ];

  const categories = [
    { id: "all", label: "All Posts", count: posts.length },
    { id: "technology", label: "Technology", count: posts.filter(p => p.category.toLowerCase() === "technology").length },
    { id: "lifestyle", label: "Lifestyle", count: posts.filter(p => p.category.toLowerCase() === "lifestyle").length },
    { id: "business", label: "Business", count: posts.filter(p => p.category.toLowerCase() === "business").length },
    { id: "personal", label: "Personal Growth", count: posts.filter(p => p.category.toLowerCase() === "personal growth").length },
    { id: "education", label: "Education", count: posts.filter(p => p.category.toLowerCase() === "education").length }
  ];

  const filteredPosts = activeFilter === "all" 
    ? posts 
    : posts.filter(post => post.category.toLowerCase().includes(activeFilter));

  const handlePostClick = (postId) => {
    // In a real app, you would navigate to the actual post
    // For now, redirect to login or show preview
    navigate(`/login?mode=login&redirect=/post/${postId}`);
  };

  return (
    <section id="posts" className="relative py-20 bg-gradient-to-b from-white via-gray-50/30 to-white">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50/30 to-transparent" />
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-purple-100/20 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
            📚 Featured Stories
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Inspiring</span> Content
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore thought-provoking articles and stories from our talented community of writers
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`
                px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                ${activeFilter === category.id 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md'
                }
                flex items-center gap-2
              `}
            >
              <span>{category.label}</span>
              <span className={`
                px-2 py-0.5 rounded-full text-xs
                ${activeFilter === category.id 
                  ? 'bg-white/20' 
                  : 'bg-gray-100'
                }
              `}>
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {filteredPosts.map((post) => (
            <article 
              key={post.id}
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200/50"
              onMouseEnter={() => setHoveredPost(post.id)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              {/* Trending Badge */}
              {post.trending && (
                <div className="absolute top-4 left-4 z-20">
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-lg">
                    <FiTrendingUp className="w-3 h-3" />
                    <span>Trending</span>
                  </div>
                </div>
              )}

              {/* Post Image with Overlay */}
              <div className="relative overflow-hidden h-56">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${post.color} shadow-md`}>
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <FiUser className="w-3.5 h-3.5" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiCalendar className="w-3.5 h-3.5" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiClock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 leading-tight">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Engagement Stats */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FiEye className="w-4 h-4" />
                      <span>{post.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiHeart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <FiBookmark className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <FiShare2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Read More Button */}
                <button 
                  onClick={() => handlePostClick(post.id)}
                  className="w-full group/btn flex items-center justify-between p-3 rounded-xl 
                           bg-gradient-to-r from-gray-50 to-white border border-gray-200 
                           hover:border-blue-300 hover:shadow-md transition-all duration-300"
                >
                  <span className="font-semibold text-gray-700 group-hover/btn:text-blue-600 transition-colors">
                    Read Full Story
                  </span>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white 
                                transform group-hover/btn:translate-x-1 transition-transform duration-300">
                    <FiArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>

              {/* Hover Effect Overlay */}
              <div className={`
                absolute inset-0 bg-gradient-to-br ${post.color} opacity-0 
                group-hover:opacity-5 transition-opacity duration-500 pointer-events-none
              `} />
            </article>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center">
            <button 
              onClick={() => navigate("/login?mode=login")}
              className="group relative px-10 py-5 rounded-2xl font-semibold text-lg 
                       bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                       hover:shadow-2xl hover:shadow-blue-500/25 active:scale-95
                       transition-all duration-300 overflow-hidden mb-4"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative flex items-center gap-3">
                Explore All Stories
                <FiChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <p className="text-gray-500 text-sm">
              Join thousands of readers discovering new insights daily
            </p>
          </div>
        </div>

        {/* Featured Writer Banner */}
        <div className="mt-20 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-2xl p-8 border border-blue-100/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Want to share your own stories?
              </h3>
              <p className="text-gray-600">
                Join our community of writers and reach thousands of engaged readers
              </p>
            </div>
            <button 
              onClick={() => navigate("/login?mode=register")}
              className="px-8 py-3 rounded-xl font-semibold 
                       bg-gradient-to-r from-gray-900 to-gray-700 text-white 
                       hover:shadow-lg active:scale-95 transition-all duration-300"
            >
              Start Writing Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Posts);
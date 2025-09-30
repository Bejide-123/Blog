import React from "react";
import { FiCalendar, FiUser, FiArrowRight } from "react-icons/fi";
import ai from "../../Images/Ai.jpg";
import Healthy from "../../Images/Healthy.jpg";
import business from "../../Images/Business.jpg";
import personalGrowth from "../../Images/PersonalGrowth.jpg";
import education from "../../Images/Education.jpg";
import web from "../../Images/Web.jpg"; 

const Posts = () => {
  const posts = [
    {
      id: 1,
      image: web,
      category: "Technology",
      title: "The Future of Web Development in 2025",
      excerpt: "Exploring the latest trends and technologies shaping the future of web development, from AI integration to advanced frameworks.",
      author: "John Doe",
      date: "Jan 15, 2025",
      categoryColor: "bg-blue-100 text-blue-600"
    },
    {
      id: 2,
      image: Healthy,
      category: "Lifestyle",
      title: "10 Healthy Habits for a Better Life",
      excerpt: "Discover simple yet effective habits that can transform your daily routine and improve your overall well-being.",
      author: "Jane Smith",
      date: "Jan 12, 2025",
      categoryColor: "bg-green-100 text-green-600"
    },
    {
      id: 3,
      image: business,
      category: "Business",
      title: "Building a Successful Startup from Scratch",
      excerpt: "Learn the essential steps and strategies for launching and growing a successful startup in today's competitive market.",
      author: "Mike Johnson",
      date: "Jan 10, 2025",
      categoryColor: "bg-purple-100 text-purple-600"
    },
    {
      id: 4,
      image: personalGrowth,
      category: "Personal Growth",
      title: "Mastering the Art of Self-Discipline",
      excerpt: "Practical tips and mindset shifts to help you develop stronger self-discipline and achieve your goals.",
      author: "Sarah Williams",
      date: "Jan 8, 2025",
      categoryColor: "bg-amber-100 text-amber-600"
    },
    {
      id: 5,
      image: education,
      category: "Education",
      title: "The Power of Lifelong Learning",
      excerpt: "Why continuous learning is essential in the modern world and how to make it a sustainable part of your life.",
      author: "David Brown",
      date: "Jan 5, 2025",
      categoryColor: "bg-indigo-100 text-indigo-600"
    },
    {
      id: 6,
      image: ai,
      category: "Technology",
      title: "Understanding AI and Machine Learning",
      excerpt: "A beginner-friendly guide to artificial intelligence and machine learning concepts that everyone should know.",
      author: "Emily Davis",
      date: "Jan 3, 2025",
      categoryColor: "bg-blue-100 text-blue-600"
    }
  ];

  return (
    <section id="posts" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Latest Stories
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Discover inspiring stories and insights from our community of writers
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post) => (
            <article 
              key={post.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
            >
              {/* Post Image */}
              <div className="relative overflow-hidden h-52">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${post.categoryColor}`}>
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Author & Date */}
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <div className="flex items-center gap-1">
                    <FiUser className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiCalendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                </div>

                {/* Read More Button */}
                
                  <button onClick={() => {Navigate("/login?mode=login")}} className="flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all duration-200" >
                    Read More
                    <FiArrowRight className="w-4 h-4" />
                  
                  </button>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          
            <button onClick={() => {Navigate("/login?mode=login")}} className="py-3 px-8 rounded-lg font-semibold text-base text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer">
              View All Posts
            </button>
          
        </div>
      </div>
    </section>
  );
};

export default Posts;
import { useState } from "react";
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react";

export default function FeedContent() {
  const [activeTab, setActiveTab] = useState("forYou");
  const [likedPosts, setLikedPosts] = useState(new Set([2, 5]));
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set([3, 5]));
  const [expandedPostId, setExpandedPostId] = useState(null);

  // Dummy posts data
  const posts = [
    {
      id: 1,
      author: {
        name: "Sarah Johnson",
        username: "sarahj",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      },
      title: "Getting Started with React Hooks",
      content:
        "React Hooks have revolutionized the way we write React components. In this comprehensive guide, we will explore useState, useEffect, and custom hooks to build better applications...",
      excerpt:
        "React Hooks have revolutionized the way we write React components. In this comprehensive guide, we will explore useState, useEffect, and custom hooks...",
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
      tags: ["React", "JavaScript", "Web Dev"],
      readTime: "5 min read",
      date: "2 days ago",
      likes: 124,
      comments: 18,
    },
    {
      id: 2,
      author: {
        name: "Michael Chen",
        username: "mchen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      },
      title: "The Future of AI in Software Development",
      content:
        "Artificial Intelligence is transforming how we build software. What used to take hours of manual coding can now be streamlined with the help of AI-driven tools. From intelligent code suggestions to automated testing, AI is reshaping the development process.\n\nOne major area where AI is making an impact is code generation. Tools like GitHub Copilot and ChatGPT help developers write boilerplate code faster, freeing up time to focus on solving higher-level problems. Instead of starting from scratch, engineers can leverage AI to provide a strong starting point.\n\nTesting and debugging have also seen huge improvements. Machine learning models can analyze codebases, detect patterns, and even predict where bugs are most likely to occur. Automated test case generation ensures better coverage with less manual effort.\n\nAI is also playing a role in project management. By analyzing historical data, AI can forecast timelines, predict resource needs, and highlight potential bottlenecks before they become critical issues.\n\nOf course, AI isn’t without its challenges. Concerns around ethics, bias, and over-reliance on machine-generated code continue to spark debate. Developers must balance efficiency gains with responsible usage.\n\nThe future of AI in software development looks promising. As AI systems become more sophisticated, we may see fully autonomous tools capable of building, testing, and deploying applications with minimal human intervention. While this won’t replace developers, it will significantly augment their capabilities, making teams more productive than ever before.",
      excerpt:
        "Artificial Intelligence is transforming how we build software—from code generation to automated testing and project management.",
      image: null,
      tags: ["AI", "Technology"],
      readTime: "3 min read",
      date: "1 day ago",
      likes: 89,
      comments: 12,
    },
    {
      id: 3,
      author: {
        name: "Emma Williams",
        username: "emmaw",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      },
      title: "Building Scalable REST APIs with Node.js",
      content:
        "Learn how to build production-ready REST APIs using Node.js, Express, and MongoDB. This tutorial covers authentication, error handling, rate limiting, and best practices for API design that will help you create robust backend services.\n\nWhen building a REST API, one of the first steps is setting up the project structure. A well-organized folder layout ensures your code is easy to maintain and scale as your project grows. With Express, you can separate routes, controllers, and middleware into different modules to keep everything clean.\n\nAuthentication is another crucial piece. While many beginners start with simple session-based logins, production-ready APIs often use JSON Web Tokens (JWT) or OAuth for secure and scalable authentication. By combining JWT with middleware, you can easily protect routes and control access levels.\n\nError handling is often overlooked but it’s vital for creating reliable APIs. A consistent error response format helps frontend developers handle issues gracefully. With Express, you can set up global error-handling middleware that logs errors and returns structured JSON responses.\n\nPerformance also matters. Features like request validation, caching, and database indexing play a huge role in how your API scales. Rate limiting is an important security practice that prevents abuse of your endpoints. Libraries like `express-rate-limit` make it easy to implement.\n\nFinally, don’t forget documentation. Tools like Swagger (OpenAPI) or Postman Collections help teams and external developers understand and consume your API effectively.\n\nBy following these practices, you can design Node.js APIs that are not only functional but also maintainable, secure, and scalable for real-world production environments.",
      excerpt:
        "Learn how to build production-ready REST APIs using Node.js, Express, and MongoDB. This tutorial covers authentication, error handling, rate limiting...",
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
      tags: ["Node.js", "API", "Backend"],
      readTime: "8 min read",
      date: "3 days ago",
      likes: 256,
      comments: 34,
    },
    {
      id: 4,
      author: {
        name: "David Brown",
        username: "dbrown",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      },
      title: "CSS Grid vs Flexbox: When to Use What",
      content: `Understanding the differences between CSS Grid and Flexbox.\n\nCSS Grid and Flexbox are two powerful layout systems in modern CSS.\n\n**CSS Grid** is best for two-dimensional layouts, allowing you to control both rows and columns. It is perfect for complex page layouts, dashboards, and magazine-style designs.\n\n**Flexbox** is ideal for one-dimensional layouts, either a row or a column. It excels at distributing space and aligning items within a container, such as navigation bars, card layouts, and form controls.\n\n**When to use Grid:**\n- Complex layouts with both rows and columns\n- Overlapping content\n- Responsive page sections\n\n**When to use Flexbox:**\n- Simple row or column layouts\n- Aligning items\n- Distributing space\n\n**Tip:** You can combine Grid and Flexbox for maximum flexibility. For example, use Grid for the main page structure and Flexbox for components inside grid cells.\n\nExperiment with both to find what works best for your design!`,
      image: null,
      tags: ["CSS", "Frontend"],
      readTime: "4 min read",
      date: "5 days ago",
      likes: 178,
      comments: 23,
    },
    {
      id: 5,
      author: {
        name: "Lisa Anderson",
        username: "lisaa",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
      },
      title: "My Journey Learning TypeScript",
      content:
        "After years of writing JavaScript, I decided to dive deep into TypeScript. Here is what I learned along the way and why I think every JavaScript developer should consider making the switch to TypeScript for better code quality and developer experience. \n\nThis reduced hours of debugging and gave me more confidence in my code.\n\nTypeScript also improved collaboration with my team. When working on large codebases, having explicit types made it easier to understand function signatures and object structures without guessing. It acted as living documentation.\n\nBeyond safety, TypeScript integrates seamlessly with modern frameworks like React, Next.js, and Node. Features like generics, enums, and interfaces opened new ways of structuring my applications that felt both scalable and maintainable. Plus, tooling support in editors like VS Code made refactoring a breeze.",
      excerpt:
        "After years of writing JavaScript, I decided to dive deep into TypeScript. Here is what I learned along the way and why I think every JavaScript developer should...",
      image:
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
      tags: ["TypeScript", "Learning"],
      readTime: "6 min read",
      date: "1 week ago",
      likes: 312,
      comments: 45,
    },
    {
      id: 6,
      author: {
        name: "James Wilson",
        username: "jwilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
      },
      title: "Dark Mode Best Practices",
      content: "Implementing dark mode the right way.",
      image: null,
      tags: ["UI/UX", "Design"],
      readTime: "3 min read",
      date: "2 weeks ago",
      likes: 145,
      comments: 19,
    },
  ];

  const tabs = [
    { id: "forYou", label: "For You" },
    { id: "following", label: "Following" },
    { id: "latest", label: "Latest" },
  ];

  const toggleLike = (postId) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleBookmark = (postId) => {
    setBookmarkedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-16 md:pt-20">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Filter Tabs */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 z-40 -mx-4 px-4 mb-6">
          <div className="flex items-center gap-1 overflow-x-auto py-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-blue-600 dark:bg-blue-600 text-white shadow-sm"
                    : "text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => {
            const isLiked = likedPosts.has(post.id);
            const isBookmarked = bookmarkedPosts.has(post.id);
            const showExcerpt = post.content.length > 100;

            return (
              <article
                key={post.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-md dark:hover:shadow-slate-900/50 transition-all duration-200"
              >
                {/* Post Header */}
                <div className="p-5 pb-3">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-11 h-11 rounded-full border-2 border-gray-200 dark:border-slate-700"
                      />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                          {post.author.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          @{post.author.username} · {post.date}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => alert("clicked")} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Post Title */}
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-500 transition-colors cursor-pointer leading-tight">
                    {post.title}
                  </h2>

                  {/* Post Excerpt or Full Content */}
                  {expandedPostId === post.id ? (
                    <p className="text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
                      {post.content}
                    </p>
                  ) : (
                    post.excerpt && (
                      <p
                        className="text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed cursor-pointer"
                        onClick={() => setExpandedPostId(post.id)}
                      >
                        {post.excerpt}{" "}
                        <span className="text-blue-600 hover:underline">
                          Read more
                        </span>
                      </p>
                    )
                  )}
                </div>

                {/* Featured Image (if exists) */}
                {post.image && (
                  <div className="w-full h-64 md:h-80 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                  </div>
                )}

                {/* Post Footer */}
                <div className="p-5 pt-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Read Time & Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-700">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {post.readTime}
                    </span>

                    <div className="flex items-center gap-1">
                      {/* Like Button */}
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isLiked
                            ? "text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30"
                            : "text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                        />
                        <span className="text-sm font-medium">
                          {post.likes + (isLiked ? 1 : 0)}
                        </span>
                      </button>

                      {/* Comment Button */}
                      <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">
                        <MessageCircle className="w-5 text-green-600 h-5" />
                        <span className="text-sm font-medium">
                          {post.comments}
                        </span>
                      </button>

                      {/* Bookmark Button */}
                      <button
                        onClick={() => toggleBookmark(post.id)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          isBookmarked
                            ? "text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                            : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        }`}
                      >
                        <Bookmark
                          className={`w-5 h-5 ${
                            isBookmarked ? "fill-current" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-8 mb-20">
          <button className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg border-2 border-gray-300 dark:border-slate-600 hover:border-blue-600 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-500 transition-all duration-200 shadow-sm hover:shadow-md">
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  );
}

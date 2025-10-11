import { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import NavbarPrivate from "../../Components/Private/Navbarprivate";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "../../Components/Private/Loader";

export default function SavedPage() {
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set([]));
  const [likedPosts, setLikedPosts] = useState(new Set([1, 3]));
  const [pageLoading, setPageLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    // Simulate loading or fetch your data
    setTimeout(() => {
      setPageLoading(false);
    }, 3000);
  }, []);

  const savedPosts = [
    {
      id: 1,
      author: {
        name: "Sarah Johnson",
        username: "sarahj",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      },
      title: "Getting Started with React Hooks",
      excerpt:
        "React Hooks have revolutionized the way we write React components. In this comprehensive guide, we will explore useState, useEffect, and custom hooks...",
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
      tags: ["React", "JavaScript", "Web Dev"],
      readTime: "5 min read",
      date: "2 days ago",
      savedDate: "Saved 1 day ago",
      likes: 124,
      comments: 18,
    },
    {
      id: 2,
      author: {
        name: "Emma Williams",
        username: "emmaw",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      },
      title: "Building Scalable REST APIs with Node.js",
      excerpt:
        "Learn how to build production-ready REST APIs using Node.js, Express, and MongoDB. This tutorial covers authentication, error handling...",
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
      tags: ["Node.js", "API", "Backend"],
      readTime: "8 min read",
      date: "3 days ago",
      savedDate: "Saved 2 days ago",
      likes: 256,
      comments: 34,
    },
    {
      id: 3,
      author: {
        name: "Lisa Anderson",
        username: "lisaa",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
      },
      title: "My Journey Learning TypeScript",
      excerpt:
        "After years of writing JavaScript, I decided to dive deep into TypeScript. Here is what I learned along the way...",
      image:
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
      tags: ["TypeScript", "Learning"],
      readTime: "6 min read",
      date: "1 week ago",
      savedDate: "Saved 5 days ago",
      likes: 312,
      comments: 45,
    },
    {
      id: 4,
      author: {
        name: "David Brown",
        username: "dbrown",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      },
      title: "CSS Grid vs Flexbox: When to Use What",
      excerpt: "Understanding the differences between CSS Grid and Flexbox.",
      image: null,
      tags: ["CSS", "Frontend"],
      readTime: "4 min read",
      date: "5 days ago",
      savedDate: "Saved 1 week ago",
      likes: 178,
      comments: 23,
    },
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

  const removeBookmark = (postId) => {
    setBookmarkedPosts((prev) => {
      const newSet = new Set(prev);
      newSet.delete(postId);
      return newSet;
    });
    // Show a toast/notification: "Removed from saved posts"
  };

  // Filter to show only bookmarked posts
  const displayedPosts = savedPosts.filter((post) =>
    bookmarkedPosts.has(post.id)
  );

  return (
    <>
      {pageLoading ? (
        <PageLoader />
      ) : (
        <>
          <NavbarPrivate />
          <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-16 md:pt-20 pb-20 md:pb-8">
            <div className="max-w-4xl mx-auto px-4 py-6">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  Saved Posts
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {displayedPosts.length}{" "}
                  {displayedPosts.length === 1 ? "post" : "posts"} saved for
                  later
                </p>
              </div>

              {/* Posts List */}
              {displayedPosts.length > 0 ? (
                <div className="space-y-6">
                  {displayedPosts.map((post) => {
                    const isLiked = likedPosts.has(post.id);
                    const isBookmarked = bookmarkedPosts.has(post.id);
                    const showExcerpt =
                      post.excerpt && post.excerpt.length > 100;

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
                            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Saved Date Badge */}
                          <div className="mb-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                              <Bookmark className="w-3.5 h-3.5 fill-current" />
                              {post.savedDate}
                            </span>
                          </div>

                          {/* Post Title */}
                          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-500 transition-colors cursor-pointer leading-tight">
                            {post.title}
                          </h2>

                          {/* Post Excerpt */}
                          {showExcerpt && (
                            <p className="text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed">
                              {post.excerpt}
                            </p>
                          )}
                        </div>

                        {/* Featured Image */}
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

                          {/* Actions */}
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
                                  className={`w-5 h-5 ${
                                    isLiked ? "fill-current" : ""
                                  }`}
                                />
                                <span className="text-sm font-medium">
                                  {post.likes + (isLiked ? 1 : 0)}
                                </span>
                              </button>

                              {/* Comment Button */}
                              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">
                                <MessageCircle className="w-5 h-5" />
                                <span className="text-sm font-medium">
                                  {post.comments}
                                </span>
                              </button>

                              {/* Remove from Saved Button */}
                              <button
                                onClick={() => removeBookmark(post.id)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                                title="Remove from saved"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                // Empty State
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                  <div className="w-20 h-20 mx-auto mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <Bookmark className="w-10 h-10 text-blue-600 dark:text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    No saved posts yet
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Bookmark posts to read them later
                  </p>
                  <button
                    onClick={() => nav("/home")}
                    className="px-6 cursor-pointer py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Explore Posts
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

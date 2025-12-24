import { useState } from "react";
import { 
  Heart, MessageCircle, Bookmark, MoreHorizontal, Send, 
  Link2, UserPlus, UserMinus, EyeOff, Repeat2, 
  TrendingUp, Share2, BookOpen, Clock, Zap, 
  Sparkles, Filter, Eye, ExternalLink, Hash, 
  ThumbsUp, BookmarkCheck, Users, Target, Star
} from "lucide-react";

export default function FeedContent() {
  const [activeTab, setActiveTab] = useState("forYou");
  const [likedPosts, setLikedPosts] = useState(new Set([2, 5]));
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set([3, 5]));
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState({});
  const [activeMenuPost, setActiveMenuPost] = useState(null);
  const [followedUsers, setFollowedUsers] = useState(new Set(["mchen", "lisaa"]));
  const [hiddenPosts, setHiddenPosts] = useState(new Set());
  const [repostedPosts, setRepostedPosts] = useState(new Set());
  const [showTrendingSidebar, setShowTrendingSidebar] = useState(true);

  // Enhanced posts data
  const posts = [
    {
      id: 1,
      author: {
        name: "Sarah Johnson",
        username: "sarahj",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarahj",
        verified: true,
        followers: "12.4K",
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
      shares: 45,
      views: "2.3K",
      trending: true,
      isSponsored: false,
    },
    {
      id: 2,
      author: {
        name: "Michael Chen",
        username: "mchen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
        verified: true,
        followers: "8.7K",
      },
      title: "The Future of AI in Software Development",
      content:
        "Artificial Intelligence is transforming how we build software. What used to take hours of manual coding can now be streamlined with the help of AI-driven tools. From intelligent code suggestions to automated testing, AI is reshaping the development process.",
      excerpt:
        "Artificial Intelligence is transforming how we build software—from code generation to automated testing and project management.",
      image: null,
      tags: ["AI", "Technology", "Machine Learning"],
      readTime: "3 min read",
      date: "1 day ago",
      likes: 89,
      comments: 12,
      shares: 23,
      views: "1.8K",
      trending: false,
      isSponsored: true,
    },
    {
      id: 3,
      author: {
        name: "Emma Williams",
        username: "emmaw",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
        verified: false,
        followers: "5.2K",
      },
      title: "Building Scalable REST APIs with Node.js",
      content:
        "Learn how to build production-ready REST APIs using Node.js, Express, and MongoDB. This tutorial covers authentication, error handling, rate limiting, and best practices for API design that will help you create robust backend services.",
      excerpt:
        "Learn how to build production-ready REST APIs using Node.js, Express, and MongoDB. This tutorial covers authentication, error handling, rate limiting...",
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
      tags: ["Node.js", "API", "Backend"],
      readTime: "8 min read",
      date: "3 days ago",
      likes: 256,
      comments: 34,
      shares: 89,
      views: "5.6K",
      trending: true,
      isSponsored: false,
    },
    {
      id: 4,
      author: {
        name: "David Brown",
        username: "dbrown",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
        verified: true,
        followers: "15.1K",
      },
      title: "CSS Grid vs Flexbox: When to Use What",
      content: `Understanding the differences between CSS Grid and Flexbox. CSS Grid and Flexbox are two powerful layout systems in modern CSS.`,
      excerpt: `Understanding the differences between CSS Grid and Flexbox.`,
      image: null,
      tags: ["CSS", "Frontend", "Web Design"],
      readTime: "4 min read",
      date: "5 days ago",
      likes: 178,
      comments: 23,
      shares: 67,
      views: "3.2K",
      trending: false,
      isSponsored: false,
    },
    {
      id: 5,
      author: {
        name: "Lisa Anderson",
        username: "lisaa",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
        verified: true,
        followers: "22.3K",
      },
      title: "My Journey Learning TypeScript",
      content:
        "After years of writing JavaScript, I decided to dive deep into TypeScript. Here is what I learned along the way and why I think every JavaScript developer should consider making the switch to TypeScript for better code quality and developer experience.",
      excerpt:
        "After years of writing JavaScript, I decided to dive deep into TypeScript. Here is what I learned along the way and why I think every JavaScript developer should...",
      image:
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
      tags: ["TypeScript", "Learning", "JavaScript"],
      readTime: "6 min read",
      date: "1 week ago",
      likes: 312,
      comments: 45,
      shares: 124,
      views: "8.9K",
      trending: true,
      isSponsored: false,
    },
  ];

  const tabs = [
    { id: "forYou", label: "For You", icon: <Sparkles className="w-4 h-4" /> },
    { id: "following", label: "Following", icon: <Users className="w-4 h-4" /> },
    { id: "latest", label: "Latest", icon: <Zap className="w-4 h-4" /> },
    { id: "trending", label: "Trending", icon: <TrendingUp className="w-4 h-4" /> },
  ];

  const trendingTopics = [
    { tag: "#React", posts: "2.4K", trending: true },
    { tag: "#WebDev", posts: "1.8K", trending: true },
    { tag: "#AI", posts: "3.2K", trending: true },
    { tag: "#JavaScript", posts: "4.7K", trending: false },
    { tag: "#TypeScript", posts: "1.2K", trending: true },
    { tag: "#CSS", posts: "890", trending: false },
  ];

  const recommendedAuthors = [
    { name: "Alex Turner", followers: "45K", category: "React Expert" },
    { name: "Maria Garcia", followers: "32K", category: "AI Researcher" },
    { name: "James Wilson", followers: "28K", category: "Backend Wizard" },
    { name: "Sophie Chen", followers: "51K", category: "DevOps Guru" },
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

  const handleSendComment = (postId) => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        author: {
          name: "You",
          username: "currentuser",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser",
        },
        content: newComment,
        timestamp: "Just now",
      };

      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment],
      }));
      setNewComment("");
    }
  };

  const toggleComments = (postId) => {
    if (activeCommentPost === postId) {
      setActiveCommentPost(null);
    } else {
      setActiveCommentPost(postId);
    }
  };

  const toggleMenu = (postId) => {
    if (activeMenuPost === postId) {
      setActiveMenuPost(null);
    } else {
      setActiveMenuPost(postId);
    }
  };

  const copyLink = (postId) => {
    const link = `https://scribe.com/post/${postId}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
    setActiveMenuPost(null);
  };

  const toggleFollow = (username) => {
    setFollowedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(username)) {
        newSet.delete(username);
      } else {
        newSet.add(username);
      }
      return newSet;
    });
    setActiveMenuPost(null);
  };

  const hidePost = (postId) => {
    setHiddenPosts((prev) => new Set([...prev, postId]));
    setActiveMenuPost(null);
  };

  const toggleRepost = (postId) => {
    setRepostedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
    setActiveMenuPost(null);
  };

  // Filter out hidden posts
  const visiblePosts = posts.filter(post => !hiddenPosts.has(post.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3">
            {/* Enhanced Header */}
            <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-slate-700/50 rounded-2xl p-4 mb-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 bg-clip-text text-transparent">
                    Your Feed
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Personalized stories from topics you follow
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-all">
                    <Filter className="w-4 h-4" />
                    <span className="font-medium">Filters</span>
                  </button>
                  <button className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
                    New Story
                  </button>
                </div>
              </div>

              {/* Enhanced Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto mt-6 pb-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                    {tab.id === "trending" && (
                      <span className="ml-1 animate-pulse w-2 h-2 bg-yellow-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Posts Feed */}
            <div className="space-y-8">
              {visiblePosts.map((post) => {
                const isLiked = likedPosts.has(post.id);
                const isBookmarked = bookmarkedPosts.has(post.id);
                const showExcerpt = post.content.length > 100;
                const isCommentsOpen = activeCommentPost === post.id;
                const isMenuOpen = activeMenuPost === post.id;
                const isFollowing = followedUsers.has(post.author.username);
                const isReposted = repostedPosts.has(post.id);

                return (
                  <article
                    key={post.id}
                    className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-2xl dark:hover:shadow-slate-900/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Badge Container - Fixed Alignment */}
                    <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
                      {/* Left side badges */}
                      <div className="flex flex-col gap-2 items-start">
                        {/* Trending Badge */}
                        {post.trending && (
                          <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg pointer-events-auto">
                            <TrendingUp className="w-3 h-3" />
                            Trending
                          </span>
                        )}
                        
                        {/* Repost indicator - moved here to align properly */}
                        {isReposted && (
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg pointer-events-auto">
                            <Repeat2 className="w-3 h-3 text-green-500" />
                            <span className="font-medium text-green-600 dark:text-green-400">You reposted</span>
                          </div>
                        )}
                      </div>

                      {/* Right side badges */}
                      <div className="flex flex-col gap-2 items-end">
                        {/* Sponsored Badge */}
                        {post.isSponsored && (
                          <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg pointer-events-auto">
                            <Star className="w-3 h-3" />
                            Sponsored
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Post Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={post.author.avatar}
                              alt={post.author.name}
                              className="w-12 h-12 rounded-xl border-2 border-white dark:border-slate-800 shadow-sm"
                            />
                            {post.author.verified && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                                {post.author.name}
                              </h3>
                              <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{post.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                @{post.author.username}
                              </p>
                              <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <Users className="w-3 h-3" />
                                <span>{post.author.followers}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Enhanced Follow Button */}
                        <button 
                          onClick={() => toggleFollow(post.author.username)}
                          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            isFollowing
                              ? 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-sm'
                          }`}
                        >
                          {isFollowing ? 'Following' : 'Follow'}
                        </button>
                      </div>

                      {/* Post Title */}
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-500 transition-colors cursor-pointer leading-tight">
                        {post.title}
                      </h2>

                      {/* Post Content */}
                      {expandedPostId === post.id ? (
                        <div className="prose dark:prose-invert max-w-none">
                          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                            {post.content}
                          </p>
                          <button
                            onClick={() => setExpandedPostId(null)}
                            className="text-blue-600 dark:text-blue-500 hover:underline font-medium text-sm"
                          >
                            Show less
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="relative mb-3">
                            <p className="text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed pr-4">
                              {post.excerpt || post.content}
                            </p>
                            {(post.excerpt || post.content.length > 150) && (
                              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-slate-800 to-transparent flex items-end justify-center">
                                <button
                                  onClick={() => setExpandedPostId(post.id)}
                                  className="relative -bottom-2 px-4 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-700 font-medium text-sm rounded-full shadow-sm transition-colors"
                                >
                                  Read full story
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Featured Image */}
                    {post.image && (
                      <div className="w-full h-72 md:h-80 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        />
                      </div>
                    )}

                    {/* Post Footer */}
                    <div className="p-6 pt-4">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-full hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats & Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1">
                          {/* Like */}
                          <button
                            onClick={() => toggleLike(post.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                              isLiked
                                ? "bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 text-red-600 dark:text-red-400 shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                            <span className="font-medium">{post.likes + (isLiked ? 1 : 0)}</span>
                          </button>

                          {/* Comment */}
                          <button 
                            onClick={() => toggleComments(post.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                              isCommentsOpen
                                ? "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            }`}
                          >
                            <MessageCircle className="w-5 h-5" />
                            <span className="font-medium">
                              {post.comments + (comments[post.id]?.length || 0)}
                            </span>
                          </button>

                          {/* Share */}
                          <button
                            onClick={() => toggleMenu(post.id)}
                            className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300"
                          >
                            <Share2 className="w-5 h-5" />
                          </button>

                          {/* Bookmark */}
                          <button
                            onClick={() => toggleBookmark(post.id)}
                            className={`p-2.5 rounded-xl transition-all duration-300 ${
                              isBookmarked
                                ? "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 text-yellow-600 dark:text-yellow-400 shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                            }`}
                          >
                            <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Comments Section */}
                    {isCommentsOpen && (
                      <div className="border-t border-gray-200 dark:border-slate-700 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-slate-900/50 dark:to-transparent">
                        <div className="p-6 space-y-6 max-h-80 overflow-y-auto">
                          {/* Existing Comments */}
                          {comments[post.id]?.map((comment) => (
                            <div key={comment.id} className="flex gap-4">
                              <img
                                src={comment.author.avatar}
                                alt={comment.author.name}
                                className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 flex-shrink-0"
                              />
                              <div className="flex-1">
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                      {comment.author.name}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{comment.timestamp}</span>
                                  </div>
                                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                    {comment.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* New Comment Input */}
                          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-4">
                            <div className="flex items-end gap-4">
                              <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser"
                                alt="You"
                                className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-slate-700 flex-shrink-0"
                              />
                              <div className="flex-1">
                                <textarea
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  placeholder="Share your thoughts..."
                                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                  rows="2"
                                />
                                <div className="flex items-center justify-between mt-3">
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Press Enter to post • Shift+Enter for new line
                                  </div>
                                  <button
                                    onClick={() => handleSendComment(post.id)}
                                    disabled={!newComment.trim()}
                                    className={`px-6 py-2 rounded-xl font-medium transition-all ${
                                      newComment.trim()
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                                        : 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed'
                                    }`}
                                  >
                                    Post Comment
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {/* Load More */}
            <div className="flex justify-center mt-12">
              <button className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Load More Stories
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Trending Topics */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  Trending Topics
                </h3>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                  See all
                </button>
              </div>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Hash className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{topic.tag}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{topic.posts} posts</p>
                      </div>
                    </div>
                    {topic.trending && (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full">
                        Trending
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Authors */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-blue-500" />
                Recommended Authors
              </h3>
              <div className="space-y-4">
                {recommendedAuthors.map((author, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{author.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{author.category}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Your Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Stories Read</span>
                  <span className="font-bold">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Minutes Read</span>
                  <span className="font-bold">8,543</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Topics Followed</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">Following</span>
                  <span className="font-bold">89</span>
                </div>
              </div>
              <button className="w-full mt-6 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-colors text-sm">
                View Full Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
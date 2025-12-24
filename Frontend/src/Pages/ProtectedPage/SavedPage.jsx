import { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Trash2,
  Clock,
  Eye,
  TrendingUp,
  Sparkles,
  BookOpen,
  Hash,
  X,
  Filter,
  ChevronDown,
  Zap,
  UserPlus,
  EyeOff,
  Flag,
  Repeat2,
  Share2,
  Link2,
  UserMinus,
  ExternalLink
} from "lucide-react";
import NavbarPrivate from "../../Components/Private/Navbarprivate";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "../../Components/Private/Loader";

export default function SavedPage() {
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set([1, 2, 3, 4]));
  const [likedPosts, setLikedPosts] = useState(new Set([1, 3]));
  const [repostedPosts, setRepostedPosts] = useState(new Set([2]));
  const [pageLoading, setPageLoading] = useState(true);
  const [activeMenuPost, setActiveMenuPost] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("recent");
  const [showFullContent, setShowFullContent] = useState({});
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState({});
  const [followedUsers, setFollowedUsers] = useState(new Set(["sarahj", "lisaa"]));
  const nav = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 1000);
  }, []);

  const savedPosts = [
    {
      id: 1,
      author: {
        name: "Sarah Johnson",
        username: "sarahj",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        verified: true,
        followers: "12.5K"
      },
      title: "Getting Started with React Hooks",
      excerpt: "React Hooks have revolutionized the way we write React components. In this comprehensive guide, we will explore useState, useEffect, and custom hooks...",
      content: `React Hooks have revolutionized the way we write React components. In this comprehensive guide, we'll explore:
      
      • useState for state management
      • useEffect for side effects
      • Custom hooks for reusable logic
      • Performance optimization techniques
      • Best practices and patterns

      **Why Hooks Matter**
      Hooks allow you to use state and other React features without writing a class. They simplify complex components and make your code more reusable.

      **Getting Started**
      To start using Hooks, you'll need React 16.8 or later. The most basic Hook is useState, which lets you add state to functional components.`,
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
      tags: ["React", "JavaScript", "Web Dev", "Frontend", "Hooks"],
      readTime: "5 min read",
      date: "2 days ago",
      savedDate: "Saved 1 day ago",
      likes: 124,
      comments: 18,
      shares: 42,
      views: "1.2K",
      trending: true,
      difficulty: "Beginner"
    },
    {
      id: 2,
      author: {
        name: "Emma Williams",
        username: "emmaw",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
        verified: false,
        followers: "8.3K"
      },
      title: "Building Scalable REST APIs with Node.js",
      excerpt: "Learn how to build production-ready REST APIs using Node.js, Express, and MongoDB. This tutorial covers authentication, error handling...",
      content: `Learn how to build production-ready REST APIs using Node.js, Express, and MongoDB.

      **Key Topics Covered:**
      
      • Project structure and organization
      • Authentication with JWT and OAuth
      • Error handling and logging
      • Rate limiting and security
      • Performance optimization
      • API documentation

      **Best Practices:**
      1. Use consistent error response formats
      2. Implement proper validation
      3. Add comprehensive logging
      4. Set up monitoring and alerts
      5. Write clear documentation

      **Tools & Libraries:**
      • Express.js for routing
      • Mongoose for MongoDB
      • JWT for authentication
      • Swagger for documentation
      • Jest for testing`,
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
      tags: ["Node.js", "API", "Backend", "JavaScript", "Express"],
      readTime: "8 min read",
      date: "3 days ago",
      savedDate: "Saved 2 days ago",
      likes: 256,
      comments: 34,
      shares: 78,
      views: "2.1K",
      trending: false,
      difficulty: "Advanced"
    },
    {
      id: 3,
      author: {
        name: "Lisa Anderson",
        username: "lisaa",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
        verified: true,
        followers: "32.4K"
      },
      title: "My Journey Learning TypeScript",
      excerpt: "After years of writing JavaScript, I decided to dive deep into TypeScript. Here is what I learned along the way...",
      content: `After years of writing JavaScript, I decided to dive deep into TypeScript. Here's what I learned:

      **Benefits Discovered:**
      
      1. **Type Safety**
      Catching errors at compile time instead of runtime. This reduced hours of debugging and gave me more confidence in my code.

      2. **Better Collaboration**
      When working on large codebases, having explicit types made it easier to understand function signatures and object structures without guessing.

      3. **Improved Tooling**
      Features like autocomplete, refactoring, and IntelliSense became significantly more powerful.

      4. **Framework Integration**
      TypeScript integrates seamlessly with modern frameworks like React, Next.js, and Node.`,
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
      tags: ["TypeScript", "Learning", "JavaScript", "Development"],
      readTime: "6 min read",
      date: "1 week ago",
      savedDate: "Saved 5 days ago",
      likes: 312,
      comments: 45,
      shares: 89,
      views: "3.2K",
      trending: true,
      difficulty: "Intermediate"
    },
    {
      id: 4,
      author: {
        name: "David Brown",
        username: "dbrown",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
        verified: true,
        followers: "15.2K"
      },
      title: "CSS Grid vs Flexbox: When to Use What",
      excerpt: "Understanding the differences between CSS Grid and Flexbox.",
      content: `Understanding the differences between CSS Grid and Flexbox.

      **CSS Grid**
      Best for two-dimensional layouts, allowing you to control both rows and columns. Perfect for:
      • Complex page layouts
      • Dashboards
      • Magazine-style designs
      • Overlapping content

      **Flexbox**
      Ideal for one-dimensional layouts, either a row or a column. Excellent for:
      • Navigation bars
      • Card layouts
      • Form controls
      • Aligning items within containers

      **Pro Tip:** Combine Grid and Flexbox for maximum flexibility. Use Grid for the main page structure and Flexbox for components inside grid cells.`,
      image: null,
      tags: ["CSS", "Frontend", "Design", "Web Dev"],
      readTime: "4 min read",
      date: "5 days ago",
      savedDate: "Saved 1 week ago",
      likes: 178,
      comments: 23,
      shares: 45,
      views: "1.5K",
      trending: false,
      difficulty: "Beginner"
    },
  ];

  const allTags = [...new Set(savedPosts.flatMap(post => post.tags))];

  const sortOptions = [
    { id: "recent", label: "Recently Saved", icon: <Clock className="w-4 h-4" /> },
    { id: "popular", label: "Most Popular", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "oldest", label: "Saved First", icon: <Bookmark className="w-4 h-4" /> },
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
        // Show toast notification
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
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
  };

  const toggleMenu = (postId) => {
    if (activeMenuPost === postId) {
      setActiveMenuPost(null);
    } else {
      setActiveMenuPost(postId);
    }
  };

  const toggleComments = (postId) => {
    if (activeCommentPost === postId) {
      setActiveCommentPost(null);
    } else {
      setActiveCommentPost(postId);
    }
  };

  const handleSendComment = (postId) => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        author: {
          name: "You",
          username: "currentuser",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser",
          verified: true
        },
        content: newComment,
        timestamp: "Just now",
        likes: 0
      };

      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment],
      }));
      setNewComment("");
    }
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

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  // Filter and sort saved posts
  const displayedPosts = savedPosts
    .filter(post => bookmarkedPosts.has(post.id))
    .filter(post => 
      selectedTags.length === 0 || 
      selectedTags.some(tag => post.tags.includes(tag))
    )
    .sort((a, b) => {
      switch(sortBy) {
        case 'popular': return (b.likes + b.comments) - (a.likes + a.comments);
        case 'oldest': return a.id - b.id;
        default: return b.id - a.id; // recent
      }
    });

  return (
    <>
      {pageLoading ? (
        <PageLoader />
      ) : (
        <>
          <NavbarPrivate />
          <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-950 pt-20 md:pt-24">
            <div className="max-w-4xl mx-auto px-4 py-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      Saved Stories
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your personal collection of stories to read later
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-400 rounded-xl font-medium">
                      <Bookmark className="w-5 h-5 fill-current" />
                      <span>{displayedPosts.length} Saved</span>
                    </div>

                    <button
                      onClick={() => nav("/home")}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Explore More</span>
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Read Time</p>
                      <p className="font-bold text-gray-900 dark:text-white">23 min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Liked</p>
                      <p className="font-bold text-gray-900 dark:text-white">{likedPosts.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Trending Saved</p>
                      <p className="font-bold text-gray-900 dark:text-white">2</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Controls */}
              <div className="sticky top-20 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-slate-800 mb-8 p-2 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Filter Buttons */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                        showFilters
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <Filter className="w-4 h-4" />
                      Filter
                      <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>

                    <button
                      onClick={() => nav("/create-post")}
                      className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
                    >
                      <Sparkles className="w-4 h-4" />
                      Write Your Own
                    </button>
                  </div>

                  {/* Sort Options */}
                  <div className="flex items-center gap-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSortBy(option.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          sortBy === option.id
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700"
                            : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        {option.icon}
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                  <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-lg animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Filter by Topics</h3>
                      <button 
                        onClick={() => setSelectedTags([])}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            selectedTags.includes(tag)
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                              : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active Filters Display */}
                {selectedTags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedTags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
                        #{tag}
                        <button onClick={() => toggleTag(tag)} className="hover:text-blue-900 dark:hover:text-blue-100">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Posts Feed */}
              {displayedPosts.length > 0 ? (
                <div className="space-y-6">
                  {displayedPosts.map((post) => {
                    const isLiked = likedPosts.has(post.id);
                    const isBookmarked = bookmarkedPosts.has(post.id);
                    const isReposted = repostedPosts.has(post.id);
                    const isCommentsOpen = activeCommentPost === post.id;
                    const isMenuOpen = activeMenuPost === post.id;
                    const isFollowing = followedUsers.has(post.author.username);
                    const isContentExpanded = showFullContent[post.id];

                    return (
                      <article
                        key={post.id}
                        className={`group bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-slate-900/50 hover:-translate-y-1`}
                      >
                        {/* Post Header */}
                        <div className="p-6 pb-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                              <div className="relative">
                                <img
                                  src={post.author.avatar}
                                  alt={post.author.name}
                                  className="w-12 h-12 rounded-xl border-2 border-white dark:border-slate-800 shadow-sm"
                                />
                                {post.author.verified && (
                                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-gray-900 dark:text-white">
                                    {post.author.name}
                                  </h3>
                                  {post.trending && (
                                    <span className="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                                      <TrendingUp className="w-3 h-3" />
                                      Trending
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                  <span>@{post.author.username}</span>
                                  <span>·</span>
                                  <span className="flex items-center gap-1">
                                    <Bookmark className="w-3 h-3 fill-current text-blue-500" />
                                    {post.savedDate}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Action Menu */}
                            <div className="relative">
                              <button 
                                onClick={() => toggleMenu(post.id)} 
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                              >
                                <MoreHorizontal className="w-5 h-5" />
                              </button>

                              {/* Dropdown Menu */}
                              {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 py-2 z-50 animate-fade-in">
                                  <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Post Actions</p>
                                  </div>
                                  
                                  <button
                                    onClick={() => toggleBookmark(post.id)}
                                    className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-gray-700 dark:text-gray-300"
                                  >
                                    {isBookmarked ? (
                                      <>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                        <div>
                                          <p className="font-medium">Remove from Saved</p>
                                          <p className="text-xs text-gray-500">Delete from your collection</p>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <Bookmark className="w-4 h-4" />
                                        <div>
                                          <p className="font-medium">Add to Saved</p>
                                          <p className="text-xs text-gray-500">Save for later reading</p>
                                        </div>
                                      </>
                                    )}
                                  </button>
                                  
                                  <button
                                    onClick={() => toggleFollow(post.author.username)}
                                    className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-gray-700 dark:text-gray-300"
                                  >
                                    {isFollowing ? (
                                      <>
                                        <UserMinus className="w-4 h-4" />
                                        <div>
                                          <p className="font-medium">Unfollow</p>
                                          <p className="text-xs text-gray-500">Stop seeing posts</p>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <UserPlus className="w-4 h-4" />
                                        <div>
                                          <p className="font-medium">Follow</p>
                                          <p className="text-xs text-gray-500">See more from them</p>
                                        </div>
                                      </>
                                    )}
                                  </button>

                                  <button
                                    onClick={() => toggleRepost(post.id)}
                                    className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-gray-700 dark:text-gray-300"
                                  >
                                    <Repeat2 className="w-4 h-4" />
                                    <div>
                                      <p className="font-medium">{isReposted ? "Undo repost" : "Repost"}</p>
                                      <p className="text-xs text-gray-500">Share with your followers</p>
                                    </div>
                                  </button>

                                  <div className="border-t border-gray-200 dark:border-slate-700 my-2"></div>

                                  <button
                                    onClick={() => toggleBookmark(post.id)}
                                    className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-red-600 dark:text-red-500"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    <div>
                                      <p className="font-medium">Remove</p>
                                      <p className="text-xs">Delete from saved</p>
                                    </div>
                                  </button>

                                  <button className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-red-600 dark:text-red-500">
                                    <Flag className="w-4 h-4" />
                                    <div>
                                      <p className="font-medium">Report</p>
                                      <p className="text-xs">Report this content</p>
                                    </div>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Post Title & Meta */}
                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {post.title}
                          </h2>

                          {/* Meta Info */}
                          <div className="flex items-center gap-3 mb-4">
                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getDifficultyColor(post.difficulty)}`}>
                              {post.difficulty}
                            </span>
                            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm">
                              <Clock className="w-4 h-4" />
                              {post.readTime}
                            </span>
                            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm">
                              <Eye className="w-4 h-4" />
                              {post.views} views
                            </span>
                          </div>

                          {/* Post Content */}
                          <div className="mb-4">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {isContentExpanded ? post.content : post.excerpt}
                              {!isContentExpanded && post.content && (
                                <button
                                  onClick={() => setShowFullContent(prev => ({ ...prev, [post.id]: true }))}
                                  className="ml-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                                >
                                  Read more
                                </button>
                              )}
                            </p>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag) => (
                              <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                  selectedTags.includes(tag)
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                    : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                                }`}
                              >
                                #{tag}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Featured Image */}
                        {post.image && (
                          <div className="w-full h-72 md:h-96 overflow-hidden">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}

                        {/* Post Stats & Actions */}
                        <div className="p-6 pt-4">
                          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                            {/* Stats */}
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleLike(post.id)}
                                  className={`flex items-center gap-2 p-2 rounded-xl transition-all duration-300 ${
                                    isLiked
                                      ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                                      : "text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  }`}
                                >
                                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                  <span className="font-semibold">{post.likes + (isLiked ? 1 : 0)}</span>
                                </button>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleComments(post.id)}
                                  className={`flex items-center gap-2 p-2 rounded-xl transition-all duration-300 ${
                                    isCommentsOpen
                                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                      : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                  }`}
                                >
                                  <MessageCircle className="w-5 h-5" />
                                  <span className="font-semibold">{post.comments}</span>
                                </button>
                              </div>

                              <button
                                onClick={() => toggleRepost(post.id)}
                                className={`flex items-center gap-2 p-2 rounded-xl transition-all duration-300 ${
                                  isReposted
                                    ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                                    : "text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                                }`}
                              >
                                <Repeat2 className="w-5 h-5" />
                                <span className="font-semibold">{post.shares + (isReposted ? 1 : 0)}</span>
                              </button>
                            </div>

                            {/* Right Actions */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleBookmark(post.id)}
                                className={`p-3 rounded-xl transition-all duration-300 ${
                                  isBookmarked
                                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                    : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                }`}
                              >
                                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Comments Section */}
                        {isCommentsOpen && (
                          <div className="border-t border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
                            <div className="p-6 space-y-6">
                              {/* Comment Input */}
                              <div className="flex items-start gap-3">
                                <img
                                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser"
                                  alt="You"
                                  className="w-10 h-10 rounded-xl border-2 border-white dark:border-slate-800 shadow-sm"
                                />
                                <div className="flex-1">
                                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-300 dark:border-slate-700 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors overflow-hidden">
                                    <textarea
                                      value={newComment}
                                      onChange={(e) => setNewComment(e.target.value)}
                                      placeholder="Share your thoughts..."
                                      rows="2"
                                      className="w-full p-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 outline-none resize-none"
                                    />
                                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                                      <button
                                        onClick={() => handleSendComment(post.id)}
                                        disabled={!newComment.trim()}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                          newComment.trim()
                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                                            : "bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed"
                                        }`}
                                      >
                                        Comment
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Comments List */}
                              <div className="space-y-4">
                                {comments[post.id]?.map((comment) => (
                                  <div key={comment.id} className="flex gap-3">
                                    <img
                                      src={comment.author.avatar}
                                      alt={comment.author.name}
                                      className="w-10 h-10 rounded-xl border-2 border-white dark:border-slate-800 shadow-sm flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                      <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm p-4 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                              {comment.author.name}
                                            </span>
                                            {comment.author.verified && (
                                              <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                                </svg>
                                              </span>
                                            )}
                                          </div>
                                          <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {comment.timestamp}
                                          </span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                    <Bookmark className="w-12 h-12 text-blue-600 dark:text-blue-500 fill-current" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    No saved stories yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    When you find stories you want to read later, click the bookmark icon to save them here.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => nav("/home")}
                      className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <Zap className="w-5 h-5" />
                      Explore Stories
                    </button>
                    <button
                      onClick={() => nav("/create-post")}
                      className="px-8 py-3.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 text-gray-900 dark:text-white font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      Write Your Story
                    </button>
                  </div>
                </div>
              )}

              {/* Load More */}
              {displayedPosts.length > 0 && (
                <div className="flex justify-center mt-12">
                  <button className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Load More Saved
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
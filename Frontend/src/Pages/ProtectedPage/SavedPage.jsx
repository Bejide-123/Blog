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
  Users,
  Target,
  Star,
  ExternalLink,
  ChevronRight,
  Hash as HashIcon,
  Users as UsersIcon,
  BookmarkCheck,
  ThumbsUp
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
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [showTrendingSidebar, setShowTrendingSidebar] = useState(true);
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
      Hooks allow you to use state and other React features without writing a class. They simplify complex components and make your code more reusable.`,
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
      • API documentation`,
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
      When working on large codebases, having explicit types made it easier to understand function signatures and object structures without guessing.`,
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
      • Aligning items within containers`,
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

  // Sample data for sidebar (matching FeedContent design)
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

  // Format date function to match FeedContent
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    
    if (dateString.includes('Saved')) return dateString;
    
    const now = new Date();
    const hoursDiff = Math.floor(Math.random() * 48) + 1;
    
    if (hoursDiff < 1) {
      return `${Math.floor(hoursDiff * 60)} minutes ago`;
    } else if (hoursDiff < 24) {
      return `${Math.floor(hoursDiff)} hours ago`;
    } else if (hoursDiff < 168) {
      return `${Math.floor(hoursDiff / 24)} days ago`;
    } else {
      return '1 week ago';
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
          <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 pt-16 md:pt-20">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">
                {/* Main Feed */}
                <div className="lg:col-span-3">
                  {/* Header - Matches FeedContent design */}
                  <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border border-gray-200/50 dark:border-slate-700/50 rounded-2xl p-4 mb-8 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 bg-clip-text text-transparent">
                          Saved Stories
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                          Your personal collection to read later • {displayedPosts.length} stories
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setShowFilters(!showFilters)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
                        >
                          <Filter className="w-4 h-4" />
                          <span className="font-medium">Filters</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>
                        <button
                          onClick={() => nav("/create")}
                          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                        >
                          Write Story
                        </button>
                      </div>
                    </div>

                    {/* Stats - Updated design */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Total Read Time</p>
                          <p className="font-bold text-gray-900 dark:text-white">23 min</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Liked</p>
                          <p className="font-bold text-gray-900 dark:text-white">{likedPosts.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                          <Bookmark className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Saved</p>
                          <p className="font-bold text-gray-900 dark:text-white">{displayedPosts.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Filter Panel */}
                  {showFilters && (
                    <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 mb-8 shadow-lg">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
                            <Filter className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-base">
                              Filter Saved Stories
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Refine your collection
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedTags([])}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        >
                          Clear all
                        </button>
                      </div>

                      {/* Sort Options */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
                        {sortOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => setSortBy(option.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              sortBy === option.id
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm"
                                : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                            }`}
                          >
                            {option.icon}
                            {option.label}
                          </button>
                        ))}
                      </div>

                      {/* Tags */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Filter by topics:</p>
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

                      {/* Active Filters */}
                      {selectedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedTags.map(tag => (
                            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
                              #{tag}
                              <button onClick={() => toggleTag(tag)} className="hover:text-blue-900 dark:hover:text-blue-100">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Posts Feed - Matching FeedContent design */}
                  <div className="space-y-8">
                    {displayedPosts.length === 0 ? (
                      <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700">
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
                            onClick={() => nav("/create")}
                            className="px-8 py-3.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 text-gray-900 dark:text-white font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                          >
                            <Sparkles className="w-5 h-5" />
                            Write Your Story
                          </button>
                        </div>
                      </div>
                    ) : (
                      displayedPosts.map((post) => {
                        const isLiked = likedPosts.has(post.id);
                        const isBookmarked = bookmarkedPosts.has(post.id);
                        const isReposted = repostedPosts.has(post.id);
                        const isCommentsOpen = activeCommentPost === post.id;
                        const isMenuOpen = activeMenuPost === post.id;
                        const isFollowing = followedUsers.has(post.author.username);
                        const isContentExpanded = expandedPostId === post.id;

                        return (
                          <article
                            key={post.id}
                            className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-2xl dark:hover:shadow-slate-900/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                          >
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
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
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
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        •
                                      </span>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatDate(post.savedDate)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        @{post.author.username}
                                      </p>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        •
                                      </span>
                                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                        <Users className="w-3 h-3" />
                                        <span>{post.author.followers}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Right side buttons */}
                                <div className="flex items-center gap-2">
                                  {/* Difficulty badge */}
                                  <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getDifficultyColor(post.difficulty)}`}>
                                    {post.difficulty}
                                  </span>
                                  
                                  {/* Follow Button */}
                                  <button
                                    onClick={() => toggleFollow(post.author.username)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                      isFollowing
                                        ? "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
                                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-sm"
                                    }`}
                                  >
                                    {isFollowing ? "Following" : "Follow"}
                                  </button>

                                  {/* Menu Button */}
                                  <div className="relative">
                                    <button 
                                      onClick={() => toggleMenu(post.id)} 
                                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                      <MoreHorizontal className="w-5 h-5" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isMenuOpen && (
                                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 py-2 z-50">
                                        <button
                                          onClick={() => toggleBookmark(post.id)}
                                          className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-gray-700 dark:text-gray-300"
                                        >
                                          {isBookmarked ? (
                                            <>
                                              <Trash2 className="w-4 h-4 text-red-500" />
                                              <span className="font-medium">Remove from Saved</span>
                                            </>
                                          ) : (
                                            <>
                                              <Bookmark className="w-4 h-4" />
                                              <span className="font-medium">Add to Saved</span>
                                            </>
                                          )}
                                        </button>
                                        <button
                                          onClick={() => toggleFollow(post.author.username)}
                                          className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-gray-700 dark:text-gray-300"
                                        >
                                          {isFollowing ? (
                                            <>
                                              <UserPlus className="w-4 h-4" />
                                              <span className="font-medium">Unfollow Author</span>
                                            </>
                                          ) : (
                                            <>
                                              <UserPlus className="w-4 h-4" />
                                              <span className="font-medium">Follow Author</span>
                                            </>
                                          )}
                                        </button>
                                        <div className="border-t border-gray-200 dark:border-slate-700 my-1"></div>
                                        <button className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-red-600 dark:text-red-500">
                                          <Flag className="w-4 h-4" />
                                          <span className="font-medium">Report</span>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Post Title */}
                              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-500 transition-colors cursor-pointer leading-tight">
                                {post.title}
                              </h2>

                              {/* Post Content */}
                              {isContentExpanded ? (
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
                                      {post.excerpt}
                                    </p>
                                    {post.content && post.content.length > 150 && (
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
                                    <Heart
                                      className={`w-5 h-5 ${
                                        isLiked ? "fill-current" : ""
                                      }`}
                                    />
                                    <span className="font-medium">
                                      {post.likes + (isLiked ? 1 : 0)}
                                    </span>
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
                                      {post.comments}
                                    </span>
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
                                    <Bookmark
                                      className={`w-5 h-5 ${
                                        isBookmarked ? "fill-current" : ""
                                      }`}
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Comments Section - Matching FeedContent design */}
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
                                          <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                                {comment.author.name}
                                              </span>
                                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {comment.timestamp}
                                              </span>
                                            </div>
                                            <button
                                              onClick={() => {}}
                                              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700`}
                                            >
                                              <Heart className="w-3.5 h-3.5" />
                                              <span className="text-xs font-medium">
                                                {comment.likes}
                                              </span>
                                            </button>
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
                                          onChange={(e) =>
                                            setNewComment(e.target.value)
                                          }
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
                                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                                                : "bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed"
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
                      })
                    )}
                  </div>

                  {/* Load More */}
                  {displayedPosts.length > 0 && (
                    <div className="flex justify-center mt-12">
                      <button className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Load More Saved
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Sidebar - Matching FeedContent design */}
                <div className={`lg:col-span-1 space-y-6 md:space-y-8 ${showTrendingSidebar ? "block" : "hidden"} lg:block`}>
                  {/* Trending Topics */}
                  <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white text-base">
                            Trending Topics
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            What's hot now
                          </p>
                        </div>
                      </div>
                      <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                        See all →
                      </button>
                    </div>

                    <div className="space-y-2">
                      {trendingTopics.map((topic, index) => (
                        <button
                          key={index}
                          className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group"
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <div className="relative">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                                <Hash className="w-3.5 h-3.5 text-blue-500" />
                              </div>
                              {topic.trending && (
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-slate-800" />
                              )}
                            </div>
                            <div className="text-left flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                {topic.tag}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {topic.posts} posts
                              </p>
                            </div>
                          </div>
                          {topic.trending && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-red-500/10 to-pink-500/10 text-red-600 dark:text-red-400 text-xs font-medium rounded-full">
                              🔥
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Authors */}
                  <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
                        <Users className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-base">
                          Top Authors
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Recommended for you
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {recommendedAuthors.map((author, index) => (
                        <div
                          key={index}
                          className="flex flex-col p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="relative">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
                                <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 text-sm">
                                    {author.name.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white dark:border-slate-800" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                {author.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {author.followers} followers
                              </p>
                            </div>
                          </div>
                          <button className="w-full px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-semibold rounded-md transition-colors">
                            Follow
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-700/50">
                      <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-center">
                        View all recommendations →
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-2xl p-5 text-white shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />

                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-base">
                            Your Stats
                          </h3>
                          <p className="text-xs text-white/70">This week</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/10">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                              <BookOpen className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm opacity-90">Read</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">1,247</span>
                            <span className="text-xs px-1.5 py-0.5 bg-green-500/30 text-green-300 rounded-full">
                              +12%
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/10">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                              <Clock className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm opacity-90">Minutes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">8,543</span>
                            <span className="text-xs px-1.5 py-0.5 bg-blue-500/30 text-blue-300 rounded-full">
                              +8%
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/10">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                              <Users className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm opacity-90">Following</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">89</span>
                            <span className="text-xs px-1.5 py-0.5 bg-pink-500/30 text-pink-300 rounded-full">
                              +5
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="w-full mt-5 px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium rounded-lg transition-colors text-sm">
                        View Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
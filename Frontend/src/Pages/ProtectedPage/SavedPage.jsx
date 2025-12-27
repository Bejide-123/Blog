import { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Clock,
  Eye,
  TrendingUp,
  Sparkles,
  Filter,
  Zap,
  Users as UsersIcon,
  BookOpen,
  Hash,
  X,
  ChevronDown,
  Trash2,
  UserPlus,
  Flag,
} from "lucide-react";
import NavbarPrivate from "../../Components/Private/Navbarprivate";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "../../Components/Private/Loader";
import { 
  getSavedPostsWithDetails, 
  toggleSavePost, 
  togglePostLike,
  getUserLikedPosts // Add this import
} from "../../Services/post";
import { useUser } from "../../Context/userContext";
import { useTheme } from "../../Context/themeContext";

export default function SavedPage() {
  const { theme } = useTheme();
  const [savedPosts, setSavedPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [pageLoading, setPageLoading] = useState(true);
  const [activeMenuPost, setActiveMenuPost] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("recent");
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState({});
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [showTrendingSidebar, setShowTrendingSidebar] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    fetchSavedPosts();
  }, [user]);

  const fetchSavedPosts = async () => {
    try {
      setPageLoading(true);
      if (!user?.id) return;
      
      // Fetch saved posts with details
      const savedPostsData = await getSavedPostsWithDetails(user.id);
      setSavedPosts(savedPostsData || []);
      
      // Fetch user's liked posts
      const likedPostIds = await getUserLikedPosts(user.id);
      setLikedPosts(new Set(likedPostIds));
      
    } catch (err) {
      console.error('Failed to fetch saved posts:', err);
      setError('Failed to load saved posts. Please try again.');
    } finally {
      setPageLoading(false);
    }
  };

  // ========== LIKE FUNCTIONALITY ==========
  const toggleLike = async (postId) => {
    if (!user?.id) {
      nav('/login');
      return;
    }
    
    try {
      const { liked, count } = await togglePostLike(postId, user.id);
      
      // Update liked posts set
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (liked) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });
      
      // Update the post in the saved posts list with new likes count
      setSavedPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, likescount: count || 0 } 
            : post
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to update like. Please try again.');
    }
  };

  // ========== SAVE/UNSAVE FUNCTIONALITY ==========
  const toggleSave = async (postId) => {
    if (!user?.id) {
      nav('/login');
      return;
    }
    
    try {
      const { saved } = await toggleSavePost(postId, user.id);
      
      if (!saved) {
        // Remove from saved posts list when unsaved
        setSavedPosts(prev => prev.filter(post => post.id !== postId));
        
        // Optional: Remove from liked posts if you want to keep them separate
        // If you want to keep track of which saved posts were liked, keep this
        // If you want to keep liking independent, remove this line
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      }
      
      // Optional: Show feedback
      if (saved) {
        console.log('Post saved successfully');
        // If you want to refetch the list after saving (in case they save from elsewhere)
        // fetchSavedPosts();
      } else {
        console.log('Post removed from saved');
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      alert('Failed to update saved post. Please try again.');
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
          name: user?.full_name || "You",
          username: user?.username || "currentuser",
          avatar: user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser",
        },
        content: newComment,
        timestamp: "Just now",
        likes: 0,
        isLiked: false,
      };

      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment],
      }));
      setNewComment("");
    }
  };

  const toggleCommentLike = (postId, commentId) => {
    setComments((prev) => {
      const postComments = prev[postId] || [];
      const updatedComments = postComments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked,
          };
        }
        return comment;
      });

      return {
        ...prev,
        [postId]: updatedComments,
      };
    });
  };

  const toggleMenu = (postId) => {
    if (activeMenuPost === postId) {
      setActiveMenuPost(null);
    } else {
      setActiveMenuPost(postId);
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

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)} minutes ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Sample data for sidebar
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

  // Get all unique tags from saved posts
  const allTags = [...new Set(savedPosts.flatMap(post => post.tags || []))];

  const sortOptions = [
    { id: "recent", label: "Recently Saved", icon: <Clock className="w-4 h-4" /> },
    { id: "popular", label: "Most Popular", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "oldest", label: "Saved First", icon: <Bookmark className="w-4 h-4" /> },
  ];

  // Filter and sort saved posts
  const displayedPosts = savedPosts
    .filter(post => 
      selectedTags.length === 0 || 
      selectedTags.some(tag => (post.tags || []).includes(tag))
    )
    .sort((a, b) => {
      switch(sortBy) {
        case 'popular': 
          return (b.likescount || 0) - (a.likescount || 0);
        case 'oldest': 
          return new Date(a.saved_at || a.createdat) - new Date(b.saved_at || b.createdat);
        default: // recent
          return new Date(b.saved_at || b.createdat) - new Date(a.saved_at || a.createdat);
      }
    });

  if (pageLoading) {
    return (
      <>
        <NavbarPrivate />
        <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-900'} pt-16 md:pt-20`}>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className={`mt-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Loading saved posts...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavbarPrivate />
        <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-900'} pt-16 md:pt-20`}>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center py-12">
              <p className={`${theme === 'light' ? 'text-red-500' : 'text-red-400'}`}>{error}</p>
              <button 
                onClick={() => fetchSavedPosts()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarPrivate />
      <div className={`min-h-screen bg-gradient-to-b ${theme === 'light' ? 'from-gray-50 via-white to-white' : 'from-slate-900 via-slate-900 to-slate-950'} pt-16 md:pt-20`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">
            {/* Main Feed */}
            <div className="lg:col-span-3">
              {/* Header */}
              <div className={`relative ${theme === 'light' ? 'bg-white/95' : 'bg-slate-800/95'} backdrop-blur-lg border ${theme === 'light' ? 'border-gray-200/50' : 'border-slate-700/50'} rounded-2xl p-4 mb-8 shadow-sm`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${theme === 'light' ? 'from-blue-600 to-purple-600' : 'from-blue-500 to-purple-500'} bg-clip-text text-transparent`}>
                      Saved Stories
                    </h1>
                    <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-sm mt-1`}>
                      Your personal collection • {displayedPosts.length} {displayedPosts.length === 1 ? 'story' : 'stories'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center gap-2 px-4 py-2.5 ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'} rounded-xl transition-all`}
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

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  <div className={`flex items-center gap-3 p-3 bg-gradient-to-r ${theme === 'light' ? 'from-blue-50 to-purple-50' : 'from-blue-900/20 to-purple-900/20'} rounded-xl`}>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Saved</p>
                      <p className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{displayedPosts.length}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-3 bg-gradient-to-r ${theme === 'light' ? 'from-green-50 to-emerald-50' : 'from-green-900/20 to-emerald-900/20'} rounded-xl`}>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Liked</p>
                      <p className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{likedPosts.size}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 p-3 bg-gradient-to-r ${theme === 'light' ? 'from-orange-50 to-red-50' : 'from-orange-900/20 to-red-900/20'} rounded-xl`}>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Total Read Time</p>
                      <p className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {displayedPosts.reduce((total, post) => total + (post.read_time || 5), 0)} min
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className={`relative ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} p-5 mb-8 shadow-lg`}>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
                        <Filter className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-base`}>
                          Filter Saved Stories
                        </h3>
                        <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          Refine your collection
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedTags([])}
                      className={`text-sm ${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'} font-medium`}
                    >
                      Clear all
                    </button>
                  </div>

                  {/* Sort Options */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Sort by:</span>
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSortBy(option.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          sortBy === option.id
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm"
                            : `${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`
                        }`}
                      >
                        {option.icon}
                        {option.label}
                      </button>
                    ))}
                  </div>

                  {/* Tags */}
                  {allTags.length > 0 && (
                    <div className="mb-4">
                      <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-3`}>Filter by topics:</p>
                      <div className="flex flex-wrap gap-2">
                        {allTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                              selectedTags.includes(tag)
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                : `${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`
                            }`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Active Filters */}
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map(tag => (
                        <span key={tag} className={`inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r ${theme === 'light' ? 'from-blue-100 to-purple-100 text-blue-700' : 'from-blue-900/30 to-purple-900/30 text-blue-300'} rounded-lg text-sm`}>
                          #{tag}
                          <button onClick={() => toggleTag(tag)} className={`${theme === 'light' ? 'hover:text-blue-900' : 'hover:text-blue-100'}`}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Posts Feed */}
              <div className="space-y-8">
                {displayedPosts.length === 0 ? (
                  <div className={`text-center py-12 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}`}>
                    <div className={`w-24 h-24 mx-auto mb-6 bg-gradient-to-r ${theme === 'light' ? 'from-blue-100 to-purple-100' : 'from-blue-900/30 to-purple-900/30'} rounded-full flex items-center justify-center`}>
                      <Bookmark className={`w-12 h-12 ${theme === 'light' ? 'text-blue-600' : 'text-blue-500'} fill-current`} />
                    </div>
                    <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-3`}>
                      No saved stories yet
                    </h3>
                    <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-8 max-w-md mx-auto`}>
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
                        className={`px-8 py-3.5 bg-gradient-to-r ${theme === 'light' ? 'from-gray-100 to-gray-200 text-gray-900 hover:bg-gray-200' : 'from-slate-800 to-slate-700 text-white hover:bg-slate-700'} font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2`}
                      >
                        <Sparkles className="w-5 h-5" />
                        Write Your Story
                      </button>
                    </div>
                  </div>
                ) : (
                  displayedPosts.map((post) => {
                    const isLiked = likedPosts.has(post.id);
                    const isCommentsOpen = activeCommentPost === post.id;
                    const isMenuOpen = activeMenuPost === post.id;
                    const isFollowing = followedUsers.has(post.author?.username);
                    const isContentExpanded = expandedPostId === post.id;

                    return (
                      <article
                        key={post.id}
                        className={`group relative ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} shadow-lg hover:shadow-2xl ${theme === 'light' ? '' : 'dark:hover:shadow-slate-900/50'} transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
                      >
                        {/* Post Header */}
                        <div className="p-6 pb-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img
                                  src={post.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.username || 'anonymous'}`}
                                  alt={post.author?.full_name || 'Anonymous'}
                                  className={`w-12 h-12 rounded-xl border-2 ${theme === 'light' ? 'border-white' : 'border-slate-800'} shadow-sm`}
                                />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-sm`}>
                                    {post.author?.full_name || 'Anonymous'}
                                  </h3>
                                  <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    •
                                  </span>
                                  <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {formatDate(post.saved_at || post.createdat)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    @{post.author?.username || 'anonymous'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Right side buttons */}
                            <div className="flex items-center gap-2">
                              {/* Follow Button */}
                              <button
                                onClick={() => toggleFollow(post.author?.username)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                  isFollowing
                                    ? `${theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`
                                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-sm"
                                }`}
                              >
                                {isFollowing ? "Following" : "Follow"}
                              </button>

                              {/* Menu Button */}
                              <div className="relative">
                                <button 
                                  onClick={() => toggleMenu(post.id)} 
                                  className={`p-1.5 ${theme === 'light' ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' : 'text-gray-400 hover:text-gray-300 hover:bg-slate-700'} rounded-lg transition-colors`}
                                >
                                  <MoreHorizontal className="w-5 h-5" />
                                </button>

                                {/* Dropdown Menu */}
                                {isMenuOpen && (
                                  <div className={`absolute right-0 mt-2 w-56 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-xl shadow-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} py-2 z-50`}>
                                    <button
                                      onClick={() => toggleSave(post.id)}
                                      className={`w-full px-4 py-2.5 text-left flex items-center gap-3 ${theme === 'light' ? 'hover:bg-gray-50 text-gray-700' : 'hover:bg-slate-700 text-gray-300'} transition-colors`}
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                      <span className="font-medium">Remove from Saved</span>
                                    </button>
                                    <button
                                      onClick={() => toggleFollow(post.author?.username)}
                                      className={`w-full px-4 py-2.5 text-left flex items-center gap-3 ${theme === 'light' ? 'hover:bg-gray-50 text-gray-700' : 'hover:bg-slate-700 text-gray-300'} transition-colors`}
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
                                    <div className={`border-t ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} my-1`}></div>
                                    <button className={`w-full px-4 py-2.5 text-left flex items-center gap-3 ${theme === 'light' ? 'hover:bg-gray-50 text-red-600' : 'hover:bg-slate-700 text-red-500'} transition-colors`}>
                                      <Flag className="w-4 h-4" />
                                      <span className="font-medium">Report</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Post Title */}
                          <h2 
                            onClick={() => nav(`/post/${post.id}`)}
                            className={`text-2xl md:text-3xl font-bold ${theme === 'light' ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-500'} mb-3 transition-colors cursor-pointer leading-tight`}
                          >
                            {post.title}
                          </h2>

                          {/* Post Content */}
                          {isContentExpanded ? (
                            <div className={`prose ${theme === 'dark' ? 'dark:prose-invert' : ''} max-w-none`}>
                              <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-4 leading-relaxed`}>
                                {post.content}
                              </p>
                              <button
                                onClick={() => setExpandedPostId(null)}
                                className={`${theme === 'light' ? 'text-blue-600' : 'text-blue-500'} hover:underline font-medium text-sm`}
                              >
                                Show less
                              </button>
                            </div>
                          ) : (
                            <div className="relative">
                              <div className="relative mb-3">
                                <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} line-clamp-2 leading-relaxed pr-4`}>
                                  {post.content}
                                </p>
                                {post.content && post.content.length > 150 && (
                                  <div className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t ${theme === 'light' ? 'from-white' : 'from-slate-800'} to-transparent flex items-end justify-center`}>
                                    <button
                                      onClick={() => setExpandedPostId(post.id)}
                                      className={`relative -bottom-2 px-4 py-1.5 ${theme === 'light' ? 'bg-white border-gray-200 text-blue-600 hover:text-blue-700 hover:bg-gray-50' : 'bg-slate-800 border-slate-700 text-blue-500 hover:text-blue-400 hover:bg-slate-700'} border font-medium text-sm rounded-full shadow-sm transition-colors`}
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
                        {post.featured_image && (
                          <div className="w-full h-72 md:h-80 overflow-hidden">
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                              onClick={() => nav(`/post/${post.id}`)}
                            />
                          </div>
                        )}

                        {/* Post Footer */}
                        <div className="p-6 pt-4">
                          {/* Tags */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className={`px-3 py-1.5 bg-gradient-to-r ${theme === 'light' ? 'from-blue-50 to-purple-50 text-blue-700 hover:from-blue-100 hover:to-purple-100' : 'from-blue-900/20 to-purple-900/20 text-blue-400 hover:from-blue-900/30 hover:to-purple-900/30'} text-sm font-medium rounded-full transition-all cursor-pointer`}
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Stats & Actions */}
                          <div className={`flex items-center justify-between pt-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}`}>
                            {/* Stats */}
                            <div className={`flex items-center gap-6 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{post.read_time || 5} min read</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1">
                              {/* Like Button - From FeedContent */}
                              <button
                                onClick={() => toggleLike(post.id)}
                                disabled={!user?.id}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                                  isLiked
                                    ? `bg-gradient-to-r ${theme === 'light' ? 'from-red-50 to-pink-50 text-red-600' : 'from-red-900/20 to-pink-900/20 text-red-400'} shadow-sm`
                                    : `${theme === 'light' ? 'text-gray-600 hover:text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-red-400 hover:bg-red-900/20'}`
                                } ${!user?.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title={!user?.id ? "Login to like posts" : isLiked ? "Unlike post" : "Like post"}
                              >
                                <Heart
                                  className={`w-5 h-5 ${
                                    isLiked ? "fill-current" : ""
                                  }`}
                                />
                                <span className="font-medium">
                                  {post.likescount || 0}
                                </span>
                              </button>

                              {/* Comment */}
                              <button
                                onClick={() => toggleComments(post.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                                  isCommentsOpen
                                    ? `bg-gradient-to-r ${theme === 'light' ? 'from-blue-50 to-cyan-50 text-blue-600' : 'from-blue-900/20 to-cyan-900/20 text-blue-400'} shadow-sm`
                                    : `${theme === 'light' ? 'text-gray-600 hover:text-blue-500 hover:bg-blue-50' : 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20'}`
                                }`}
                              >
                                <MessageCircle className="w-5 h-5" />
                                <span className="font-medium">
                                  {post.comments_count || 0}
                                </span>
                              </button>

                              {/* Save Button - From FeedContent but always saved in SavedPage */}
                              <button
                                onClick={() => toggleSave(post.id)}
                                disabled={!user?.id}
                                className={`p-2.5 rounded-xl transition-all duration-300 ${
                                  `bg-gradient-to-r ${theme === 'light' ? 'from-yellow-50 to-amber-50 text-yellow-600' : 'from-yellow-900/20 to-amber-900/20 text-yellow-400'} shadow-sm`
                                } ${!user?.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Remove from saved"
                              >
                                <Bookmark
                                  className={`w-5 h-5 fill-current`}
                                />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* ========== COMMENTS SECTION ========== */}
                        {isCommentsOpen && (
                          <div className={`border-t ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} bg-gradient-to-b ${theme === 'light' ? 'from-gray-50/50 to-transparent' : 'from-slate-900/50 to-transparent'}`}>
                            <div className="p-6 space-y-6 max-h-80 overflow-y-auto">
                              {/* Existing Comments */}
                              {comments[post.id]?.map((comment) => (
                                <div key={comment.id} className="flex gap-4">
                                  <img
                                    src={comment.author.avatar}
                                    alt={comment.author.name}
                                    className={`w-10 h-10 rounded-full border-2 ${theme === 'light' ? 'border-white' : 'border-slate-800'} flex-shrink-0`}
                                  />
                                  <div className="flex-1">
                                    <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl p-4 shadow-sm`}>
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                          <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-sm`}>
                                            {comment.author.name}
                                          </span>
                                          <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {comment.timestamp}
                                          </span>
                                        </div>
                                        <button
                                          onClick={() =>
                                            toggleCommentLike(post.id, comment.id)
                                          }
                                          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${
                                            comment.isLiked
                                              ? `${theme === 'light' ? 'text-red-600 bg-red-50' : 'text-red-400 bg-red-900/20'}`
                                              : `${theme === 'light' ? 'text-gray-500 hover:text-red-500 hover:bg-gray-100' : 'text-gray-400 hover:text-red-400 hover:bg-slate-700'}`
                                          }`}
                                        >
                                          <Heart
                                            className={`w-3.5 h-3.5 ${
                                              comment.isLiked ? "fill-current" : ""
                                            }`}
                                          />
                                          <span className="text-xs font-medium">
                                            {comment.likes}
                                          </span>
                                        </button>
                                      </div>
                                      <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} text-sm leading-relaxed`}>
                                        {comment.content}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              {/* New Comment Input */}
                              <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} p-4`}>
                                <div className="flex items-end gap-4">
                                  <img
                                    src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser"}
                                    alt="You"
                                    className={`w-10 h-10 rounded-full border-2 ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} flex-shrink-0`}
                                  />
                                  <div className="flex-1">
                                    <textarea
                                      value={newComment}
                                      onChange={(e) =>
                                        setNewComment(e.target.value)
                                      }
                                      placeholder="Share your thoughts..."
                                      className={`w-full px-4 py-3 ${theme === 'light' ? 'bg-gray-50 text-gray-900 placeholder:text-gray-400' : 'bg-slate-700 text-white placeholder:text-slate-500'} rounded-xl resize-none focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:ring-blue-500' : 'focus:ring-blue-400'}`}
                                      rows="2"
                                    />
                                    <div className="flex items-center justify-between mt-3">
                                      <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                        Press Enter to post • Shift+Enter for new line
                                      </div>
                                      <button
                                        onClick={() => handleSendComment(post.id)}
                                        disabled={!newComment.trim()}
                                        className={`px-6 py-2 rounded-xl font-medium transition-all ${
                                          newComment.trim()
                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                                            : `${theme === 'light' ? 'bg-gray-200 text-gray-400' : 'bg-slate-700 text-slate-500'} cursor-not-allowed`
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
                  <button 
                    onClick={() => fetchSavedPosts()}
                    className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    Refresh Saved
                  </button>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className={`lg:col-span-1 space-y-6 md:space-y-8 ${showTrendingSidebar ? "block" : "hidden"} lg:block`}>
              {/* Trending Topics - Simplified */}
              <div className={`relative ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} p-5 shadow-lg transition-all duration-300`}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h3 className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-base`}>
                        Trending Topics
                      </h3>
                      <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        What's hot now
                      </p>
                    </div>
                  </div>
                  <button className={`text-sm ${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'} font-medium`}>
                    See all →
                  </button>
                </div>

                <div className="space-y-2">
                  {trendingTopics.map((topic, index) => (
                    <button
                      key={index}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700/50'} transition-colors group`}
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                            <Hash className="w-3.5 h-3.5 text-blue-500" />
                          </div>
                          {topic.trending && (
                            <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border ${theme === 'light' ? 'border-white' : 'border-slate-800'}`} />
                          )}
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <p className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-sm truncate`}>
                            {topic.tag}
                          </p>
                          <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {topic.posts} posts
                          </p>
                        </div>
                      </div>
                      {topic.trending && (
                        <span className={`px-2 py-0.5 bg-gradient-to-r from-red-500/10 to-pink-500/10 text-red-600 ${theme === 'dark' ? 'dark:text-red-400' : ''} text-xs font-medium rounded-full`}>
                          🔥
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommended Authors - Stacked layout */}
              <div className={`relative ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} p-5 shadow-lg transition-all duration-300`}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
                    <UsersIcon className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-base`}>
                      Top Authors
                    </h3>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Recommended for you
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {recommendedAuthors.map((author, index) => (
                    <div
                      key={index}
                      className={`flex flex-col p-3 rounded-lg ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700/50'} transition-colors`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="relative">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5`}>
                            <div className={`w-full h-full rounded-full ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} flex items-center justify-center`}>
                              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 text-sm">
                                {author.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border ${theme === 'light' ? 'border-white' : 'border-slate-800'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-sm truncate`}>
                            {author.name}
                          </p>
                          <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
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

                <div className={`mt-5 pt-4 border-t ${theme === 'light' ? 'border-gray-100' : 'border-slate-700/50'}`}>
                  <button className={`w-full text-sm ${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'} font-medium text-center`}>
                    View all recommendations →
                  </button>
                </div>
              </div>

              {/* Quick Stats - Compact */}
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
                          <UsersIcon className="w-3.5 h-3.5" />
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
  );
}
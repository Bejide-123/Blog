import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
// Import the new services
import { 
  getPublicPosts, 
  togglePostLike, 
  toggleSavePost, 
  getUserLikedPosts, 
  getUserSavedPosts,
  getPostComments,
  addComment,
  deleteComment,
  toggleCommentLike,
  getUserCommentLikes
} from "../../Services/post";
import { useUser } from "../../Context/userContext";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Users,
  Clock,
  Eye,
  TrendingUp,
  Sparkles,
  Filter,
  Zap,
  Users as UsersIcon,
  Share2,
  Star,
  Repeat2,
  BookOpen,
  Hash,
  Trash2,
  Send,
} from "lucide-react";
import { useTheme } from "../../Context/themeContext";

export default function FeedContent() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("forYou");
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [likeProcessingPosts, setLikeProcessingPosts] = useState(new Set());
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [postComments, setPostComments] = useState({}); // Changed from comments to postComments
  const [activeMenuPost, setActiveMenuPost] = useState(null);
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [hiddenPosts, setHiddenPosts] = useState(new Set());
  const [repostedPosts, setRepostedPosts] = useState(new Set());
  const [showTrendingSidebar, setShowTrendingSidebar] = useState(true);
  const [likedComments, setLikedComments] = useState(new Set());
  const [commentInputs, setCommentInputs] = useState({}); // For storing comment input per post
  
  // Add state for real posts
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false
  });

  // Add state for mobile feed header visibility
  const [showFeedHeader, setShowFeedHeader] = useState(false);

  // Fetch posts and user data on component mount
  useEffect(() => {
    fetchPosts();
    if (user?.id) {
      fetchUserData();
    }
  }, [activeTab, user]);

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      
      let options = {
        limit: pagination.limit,
        offset: (page - 1) * pagination.limit
      };
      
      // Configure options based on active tab
      switch(activeTab) {
        case 'trending':
          options.sortBy = 'likescount';
          options.sortOrder = 'desc';
          break;
        case 'latest':
          options.sortBy = 'createdat';
          options.sortOrder = 'desc';
          break;
        case 'forYou':
        default:
          options.sortBy = 'createdat';
          options.sortOrder = 'desc';
      }
      
      const result = await getPublicPosts(options);
      
      if (page === 1) {
        setPosts(result.posts);
      } else {
        setPosts(prev => [...prev, ...result.posts]);
      }
      
      setPagination(prev => ({
        ...prev,
        page,
        total: result.total,
        hasMore: result.hasMore
      }));
      
      setError(null);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's liked and saved posts
  const fetchUserData = async () => {
    try {
      if (!user?.id) return;
      
      const likedPostIds = await getUserLikedPosts(user.id);
      setLikedPosts(new Set(likedPostIds));
      
      const savedPostIds = await getUserSavedPosts(user.id);
      setSavedPosts(new Set(savedPostIds));

      // Fetch user's liked comments
      const likedCommentIds = await getUserCommentLikes(user.id);
      setLikedComments(new Set(likedCommentIds));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // ========== LIKE FUNCTIONALITY ==========
  const toggleLike = async (postId) => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    // Prevent duplicate requests for the same post
    if (likeProcessingPosts.has(postId)) return;
    setLikeProcessingPosts(prev => {
      const s = new Set(prev);
      s.add(postId);
      return s;
    });
    
    try {
      const { liked, count } = await togglePostLike(postId, user.id);
      
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (liked) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });
      
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, likescount: count || 0 } 
            : post
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to update like. Please try again.');
    } finally {
      setLikeProcessingPosts(prev => {
        const s = new Set(prev);
        s.delete(postId);
        return s;
      });
    }
  };

  // ========== SAVE FUNCTIONALITY ==========
  const toggleSave = async (postId) => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    
    try {
      const { saved } = await toggleSavePost(postId, user.id);
      
      setSavedPosts(prev => {
        const newSet = new Set(prev);
        if (saved) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });
      
      if (saved) {
        console.log('Post saved successfully');
      } else {
        console.log('Post removed from saved');
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      alert('Failed to update saved post. Please try again.');
    }
  };

  // ========== COMMENT FUNCTIONS ==========
  const toggleComments = async (postId) => {
    if (activeCommentPost === postId) {
      setActiveCommentPost(null);
    } else {
      setActiveCommentPost(postId);
      // Fetch comments for this post
      try {
        const comments = await getPostComments(postId);
        setPostComments(prev => ({
          ...prev,
          [postId]: comments
        }));
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }
  };

  const handleSendComment = async (postId) => {
    const commentText = commentInputs[postId] || newComment;
    
    if (!commentText.trim() || !user?.id) {
      if (!user?.id) navigate('/login');
      return;
    }
    
    try {
      // Add comment to database
      const comment = await addComment(postId, user.id, commentText.trim());
      
      // Update comments for this post
      setPostComments(prev => ({
        ...prev,
        [postId]: [comment, ...(prev[postId] || [])]
      }));
      
      // Clear comment input
      setCommentInputs(prev => ({
        ...prev,
        [postId]: ""
      }));
      setNewComment("");
      
      // Update post comment count
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                comments_count: (post.comments_count || 0) + 1 
              } 
            : post
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      await deleteComment(commentId, user.id);
      
      // Remove comment from state
      setPostComments(prev => ({
        ...prev,
        [postId]: (prev[postId] || []).filter(comment => comment.id !== commentId)
      }));
      
      // Update post comment count
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                comments_count: Math.max(0, (post.comments_count || 0) - 1)
              } 
            : post
        )
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const handleCommentLike = async (postId, commentId) => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    
    try {
      const { liked } = await toggleCommentLike(commentId, user.id);
      
      // Update liked comments state
      setLikedComments(prev => {
        const newSet = new Set(prev);
        if (liked) {
          newSet.add(commentId);
        } else {
          newSet.delete(commentId);
        }
        return newSet;
      });
      
      // Update comment in state
      setPostComments(prev => ({
        ...prev,
        [postId]: (prev[postId] || []).map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes_count: liked ? (comment.likes_count || 0) + 1 : Math.max(0, (comment.likes_count || 0) - 1)
            };
          }
          return comment;
        })
      }));
    } catch (error) {
      console.error('Error toggling comment like:', error);
    }
  };

  const handleLoadMore = () => {
    if (pagination.hasMore) {
      fetchPosts(pagination.page + 1);
    }
  };

  const tabs = [
    { id: "forYou", label: "For You", icon: <Sparkles className="w-4 h-4" /> },
    { id: "following", label: "Following", icon: <UsersIcon className="w-4 h-4" /> },
    { id: "latest", label: "Latest", icon: <Zap className="w-4 h-4" /> },
    { id: "trending", label: "Trending", icon: <TrendingUp className="w-4 h-4" /> },
  ];

  // ========== OTHER FUNCTIONS ==========
  const toggleMenu = (postId) => {
    if (activeMenuPost === postId) {
      setActiveMenuPost(null);
    } else {
      setActiveMenuPost(postId);
    }
  };

  const copyLink = (postId) => {
    const link = `${window.location.origin}/post/${postId}`;
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

  // Format comment date
  const formatCommentDate = (dateString) => {
    if (!dateString) return '';
    return formatDate(dateString);
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

  // Filter out hidden posts
  const visiblePosts = posts.filter((post) => !hiddenPosts.has(post.id));

  if (loading && posts.length === 0) {
    return (
      <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-900'} pt-16 md:pt-20`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className={`mt-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Loading posts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-900'} pt-16 md:pt-20`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className={`${theme === 'light' ? 'text-red-500' : 'text-red-400'}`}>{error}</p>
            <button 
              onClick={() => fetchPosts()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme === 'light' ? 'from-gray-50 via-white to-white' : 'from-slate-900 via-slate-900 to-slate-950'} pt-10 md:pt-16`}>
      <div className="max-w-7xl mx-auto px-4 py-8 pb-28 md:pb-28 lg:pb-32">
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3">
            {/* Mobile Toggle Button - Only show on small screens */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFeedHeader(!showFeedHeader)}
                className={`w-full flex items-center justify-between px-4 py-3 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} rounded-xl shadow-sm transition-all duration-300`}
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${showFeedHeader ? 'bg-blue-500/10' : theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'}`}>
                    {showFeedHeader ? (
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      Feed Options
                    </h3>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {showFeedHeader ? 'Hide filters and tabs' : 'Show filters and tabs'}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-medium ${theme === 'light' ? 'bg-blue-50 text-blue-600' : 'bg-blue-900/30 text-blue-400'}`}>
                  {activeTab === 'forYou' ? 'For You' : 
                   activeTab === 'following' ? 'Following' :
                   activeTab === 'latest' ? 'Latest' : 'Trending'}
                </span>
              </button>
            </div>

            {/* Header - Hidden on mobile by default, togglable */}
            <div className={`${showFeedHeader ? 'block' : 'hidden'} lg:block relative ${theme === 'light' ? 'bg-white/95' : 'bg-slate-800/95'} backdrop-blur-lg border ${theme === 'light' ? 'border-gray-200/50' : 'border-slate-700/50'} rounded-2xl p-4 mb-8 shadow-sm transition-all duration-300`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${theme === 'light' ? 'from-blue-600 to-purple-600' : 'from-blue-500 to-purple-500'} bg-clip-text text-transparent`}>
                    Your Feed
                  </h1>
                  <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-sm mt-1`}>
                    {pagination.total} stories available
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button className={`flex items-center gap-2 px-4 py-2.5 ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'} rounded-xl transition-all`}>
                    <Filter className="w-4 h-4" />
                    <span className="font-medium">Filters</span>
                  </button>
                  <button
                    onClick={() => navigate("/create")}
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    New Story
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto mt-6 pb-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      // On mobile, close the header after selecting a tab
                      if (window.innerWidth < 1024) {
                        setShowFeedHeader(false);
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 text-sm sm:text-base ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-8">
              {visiblePosts.length === 0 ? (
                <div className={`text-center py-12 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}`}>
                  <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-lg`}>No posts found.</p>
                  <button 
                    onClick={() => navigate("/create")}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700"
                  >
                    Create the first post
                  </button>
                </div>
              ) : (
                visiblePosts.map((post) => {
                  const isLiked = likedPosts.has(post.id);
                  const isSaved = savedPosts.has(post.id);
                  const isCommentsOpen = activeCommentPost === post.id;
                  const isMenuOpen = activeMenuPost === post.id;
                  const isFollowing = followedUsers.has(post.author?.username);
                  const isReposted = repostedPosts.has(post.id);
                  const comments = postComments[post.id] || [];
                  const commentText = commentInputs[post.id] || "";

                  return (
                    <article
                      key={post.id}
                      className={`group relative ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} shadow-lg hover:shadow-2xl ${theme === 'light' ? '' : 'dark:hover:shadow-slate-900/50'} transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer`}
                      onClick={(e) => {
                        // Only navigate if clicking on the article itself, not buttons inside
                        if (!e.target.closest('button') && !e.target.closest('a')) {
                          navigate(`/post/${post.id}`);
                        }
                      }}
                    >
                      {/* Post Header */}
                      <div className="p-4 sm:p-6 pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Link to={`/profile/${post.author?.id}`} onClick={(e) => e.stopPropagation()} className="relative">
                              <img
                                src={post.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.username || 'anonymous'}`}
                                alt={post.author?.full_name || 'Anonymous'}
                                className={`w-12 h-12 rounded-xl border-2 ${theme === 'light' ? 'border-white' : 'border-slate-800'} shadow-sm`}
                              />
                            </Link>
                            <div>
                              <div className="flex items-center gap-2">
                                <Link to={`/profile/${post.author?.id}`} onClick={(e) => e.stopPropagation()}>
                                  <h3 className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-sm`}>
                                    {post.author?.full_name || 'Anonymous'}
                                  </h3>
                                </Link>
                                <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                  •
                                </span>
                                <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                  {formatDate(post.createdat)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Link to={`/profile/${post.author?.id}`} onClick={(e) => e.stopPropagation()}>
                                  <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    @{post.author?.username || 'anonymous'}
                                  </p>
                                </Link>
                              </div>
                            </div>
                          </div>

                          {/* Follow Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFollow(post.author?.username);
                            }}
                            className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg text-sm font-medium transition-all ${
                              isFollowing
                                ? `${theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`
                                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-sm"
                            }`}
                          >
                            {isFollowing ? "Following" : "Follow"}
                          </button>
                        </div>

                        {/* Post Title */}
                        <h2 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/post/${post.id}`);
                          }}
                          className={`text-xl sm:text-2xl md:text-3xl font-bold ${theme === 'light' ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-500'} mb-3 transition-colors cursor-pointer leading-tight`}
                        >
                          {post.title}
                        </h2>

                        {/* Post Content */}
                        {expandedPostId === post.id ? (
                          <div className={`prose ${theme === 'dark' ? 'dark:prose-invert' : ''} max-w-none`}>
                            <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-4 leading-relaxed`}>
                              {post.content}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedPostId(null);
                              }}
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
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedPostId(post.id);
                                    }}
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
                        <div className="w-full h-64 sm:h-72 md:h-80 overflow-hidden">
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/post/${post.id}`);
                            }}
                          />
                        </div>
                      )}

                      {/* Post Footer */}
                      <div className="p-4 sm:p-6 pt-4">
                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, index) => (
                              <span
                                key={index}
                                className={`px-3 py-1.5 bg-gradient-to-r ${theme === 'light' ? 'from-blue-50 to-purple-50 text-blue-700 hover:from-blue-100 hover:to-purple-100' : 'from-blue-900/20 to-purple-900/20 text-blue-400 hover:from-blue-900/30 hover:to-purple-900/30'} text-xs sm:text-sm font-medium rounded-full transition-all cursor-pointer`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // You could add tag filtering here
                                }}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Stats & Actions */}
                        <div className={`flex items-center justify-between flex-wrap gap-4 pt-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}`}>
                          {/* Stats */}
                          <div className={`flex items-center gap-4 sm:gap-6 text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{post.read_time || 5} min read</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1">
                            {/* Like Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(post.id);
                              }}
                              disabled={!user?.id}
                              className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-300 ${
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
                              <span className="font-medium text-xs sm:text-sm">
                                {post.likescount || 0}
                              </span>
                            </button>

                            {/* Comment */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleComments(post.id);
                              }}
                              className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-300 ${
                                isCommentsOpen
                                  ? `bg-gradient-to-r ${theme === 'light' ? 'from-blue-50 to-cyan-50 text-blue-600' : 'from-blue-900/20 to-cyan-900/20 text-blue-400'} shadow-sm`
                                  : `${theme === 'light' ? 'text-gray-600 hover:text-blue-500 hover:bg-blue-50' : 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20'}`
                              }`}
                            >
                              <MessageCircle className="w-5 h-5" />
                              <span className="font-medium text-xs sm:text-sm">
                                {post.comments_count || 0}
                              </span>
                            </button>

                            {/* Save Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSave(post.id);
                              }}
                              disabled={!user?.id}
                              className={`p-2 sm:p-2.5 rounded-xl transition-all duration-300 ${
                                isSaved
                                  ? `bg-gradient-to-r ${theme === 'light' ? 'from-yellow-50 to-amber-50 text-yellow-600' : 'from-yellow-900/20 to-amber-900/20 text-yellow-400'} shadow-sm`
                                  : `${theme === 'light' ? 'text-gray-600 hover:text-yellow-500 hover:bg-yellow-50' : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-900/20'}`
                              } ${!user?.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title={!user?.id ? "Login to save posts" : isSaved ? "Remove from saved" : "Save post"}
                            >
                              <Bookmark
                                className={`w-5 h-5 ${
                                  isSaved ? "fill-current" : ""
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* ========== COMMENTS SECTION ========== */}
                      {isCommentsOpen && (
                        <div 
                          className={`border-t ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} bg-gradient-to-b ${theme === 'light' ? 'from-gray-50/50 to-transparent' : 'from-slate-900/50 to-transparent'}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="p-4 sm:p-6 space-y-6 max-h-80 overflow-y-auto">
                            {/* Existing Comments */}
                            {comments.length > 0 ? (
                              comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                  <img
                                    src={comment.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.username || 'anonymous'}`}
                                    alt={comment.author?.full_name || 'Anonymous'}
                                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${theme === 'light' ? 'border-white' : 'border-slate-800'} flex-shrink-0`}
                                  />
                                  <div className="flex-1">
                                    <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl p-3 sm:p-4 shadow-sm`}>
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-xs sm:text-sm`}>
                                            {comment.author?.full_name || 'Anonymous'}
                                          </span>
                                          <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                            @{comment.author?.username || 'anonymous'}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                        <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} ml-auto`}>
                                            {formatCommentDate(comment.created_at)}
                                          </span>
                                          <button
                                            onClick={() => handleCommentLike(post.id, comment.id)}
                                            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${
                                              likedComments.has(comment.id)
                                                ? `${theme === 'light' ? 'text-red-600 bg-red-50' : 'text-red-400 bg-red-900/20'}`
                                                : `${theme === 'light' ? 'text-gray-500 hover:text-red-500 hover:bg-gray-100' : 'text-gray-400 hover:text-red-400 hover:bg-slate-700'}`
                                            }`}
                                          >
                                            <Heart
                                              className={`w-3.5 h-3.5 ${
                                                likedComments.has(comment.id) ? "fill-current" : ""
                                              }`}
                                            />
                                            <span className="text-xs font-medium">
                                              {comment.likes_count || 0}
                                            </span>
                                          </button>
                                          {user?.id === comment.user_id && (
                                            <button
                                              onClick={() => handleDeleteComment(post.id, comment.id)}
                                              className={`p-1.5 ${theme === 'light' ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-red-400 hover:bg-red-900/20'} rounded-lg transition-colors`}
                                              title="Delete comment"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                      <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} text-sm leading-relaxed font-medium`}>
                                        {comment.content}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className={`text-center py-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                No comments yet. Be the first to comment!
                              </div>
                            )}

                            {/* New Comment Input */}
                            <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} p-4`}>
                              <div className="flex items-end gap-3 sm:gap-4">
                                <img
                                  src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`}
                                  alt="You"
                                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} flex-shrink-0`}
                                />
                                <div className="flex-1">
                                  <textarea
                                    value={commentText}
                                    onChange={(e) => setCommentInputs(prev => ({
                                      ...prev,
                                      [post.id]: e.target.value
                                    }))}
                                    placeholder="Share your thoughts..."
                                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 ${theme === 'light' ? 'bg-gray-50 text-gray-900 placeholder:text-gray-400' : 'bg-slate-700 text-white placeholder:text-slate-500'} rounded-xl resize-none focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:ring-blue-500' : 'focus:ring-blue-400'}`}
                                    rows="2"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <div className="flex items-center justify-between mt-3">
                                    <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} hidden sm:block`}>
                                      Press Enter to post • Shift+Enter for new line
                                    </div>
                                    <div className="ml-auto">
                                    <button
                                      onClick={() => handleSendComment(post.id)}
                                      disabled={!commentText.trim()}
                                      className={`px-4 sm:px-6 py-2 rounded-xl font-medium transition-all ${
                                        commentText.trim()
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
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>

            {/* Load More */}
            {pagination.hasMore && (
              <div className="flex justify-center mt-12">
                <button 
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="w-5 h-5" />
                  {loading ? 'Loading...' : 'Load More Stories'}
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div
            className={`lg:col-span-1 space-y-6 md:space-y-8 ${
              showTrendingSidebar ? "block" : "hidden"
            } lg:block`}
          >
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

                <button onClick={() => navigate("/dashboard")} className="w-full mt-5 px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium rounded-lg transition-colors text-sm">
                  View Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
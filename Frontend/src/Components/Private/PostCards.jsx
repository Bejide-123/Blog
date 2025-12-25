import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
// Import the new service
import { getPublicPosts } from "../../Services/post";
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
} from "lucide-react";

export default function FeedContent() {
  const [activeTab, setActiveTab] = useState("forYou");
  const navigate = useNavigate();
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState({});
  const [activeMenuPost, setActiveMenuPost] = useState(null);
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [hiddenPosts, setHiddenPosts] = useState(new Set());
  const [repostedPosts, setRepostedPosts] = useState(new Set());
  const [showTrendingSidebar, setShowTrendingSidebar] = useState(true);
  const [likedComments, setLikedComments] = useState(new Set());
  
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

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [activeTab]); // Re-fetch when tab changes

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
          options.sortBy = 'createdat';
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

  // ========== MISSING FUNCTIONS ==========
  const toggleComments = (postId) => {
    if (activeCommentPost === postId) {
      setActiveCommentPost(null);
    } else {
      setActiveCommentPost(postId);
    }
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

  // Filter out hidden posts
  const visiblePosts = posts.filter((post) => !hiddenPosts.has(post.id));

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading posts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400">{error}</p>
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border border-gray-200/50 dark:border-slate-700/50 rounded-2xl p-4 mb-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 bg-clip-text text-transparent">
                    Your Feed
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {pagination.total} stories available
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-all">
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
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
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
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700">
                  <p className="text-gray-600 dark:text-gray-400 text-lg">No posts found.</p>
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
                  const isBookmarked = bookmarkedPosts.has(post.id);
                  const isCommentsOpen = activeCommentPost === post.id;
                  const isMenuOpen = activeMenuPost === post.id;
                  const isFollowing = followedUsers.has(post.author?.username);
                  const isReposted = repostedPosts.has(post.id);

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
                                src={post.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.username || 'anonymous'}`}
                                alt={post.author?.full_name || 'Anonymous'}
                                className="w-12 h-12 rounded-xl border-2 border-white dark:border-slate-800 shadow-sm"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                                  {post.author?.full_name || 'Anonymous'}
                                </h3>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  •
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDate(post.createdat)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  @{post.author?.username || 'anonymous'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Follow Button */}
                          <button
                            onClick={() => toggleFollow(post.author?.username)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                              isFollowing
                                ? "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
                                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-sm"
                            }`}
                          >
                            {isFollowing ? "Following" : "Follow"}
                          </button>
                        </div>

                        {/* Post Title */}
                        <h2 
                          onClick={() => navigate(`/post/${post.id}`)}
                          className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-500 transition-colors cursor-pointer leading-tight"
                        >
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
                                {post.content}
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
                      {post.featured_image && (
                        <div className="w-full h-72 md:h-80 overflow-hidden">
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                            onClick={() => navigate(`/post/${post.id}`)}
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
                                className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-full hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all cursor-pointer"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Stats & Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                          {/* Stats */}
                          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{post.read_time || 5} min read</span>
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
                                {post.likes_count || 0}
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
                                {post.comments_count || 0}
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

                      {/* ========== COMMENTS SECTION ========== */}
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
                                        onClick={() =>
                                          toggleCommentLike(post.id, comment.id)
                                        }
                                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${
                                          comment.isLiked
                                            ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                                            : "text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700"
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

            {/* Recommended Authors - Stacked layout */}
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
  );
}
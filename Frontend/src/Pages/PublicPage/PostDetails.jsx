import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Clock,
  User,
  Calendar,
  Tag,
  ArrowLeft,
  MoreHorizontal,
  Trash2,
  Eye,
  TrendingUp,
  Sparkles,
  ChevronLeft,
  Hash,
  Send,
} from "lucide-react";
import NavbarPrivate from "../../Components/Private/Navbarprivate";
import { 
  getPostDetails, 
  togglePostLike, 
  toggleSavePost, 
  addComment, 
  deleteComment, 
  toggleCommentLike,
  getUserLikedPosts,
  getUserSavedPosts,
  getUserCommentLikes
} from "../../Services/post";
import { useUser } from "../../Context/userContext";
import { useTheme } from "../../Context/themeContext";

export default function PostDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { theme } = useTheme();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeProcessing, setLikeProcessing] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likedComments, setLikedComments] = useState(new Set());
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [activeMenuComment, setActiveMenuComment] = useState(null);

  useEffect(() => {
    if (id) {
      fetchPostDetails();
      fetchUserData();
    }
  }, [id, user]);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const postData = await getPostDetails(id);
      setPost(postData);
      
      if (postData.tags && postData.tags.length > 0) {
        setRelatedPosts([]);
      }
    } catch (err) {
      console.error('Failed to fetch post details:', err);
      setError('Failed to load post. It may have been removed or you may not have permission to view it.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    if (!user?.id) return;
    
    try {
      const likedPostIds = await getUserLikedPosts(user.id);
      setLiked(likedPostIds.includes(id));
      
      const savedPostIds = await getUserSavedPosts(user.id);
      setSaved(savedPostIds.includes(id));
      
      const likedCommentIds = await getUserCommentLikes(user.id);
      setLikedComments(new Set(likedCommentIds));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLike = async () => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    if (likeProcessing) return;
    setLikeProcessing(true);
    
    try {
      const { liked: isLiked, count } = await togglePostLike(id, user.id);
      setLiked(isLiked);
      
      setPost(prev => ({
        ...prev,
        likescount: count
      }));
    } catch (error) {
      console.error('Error liking post:', error);
      alert('Failed to update like. Please try again.');
    } finally {
      setLikeProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    
    try {
      const { saved: isSaved } = await toggleSavePost(id, user.id);
      setSaved(isSaved);
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to update saved status. Please try again.');
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
        alert('Failed to copy link. Please try again.');
      });
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!user?.id) {
      navigate('/login');
      return;
    }
    
    if (!newComment.trim()) {
      return;
    }
    
    try {
      setSubmittingComment(true);
      const comment = await addComment(id, user.id, newComment.trim());
      
      setPost(prev => ({
        ...prev,
        comments: [comment, ...(prev.comments || [])],
        commentCount: (prev.commentCount || 0) + 1
      }));
      
      setNewComment("");
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      await deleteComment(commentId, user.id);
      
      setPost(prev => ({
        ...prev,
        comments: prev.comments.filter(comment => comment.id !== commentId),
        commentCount: Math.max(0, (prev.commentCount || 0) - 1)
      }));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const handleCommentLike = async (commentId) => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    
    try {
      const { liked: isLiked } = await toggleCommentLike(commentId, user.id);
      
      setLikedComments(prev => {
        const newSet = new Set(prev);
        if (isLiked) {
          newSet.add(commentId);
        } else {
          newSet.delete(commentId);
        }
        return newSet;
      });
      
      setPost(prev => ({
        ...prev,
        comments: prev.comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes_count: isLiked ? (comment.likes_count || 0) + 1 : Math.max(0, (comment.likes_count || 0) - 1)
            };
          }
          return comment;
        })
      }));
    } catch (error) {
      console.error('Error toggling comment like:', error);
    }
  };

  const toggleCommentMenu = (commentId) => {
    setActiveMenuComment(activeMenuComment === commentId ? null : commentId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
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
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const formatReadTime = (minutes) => {
    if (!minutes) return '5 min read';
    if (minutes < 1) return 'Less than a minute';
    if (minutes === 1) return '1 min read';
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <>
        <NavbarPrivate />
        <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-900'} pt-16 md:pt-20`}>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className={`mt-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Loading post...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <NavbarPrivate />
        <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-900'} pt-16 md:pt-20`}>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center py-12">
              <p className={`${theme === 'light' ? 'text-red-500' : 'text-red-400'}`}>{error || 'Post not found'}</p>
              <button 
                onClick={() => navigate('/home')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Home
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
      
      <div className={`min-h-screen bg-gradient-to-b ${theme === 'light' ? 'from-gray-50 via-white to-white' : 'from-slate-900 via-slate-900 to-slate-950'} pt-16 md:pt-20 pb-24 md:pb-8`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 md:py-8">
          {/* Back Button */}
          <div className="mb-4 md:mb-6">
            <button
              onClick={() => navigate(-1)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${theme === 'light' ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-gray-400 hover:text-white hover:bg-slate-800'} transition-all`}
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">Back</span>
            </button>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Post Content */}
              <article className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl shadow-lg overflow-hidden mb-6`}>
                <div className="p-4 sm:p-6 lg:p-8">
                  {/* Post Title */}
                  <h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-4 leading-tight`}>
                    {post.title}
                  </h1>

                  {/* Author & Metadata */}
                  <div className="flex items-start justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <img
                        src={post.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.username || 'anonymous'}`}
                        alt={post.author?.full_name || 'Anonymous'}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} flex-shrink-0`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-sm sm:text-base truncate`}>
                            {post.author?.full_name || 'Anonymous'}
                          </h3>
                          <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} truncate`}>
                            @{post.author?.username || 'anonymous'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs mt-0.5">
                          <span className={`flex items-center gap-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.createdat)}
                          </span>
                          <span className={`${theme === 'light' ? 'text-gray-400' : 'text-gray-600'}`}>•</span>
                          <span className={`flex items-center gap-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            <Clock className="w-3 h-3" />
                            {formatReadTime(post.read_time)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Action Buttons */}
                    <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={handleLike}
                        disabled={likeProcessing}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                          liked
                            ? `bg-gradient-to-r ${theme === 'light' ? 'from-red-50 to-pink-50 text-red-600' : 'from-red-900/20 to-pink-900/20 text-red-400'}`
                            : `${theme === 'light' ? 'text-gray-600 hover:text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-red-400 hover:bg-red-900/20'}`
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                        <span className="font-medium text-sm">{post.likescount || 0}</span>
                      </button>

                      <button
                        onClick={handleSave}
                        className={`p-2 rounded-xl transition-all ${
                          saved
                            ? `bg-gradient-to-r ${theme === 'light' ? 'from-yellow-50 to-amber-50 text-yellow-600' : 'from-yellow-900/20 to-amber-900/20 text-yellow-400'}`
                            : `${theme === 'light' ? 'text-gray-600 hover:text-yellow-500 hover:bg-yellow-50' : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-900/20'}`
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
                      </button>

                      <button
                        onClick={handleShare}
                        className={`p-2 ${theme === 'light' ? 'text-gray-600 hover:text-green-500 hover:bg-green-50' : 'text-gray-400 hover:text-green-400 hover:bg-green-900/20'} rounded-xl transition-all`}
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Featured Image */}
                  {post.featured_image && (
                    <div className="my-6 -mx-4 sm:-mx-6 lg:-mx-8">
                      <div className="relative w-full aspect-video overflow-hidden">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          loading="eager"
                        />
                      </div>
                    </div>
                  )}

                  {/* Post Content */}
                  <div className={`prose prose-sm sm:prose-base ${theme === 'dark' ? 'dark:prose-invert' : ''} max-w-none mb-6`}>
                    <div className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} leading-relaxed whitespace-pre-line`}>
                      {post.content}
                    </div>
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1.5 bg-gradient-to-r ${theme === 'light' ? 'from-blue-50 to-purple-50 text-blue-700' : 'from-blue-900/20 to-purple-900/20 text-blue-400'} text-xs font-medium rounded-full`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Mobile Action Buttons */}
                  <div className="sm:hidden flex items-center gap-2 mb-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <button
                      onClick={handleLike}
                      disabled={likeProcessing}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl transition-all ${
                        liked
                          ? `bg-gradient-to-r ${theme === 'light' ? 'from-red-50 to-pink-50 text-red-600' : 'from-red-900/20 to-pink-900/20 text-red-400'}`
                          : `${theme === 'light' ? 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500' : 'bg-slate-700 text-gray-400 hover:bg-red-900/20 hover:text-red-400'}`
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                      <span className="font-medium text-sm">{post.likescount || 0}</span>
                    </button>

                    <button
                      onClick={handleSave}
                      className={`p-2.5 rounded-xl transition-all ${
                        saved
                          ? `bg-gradient-to-r ${theme === 'light' ? 'from-yellow-50 to-amber-50 text-yellow-600' : 'from-yellow-900/20 to-amber-900/20 text-yellow-400'}`
                          : `${theme === 'light' ? 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-500' : 'bg-slate-700 text-gray-400 hover:bg-yellow-900/20 hover:text-yellow-400'}`
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
                    </button>

                    <button
                      onClick={handleShare}
                      className={`p-2.5 ${theme === 'light' ? 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-500' : 'bg-slate-700 text-gray-400 hover:bg-green-900/20 hover:text-green-400'} rounded-xl transition-all`}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Stats Footer */}
                  <div className={`flex flex-wrap items-center justify-between gap-3 pt-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}`}>
                    <div className={`flex items-center gap-4 text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        <span>{post.likescount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{post.commentCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{post.views || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Comments Section */}
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl shadow-lg p-4 sm:p-6`}>
                <h2 className={`text-lg sm:text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-4`}>
                  Comments ({post.commentCount || 0})
                </h2>

                {/* Add Comment Form */}
                <form onSubmit={handleSubmitComment} className="mb-6">
                  <div className="flex gap-3">
                    <img
                      src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`}
                      alt="Your avatar"
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} flex-shrink-0`}
                    />
                    <div className="flex-1 min-w-0">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        className={`w-full px-3 py-2 ${theme === 'light' ? 'bg-gray-50 text-gray-900 placeholder:text-gray-400' : 'bg-slate-700 text-white placeholder:text-slate-500'} rounded-xl resize-none focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:ring-blue-500' : 'focus:ring-blue-400'} text-sm`}
                        rows="2"
                        disabled={submittingComment}
                      />
                      <div className="flex items-center justify-end mt-2">
                        <button
                          type="submit"
                          disabled={!newComment.trim() || submittingComment}
                          className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                            newComment.trim() && !submittingComment
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                              : `${theme === 'light' ? 'bg-gray-200 text-gray-400' : 'bg-slate-700 text-slate-500'} cursor-not-allowed`
                          }`}
                        >
                          {submittingComment ? 'Posting...' : 'Post'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <img
                          src={comment.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.username || 'anonymous'}`}
                          alt={comment.author?.full_name || 'Anonymous'}
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 ${theme === 'light' ? 'border-white' : 'border-slate-800'} flex-shrink-0`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className={`${theme === 'light' ? 'bg-gray-50' : 'bg-slate-700'} rounded-xl p-3`}>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-sm truncate`}>
                                    {comment.author?.full_name || 'Anonymous'}
                                  </span>
                                  <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} truncate`}>
                                    @{comment.author?.username || 'anonymous'}
                                  </span>
                                  <span className={`text-xs ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    • {formatDate(comment.created_at)}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="relative flex items-center gap-1 flex-shrink-0">
                                <button
                                  onClick={() => handleCommentLike(comment.id)}
                                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                                    likedComments.has(comment.id)
                                      ? `${theme === 'light' ? 'text-red-600 bg-red-50' : 'text-red-400 bg-red-900/20'}`
                                      : `${theme === 'light' ? 'text-gray-500 hover:text-red-500 hover:bg-gray-100' : 'text-gray-400 hover:text-red-400 hover:bg-slate-600'}`
                                  } transition-colors`}
                                >
                                  <Heart className={`w-3.5 h-3.5 ${likedComments.has(comment.id) ? "fill-current" : ""}`} />
                                  <span>{comment.likes_count || 0}</span>
                                </button>
                                
                                {user?.id === comment.user_id && (
                                  <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className={`p-1 ${theme === 'light' ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-red-400 hover:bg-red-900/20'} rounded-lg transition-colors`}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} leading-relaxed text-sm break-words`}>
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageCircle className={`w-12 h-12 ${theme === 'light' ? 'text-gray-400' : 'text-slate-600'} mx-auto mb-3`} />
                      <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} text-sm`}>
                        No comments yet. Be the first to share your thoughts!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Author Info */}
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl shadow-lg p-5`}>
                <h3 className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-base mb-4`}>
                  About the Author
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={post.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.username || 'anonymous'}`}
                    alt={post.author?.full_name || 'Anonymous'}
                    className={`w-12 h-12 rounded-full border-2 ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}`}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-sm truncate`}>
                      {post.author?.full_name || 'Anonymous'}
                    </h4>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} truncate`}>
                      @{post.author?.username || 'anonymous'}
                    </p>
                  </div>
                </div>
                {post.author?.bio && (
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} mb-4 line-clamp-3`}>
                    {post.author.bio}
                  </p>
                )}
                <button
                  onClick={() => navigate(`/profile/${post.author?.id}`)}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-sm"
                >
                  View Profile
                </button>
              </div>

              {/* Related Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl shadow-lg p-5`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h3 className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-base`}>
                        Related Tags
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {post.tags.slice(0, 5).map((tag, index) => (
                      <button
                        key={index}
                        className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700/50'} transition-colors`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                          <Hash className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <p className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-sm truncate flex-1 text-left`}>
                          #{tag}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-2xl p-5 text-white shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">
                        Post Stats
                      </h3>
                      <p className="text-xs text-white/70">Real-time</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                          <Heart className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm opacity-90">Likes</span>
                      </div>
                      <span className="font-bold text-sm">{post.likescount || 0}</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                          <MessageCircle className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm opacity-90">Comments</span>
                      </div>
                      <span className="font-bold text-sm">{post.commentCount || 0}</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                          <Eye className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm opacity-90">Views</span>
                      </div>
                      <span className="font-bold text-sm">{post.views || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
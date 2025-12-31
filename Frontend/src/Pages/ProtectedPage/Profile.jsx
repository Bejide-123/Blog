import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Link2,
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Edit3,
  Users,
  FileText,
  ExternalLink,
  Share2,
  Zap,
  TrendingUp,
  Star,
  Hash,
  Eye,
  Clock,
  Repeat2,
  Share2 as ShareIcon,
} from "lucide-react";
import NavbarPrivate from "../../Components/Private/Navbarprivate";
import EditProfileModal from "./EditProfile";
import { PageLoader } from "../../Components/Private/Loader";
import { UserContext } from "../../Context/userContext";
import { useTheme } from "../../Context/themeContext";
import {
  getUserProfileById,
  getUserPosts,
  getUserStats,
  checkFollowStatus,
  toggleFollowUser,
  getUserFollowers,
  getUserFollowing
} from "../../Services/user.js";

export default function ProfilePage() {
  const { userId } = useParams(); // Get userId from URL params
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);
  const { theme } = useTheme();
  
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Post interaction states
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState({});
  const [activeMenuPost, setActiveMenuPost] = useState(null);
  const [repostedPosts, setRepostedPosts] = useState(new Set());

  const isOwnProfile = currentUser?.id === userId || !userId;

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  useEffect(() => {
    if (activeTab === "followers" && followers.length === 0) {
      fetchFollowers();
    }
  }, [activeTab, followers.length]);

  useEffect(() => {
    if (activeTab === "following" && following.length === 0) {
      fetchFollowing();
    }
  }, [activeTab, following.length]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // Determine which user ID to fetch
      const targetUserId = userId || currentUser?.id;
      
      if (!targetUserId) {
        navigate('/login');
        return;
      }

      const [profileData, postsData, statsData] = await Promise.all([
        getUserProfileById(targetUserId),
        getUserPosts(targetUserId),
        getUserStats(targetUserId)
      ]);

      if (!profileData) {
        navigate('/404');
        return;
      }
      
      setProfileUser(profileData);
      setPosts(postsData);
      setStats(statsData);
      
      // Only try to check follow status if user is logged in and it's not own profile
      if (currentUser && currentUser.id !== targetUserId) {
        try {
          const followStatus = await checkFollowStatus(targetUserId);
          setIsFollowing(followStatus.isFollowing);
        } catch (followError) {
          console.warn("Could not check follow status (follows table may not be set up):", followError);
          setIsFollowing(false); // Default to not following
        }
      } else {
        setIsFollowing(false);
      }
      
    } catch (error) {
      console.error("Error fetching user profile:", error);
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    try {
      const targetUserId = userId || currentUser.id;
      const { isFollowing: newIsFollowing, action } = await toggleFollowUser(targetUserId);
      setIsFollowing(newIsFollowing);
      
      // Update local stats
      setStats(prev => ({
        ...prev,
        followers: action === 'followed' ? prev.followers + 1 : prev.followers - 1
      }));
      
      // Also update the profileUser data if we have it
      if (profileUser) {
        setProfileUser(prev => ({
          ...prev,
          followers_count: action === 'followed' ? prev.followers_count + 1 : Math.max(prev.followers_count - 1, 0)
        }));
      }
      
    } catch (error) {
      console.error("Error toggling follow:", error);
      // Show a user-friendly error message
      alert("Unable to follow/unfollow at this time. The follow system may not be fully set up yet.");
    }
  };

  const fetchFollowers = async () => {
    try {
      const targetUserId = userId || currentUser?.id;
      const followersData = await getUserFollowers(targetUserId);
      setFollowers(followersData);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  const fetchFollowing = async () => {
    try {
      const targetUserId = userId || currentUser?.id;
      const followingData = await getUserFollowing(targetUserId);
      setFollowing(followingData);
    } catch (error) {
      console.error("Error fetching following:", error);
    }
  };

  const handleTabClick = async (tabId) => {
    setActiveTab(tabId);
    
    const targetUserId = userId || currentUser?.id;
    if (!targetUserId) return;
    
    try {
      if (tabId === "followers") {
        const followersData = await getUserFollowers(targetUserId);
        setFollowers(followersData);
      } else if (tabId === "following") {
        const followingData = await getUserFollowing(targetUserId);
        setFollowing(followingData);
      }
    } catch (error) {
      console.error(`Error fetching ${tabId}:`, error);
    }
  };

  // Post interaction functions
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

  const handleSendComment = (postId) => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        author: {
          name: currentUser?.full_name || "You",
          username: currentUser?.username || "currentuser",
          avatar: currentUser?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser",
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

  // Format date
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

  const formatJoinDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getAvatarUrl = () => {
    if (!profileUser) return "https://api.dicebear.com/7.x/avataaars/svg?seed=default";
    return profileUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileUser.username || "user"}`;
  };

  const tabs = [
    { id: "posts", label: "Posts", count: stats.posts, icon: <FileText className="w-4 h-4" /> },
    { id: "about", label: "About", icon: <Users className="w-4 h-4" /> },
    { id: "followers", label: "Followers", count: stats.followers, icon: <Users className="w-4 h-4" /> },
    { id: "following", label: "Following", count: stats.following, icon: <Users className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <>
        <NavbarPrivate />
        <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-900'} pt-16 md:pt-20`}>
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className={`h-52 ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'} rounded-2xl mb-8`}></div>
              <div className={`h-96 ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'} rounded-2xl`}></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!profileUser) {
    return (
      <>
        <NavbarPrivate />
        <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-900'} pt-16 md:pt-20`}>
          <div className="max-w-5xl mx-auto px-4 py-8 text-center">
            <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
              User not found
            </h2>
            <button
              onClick={() => navigate('/home')}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
            >
              Go Home
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarPrivate />
      <div className={`min-h-screen bg-gradient-to-b ${theme === 'light' ? 'from-gray-50 via-white to-white' : 'from-slate-900 via-slate-900 to-slate-950'} pt-16 md:pt-20`}>
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Profile Header */}
          <div className={`relative ${theme === 'light' ? 'bg-white/95' : 'bg-slate-800/95'} backdrop-blur-lg border ${theme === 'light' ? 'border-gray-200/50' : 'border-slate-700/50'} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 mb-8 overflow-hidden`}>
            {/* Cover Photo */}
            <div className={`h-32 sm:h-40 md:h-52 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 relative`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Profile Info */}
            <div className="relative px-4 sm:px-6 pb-6 sm:pb-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 sm:-mt-20 md:-mt-24">
                {/* Avatar Container */}
                <div className="relative">
                  <div className={`relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-2xl border-4 ${theme === 'light' ? 'border-white' : 'border-slate-800'} shadow-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 p-1`}>
                    <img
                      src={getAvatarUrl()}
                      alt={profileUser.full_name || profileUser.username}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 sm:mt-0">
                  {isOwnProfile ? (
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleFollowToggle}
                        className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm ${
                          isFollowing
                            ? `${theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-300' : 'bg-slate-700 text-gray-300 hover:bg-slate-600 border-slate-600'} border`
                            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                        }`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                      <button className={`p-2 sm:p-2.5 ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:text-blue-500 hover:bg-blue-50' : 'bg-slate-700 text-gray-300 hover:text-blue-400 hover:bg-blue-900/20'} rounded-xl transition-all duration-300`}>
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Profile Details */}
              <div className="mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {profileUser.full_name || profileUser.username}
                    </h1>
                    <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} text-sm md:text-base mt-0.5`}>
                      @{profileUser.username}
                    </p>
                  </div>
                  <button className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'} rounded-xl transition-all duration-300 self-start sm:self-center text-sm`}>
                    <Share2 className="w-4 h-4" />
                    <span className="font-medium">Share</span>
                  </button>
                </div>

                {profileUser.bio && (
                  <p className={`mt-3 sm:mt-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} text-sm md:text-base leading-relaxed`}>
                    {profileUser.bio}
                  </p>
                )}

                {/* Profile Stats */}
                <div className={`flex flex-wrap items-center gap-4 sm:gap-6 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}`}>
                  <div className="flex items-center gap-1.5">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                    </div>
                    <div>
                      <span className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-base sm:text-lg`}>
                        {stats.posts}
                      </span>
                      <span className={`ml-1.5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-xs sm:text-sm`}>
                        Posts
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                    </div>
                    <div>
                      <span className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-base sm:text-lg`}>
                        {stats.followers}
                      </span>
                      <span className={`ml-1.5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-xs sm:text-sm`}>
                        Followers
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
                    </div>
                    <div>
                      <span className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-base sm:text-lg`}>
                        {stats.following}
                      </span>
                      <span className={`ml-1.5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-xs sm:text-sm`}>
                        Following
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Meta Info */}
                <div className={`flex flex-wrap items-center gap-3 sm:gap-4 mt-4 text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {profileUser.location && (
                    <div className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r ${theme === 'light' ? 'from-blue-50 to-purple-50' : 'from-blue-900/20 to-purple-900/20'} rounded-full`}>
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                      <span>{profileUser.location}</span>
                    </div>
                  )}
                  {profileUser.website_url && (
                    <a
                      href={profileUser.website_url.startsWith('http') ? profileUser.website_url : `https://${profileUser.website_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r ${theme === 'light' ? 'from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100' : 'from-blue-900/20 to-purple-900/20 hover:from-blue-900/30 hover:to-purple-900/30'} rounded-full transition-all`}
                    >
                      <Link2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                      <span>{profileUser.website_url}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {profileUser.created_at && (
                    <div className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r ${theme === 'light' ? 'from-blue-50 to-purple-50' : 'from-blue-900/20 to-purple-900/20'} rounded-full`}>
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      <span>Joined {formatJoinDate(profileUser.created_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className={`${theme === 'light' ? 'bg-white/95' : 'bg-slate-800/95'} backdrop-blur-lg border ${theme === 'light' ? 'border-gray-200/50' : 'border-slate-700/50'} rounded-2xl p-2 mb-8 shadow-sm`}>
            <div className="flex items-center gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`ml-1 ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-900/30'} px-2 py-0.5 rounded-full text-xs`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="space-y-8">
            {activeTab === "posts" && (
              <>
                {posts.length > 0 ? (
                  posts.map((post) => {
                    const isLiked = likedPosts.has(post.id);
                    const isBookmarked = bookmarkedPosts.has(post.id);
                    const isCommentsOpen = activeCommentPost === post.id;
                    const isMenuOpen = activeMenuPost === post.id;

                    return (
                      <article
                        key={post.id}
                        className={`group relative ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
                      >
                        {/* Post Header */}
                        <div className="p-6 pb-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Link to={`/profile/${profileUser.id}`}>
                                <img
                                  src={getAvatarUrl()}
                                  alt={profileUser.full_name || profileUser.username}
                                  className={`w-12 h-12 rounded-xl border-2 ${theme === 'light' ? 'border-white' : 'border-slate-800'} shadow-sm cursor-pointer hover:opacity-90 transition-opacity`}
                                />
                              </Link>
                              <div>
                                <div className="flex items-center gap-2">
                                  <Link 
                                    to={`/profile/${profileUser.id}`}
                                    className="hover:underline"
                                  >
                                    <h3 className={`font-bold ${theme === 'light' ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-500'} text-sm transition-colors`}>
                                      {profileUser.full_name || profileUser.username}
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
                                  <Link 
                                    to={`/profile/${profileUser.id}`}
                                    className="hover:underline"
                                  >
                                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500 hover:text-blue-600' : 'text-gray-400 hover:text-blue-500'} transition-colors`}>
                                      @{profileUser.username}
                                    </p>
                                  </Link>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleMenu(post.id)}
                                className={`p-2 ${theme === 'light' ? 'text-gray-600 hover:text-blue-500 hover:bg-blue-50' : 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20'} rounded-xl transition-all duration-300`}
                              >
                                <MoreHorizontal className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          {/* Post Title */}
                          <Link to={`/post/${post.id}`}>
                            <h2 className={`text-2xl md:text-3xl font-bold ${theme === 'light' ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-500'} mb-3 transition-colors cursor-pointer leading-tight`}>
                              {post.title}
                            </h2>
                          </Link>

                          {/* Post Content */}
                          {expandedPostId === post.id ? (
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
                                  {post.content?.substring(0, 150)}...
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
                          <Link to={`/post/${post.id}`}>
                            <div className="w-full h-72 md:h-80 overflow-hidden">
                              <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                              />
                            </div>
                          </Link>
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
                                <span>{post.read_time || '5 min'}</span>
                              </div>
                              {post.viewscount > 0 && (
                                <div className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  <span>{post.viewscount}</span>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1">
                              {/* Like */}
                              <button
                                onClick={() => toggleLike(post.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                                  isLiked
                                    ? `bg-gradient-to-r ${theme === 'light' ? 'from-red-50 to-pink-50 text-red-600' : 'from-red-900/20 to-pink-900/20 text-red-400'} shadow-sm`
                                    : `${theme === 'light' ? 'text-gray-600 hover:text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-red-400 hover:bg-red-900/20'}`
                                }`}
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

                              {/* Bookmark */}
                              <button
                                onClick={() => toggleBookmark(post.id)}
                                className={`p-2.5 rounded-xl transition-all duration-300 ${
                                  isBookmarked
                                    ? `bg-gradient-to-r ${theme === 'light' ? 'from-yellow-50 to-amber-50 text-yellow-600' : 'from-yellow-900/20 to-amber-900/20 text-yellow-400'} shadow-sm`
                                    : `${theme === 'light' ? 'text-gray-600 hover:text-yellow-500 hover:bg-yellow-50' : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-900/20'}`
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

                        {/* Comments Section */}
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
                                    src={currentUser?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser"}
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
                ) : (
                  <div className={`text-center py-16 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}`}>
                    <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-r ${theme === 'light' ? 'from-blue-500/10 to-purple-500/10' : 'from-blue-900/20 to-purple-900/20'} rounded-full flex items-center justify-center`}>
                      <FileText className="w-10 h-10 text-blue-500" />
                    </div>
                    <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-2`}>
                      No posts yet
                    </h3>
                    <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-6 max-w-md mx-auto`}>
                      {isOwnProfile ? "Share your thoughts and experiences with the community" : "This user hasn't posted anything yet"}
                    </p>
                    {isOwnProfile && (
                      <button 
                        onClick={() => navigate('/create')}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <Zap className="w-4 h-4 inline mr-2" />
                        Write your first post
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {activeTab === "about" && (
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} p-6 shadow-lg`}>
                <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-6`}>
                  About {profileUser.full_name || profileUser.username}
                </h3>
                
                <div className="space-y-6">
                  {profileUser.bio && (
                    <div>
                      <h4 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-3 text-sm uppercase tracking-wider ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        Bio
                      </h4>
                      <p className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} leading-relaxed`}>
                        {profileUser.bio}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-3 text-sm uppercase tracking-wider ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Activity Stats
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className={`text-center p-4 bg-gradient-to-br ${theme === 'light' ? 'from-blue-50 to-purple-50 border-blue-100' : 'from-blue-900/10 to-purple-900/10 border-blue-800/30'} rounded-xl border`}>
                        <div className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {stats.posts}
                        </div>
                        <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mt-1`}>
                          Posts
                        </div>
                      </div>
                      <div className={`text-center p-4 bg-gradient-to-br ${theme === 'light' ? 'from-green-50 to-emerald-50 border-green-100' : 'from-green-900/10 to-emerald-900/10 border-green-800/30'} rounded-xl border`}>
                        <div className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {stats.followers}
                        </div>
                        <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mt-1`}>
                          Followers
                        </div>
                      </div>
                      <div className={`text-center p-4 bg-gradient-to-br ${theme === 'light' ? 'from-orange-50 to-red-50 border-orange-100' : 'from-orange-900/10 to-red-900/10 border-orange-800/30'} rounded-xl border`}>
                        <div className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {stats.following}
                        </div>
                        <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mt-1`}>
                          Following
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "followers" && (
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} p-6 shadow-lg`}>
                <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-6`}>
                  Followers ({stats.followers})
                </h3>
                {followers.length > 0 ? (
                  <div className="space-y-4">
                    {followers.map((follower) => (
                      <div key={follower.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-colors">
                        <div className="flex items-center gap-3">
                          <img
                            src={follower.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${follower.username}`}
                            alt={follower.full_name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <h4 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              {follower.full_name}
                            </h4>
                            <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                              @{follower.username}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => console.log('Follow', follower.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Follow
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      No followers yet
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "following" && (
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} p-6 shadow-lg`}>
                <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-6`}>
                  Following ({stats.following})
                </h3>
                {following.length > 0 ? (
                  <div className="space-y-4">
                    {following.map((followingUser) => (
                      <div key={followingUser.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-colors">
                        <div className="flex items-center gap-3">
                          <img
                            src={followingUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${followingUser.username}`}
                            alt={followingUser.full_name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <h4 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              {followingUser.full_name}
                            </h4>
                            <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                              @{followingUser.username}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => console.log('Unfollow', followingUser.id)}
                          className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                        >
                          Following
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      Not following anyone yet
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentProfile={profileUser}
          onProfileUpdate={(updatedProfile) => {
            setProfileUser(updatedProfile);
            fetchUserProfile(); // Refresh data
          }}
        />
      </div>
    </>
  );
}
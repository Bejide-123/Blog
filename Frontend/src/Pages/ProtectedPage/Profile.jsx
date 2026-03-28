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
  Send,
} from "lucide-react";
import NavbarPrivate from "../../Components/Private/Navbarprivate";
import EditProfileModal from "./EditProfile";
import { PageLoader } from "../../Components/Private/Loader";
import { UserContext } from "../../Context/userContext";
import { useTheme } from "../../Context/themeContext";
import ImageModal from "../../Components/Private/ImageModal";
import {
  getUserProfileById,
  getUserPosts,
  getUserStats,
  checkFollowStatus,
  toggleFollowUser,
  getUserFollowers,
  getUserFollowing,
} from "../../Services/user.js";
import {
  getPostComments,
  addComment,
  deleteComment,
  toggleCommentLike,
  getUserCommentLikes,
} from "../../Services/post";

export default function ProfilePage() {
  const { userId } = useParams();
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
  const [imageModalOpen, setImageModalOpen] = useState(false);

  // Post interaction states
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [comments, setComments] = useState({});
  const [likedComments, setLikedComments] = useState(new Set());
  const [activeMenuPost, setActiveMenuPost] = useState(null);
  const [repostedPosts, setRepostedPosts] = useState(new Set());

  const isOwnProfile = currentUser?.id === userId || !userId;

  useEffect(() => {
    if (userId || currentUser?.id) {
      fetchUserProfile();
    }
  }, [userId, currentUser?.id]);

  useEffect(() => {
    if (currentUser?.id) {
      fetchUserCommentLikes();
    }
  }, [currentUser]);

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

      const targetUserId = userId || currentUser?.id;

      if (!targetUserId) {
        navigate("/login");
        return;
      }

      const [profileData, postsData, statsData] = await Promise.all([
        getUserProfileById(targetUserId),
        getUserPosts(targetUserId),
        getUserStats(targetUserId),
      ]);

      if (!profileData) {
        navigate("/404");
        return;
      }

      setProfileUser(profileData);
      setPosts(postsData);
      setStats(statsData);

      if (currentUser && currentUser.id !== targetUserId) {
        try {
          const followStatus = await checkFollowStatus(targetUserId);
          setIsFollowing(followStatus.isFollowing);
        } catch (followError) {
          console.warn("Could not check follow status:", followError);
          setIsFollowing(false);
        }
      } else {
        setIsFollowing(false);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      navigate("/404");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const targetUserId = userId || currentUser.id;
      const { isFollowing: newIsFollowing, action } =
        await toggleFollowUser(targetUserId);
      setIsFollowing(newIsFollowing);

      setStats((prev) => ({
        ...prev,
        followers:
          action === "followed" ? prev.followers + 1 : prev.followers - 1,
      }));

      if (profileUser) {
        setProfileUser((prev) => ({
          ...prev,
          followers_count:
            action === "followed"
              ? prev.followers_count + 1
              : Math.max(prev.followers_count - 1, 0),
        }));
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      alert("Unable to follow/unfollow at this time.");
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

  const fetchUserCommentLikes = async () => {
    try {
      if (!currentUser?.id) return;
      const likedIds = await getUserCommentLikes(currentUser.id);
      setLikedComments(new Set(likedIds));
    } catch (err) {
      console.error("Error fetching user comment likes:", err);
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

  const toggleComments = async (postId) => {
    if (activeCommentPost === postId) {
      setActiveCommentPost(null);
      return;
    }

    setActiveCommentPost(postId);

    try {
      const commentsData = await getPostComments(postId);
      const mapped = (commentsData || []).map((c) => ({
        ...c,
        author: {
          name: c.author?.full_name || c.author?.username || "Anonymous",
          avatar:
            c.author?.avatar_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.author?.username || c.user_id || "anonymous"}`,
        },
        timestamp: formatDate(c.created_at),
        likes: c.likes_count || 0,
        isLiked: likedComments.has(c.id),
      }));

      setComments((prev) => ({
        ...prev,
        [postId]: mapped,
      }));
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments((prev) => ({ ...prev, [postId]: [] }));
    }
  };

  const handleSendComment = async (postId) => {
    if (!currentUser?.id) {
      navigate("/login");
      return;
    }

    const commentText = commentInputs[postId] || "";
    if (!commentText.trim()) return;

    try {
      const comment = await addComment(
        postId,
        currentUser.id,
        commentText.trim(),
      );
      const formatted = {
        ...comment,
        author: {
          name:
            comment.author?.full_name ||
            comment.author?.username ||
            "Anonymous",
          avatar:
            comment.author?.avatar_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.username || comment.user_id || "anonymous"}`,
        },
        timestamp: formatDate(comment.created_at),
        likes: comment.likes_count || 0,
        isLiked: false,
      };

      setComments((prev) => ({
        ...prev,
        [postId]: [formatted, ...(prev[postId] || [])],
      }));

      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));

      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? { ...p, comments_count: (p.comments_count || 0) + 1 }
            : p,
        ),
      );
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!currentUser?.id) return;
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      await deleteComment(commentId, currentUser.id);
      setComments((prev) => ({
        ...prev,
        [postId]: (prev[postId] || []).filter((c) => c.id !== commentId),
      }));

      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? { ...p, comments_count: Math.max(0, (p.comments_count || 0) - 1) }
            : p,
        ),
      );
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment. Please try again.");
    }
  };

  const handleCommentLike = async (postId, commentId) => {
    if (!currentUser?.id) {
      navigate("/login");
      return;
    }

    try {
      const { liked } = await toggleCommentLike(commentId, currentUser.id);

      setLikedComments((prev) => {
        const s = new Set(prev);
        if (liked) s.add(commentId);
        else s.delete(commentId);
        return s;
      });

      setComments((prev) => ({
        ...prev,
        [postId]: (prev[postId] || []).map((c) =>
          c.id === commentId
            ? {
                ...c,
                likes: liked
                  ? (c.likes || 0) + 1
                  : Math.max(0, (c.likes || 0) - 1),
                isLiked: liked,
              }
            : c,
        ),
      }));
    } catch (err) {
      console.error("Error toggling comment like:", err);
    }
  };

  const toggleMenu = (postId) => {
    setActiveMenuPost(activeMenuPost === postId ? null : postId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";

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
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const formatJoinDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const getAvatarUrl = () => {
    if (!profileUser)
      return "https://api.dicebear.com/7.x/avataaars/svg?seed=default";
    return (
      profileUser.avatar_url ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileUser.username || "user"}`
    );
  };

  const tabs = [
    {
      id: "posts",
      label: "Posts",
      count: stats.posts,
      icon: <FileText className="w-4 h-4" />,
    },
    { id: "about", label: "About", icon: <Users className="w-4 h-4" /> },
    {
      id: "followers",
      label: "Followers",
      count: stats.followers,
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "following",
      label: "Following",
      count: stats.following,
      icon: <Users className="w-4 h-4" />,
    },
  ];

  if (loading) {
    return (
      <>
        <NavbarPrivate />
        <div
          className={`min-h-screen ${theme === "light" ? "bg-gray-50" : "bg-slate-900"} pt-16 md:pt-20`}
        >
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div
                className={`h-52 ${theme === "light" ? "bg-gray-200" : "bg-slate-700"} rounded-2xl mb-8`}
              ></div>
              <div
                className={`h-96 ${theme === "light" ? "bg-gray-200" : "bg-slate-700"} rounded-2xl`}
              ></div>
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
        <div
          className={`min-h-screen ${theme === "light" ? "bg-gray-50" : "bg-slate-900"} pt-16 md:pt-20`}
        >
          <div className="max-w-5xl mx-auto px-4 py-8 text-center">
            <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">
              User not found
            </h2>
            <button
              onClick={() => navigate("/home")}
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
      <div
        className={`min-h-screen bg-gradient-to-b ${theme === "light" ? "from-gray-50 via-white to-white" : "from-slate-900 via-slate-900 to-slate-950"} pt-16 md:pt-20`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 md:py-8 pb-24 md:pb-28">
          {/* Profile Header */}
          <div
            className={`relative ${theme === "light" ? "bg-white/95" : "bg-slate-800/95"} backdrop-blur-lg border ${theme === "light" ? "border-gray-200/50" : "border-slate-700/50"} rounded-2xl shadow-lg overflow-hidden mb-6`}
          >
            {/* Cover Photo */}
            <div
              className={`h-32 sm:h-40 md:h-52 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 relative`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Profile Info */}
            <div className="relative px-4 sm:px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 sm:-mt-20 md:-mt-24">
                {/* Avatar Container */}
                <div className="relative">
                  <div
                    className={`relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-2xl border-4 ${theme === "light" ? "border-white" : "border-slate-800"} shadow-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 p-1`}
                  >
                    <img
                      src={getAvatarUrl()}
                      alt={profileUser.full_name || profileUser.username}
                      className="w-full h-full rounded-xl object-cover cursor-pointer"
                      onClick={() => setImageModalOpen(true)} // ← add this
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 sm:mt-0">
                  {isOwnProfile ? (
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg text-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit Profile</span>
                      <span className="sm:hidden">Edit</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleFollowToggle}
                        className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold transition-all text-sm ${
                          isFollowing
                            ? `${theme === "light" ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-slate-700 text-gray-300 hover:bg-slate-600"} border ${theme === "light" ? "border-gray-300" : "border-slate-600"}`
                            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg"
                        }`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                      <button
                        className={`p-2 sm:p-2.5 ${theme === "light" ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-slate-700 text-gray-300 hover:bg-slate-600"} rounded-xl transition-all`}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Profile Details */}
              <div className="mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h1
                      className={`text-xl sm:text-2xl md:text-3xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}
                    >
                      {profileUser.full_name || profileUser.username}
                    </h1>
                    <p
                      className={`${theme === "light" ? "text-gray-500" : "text-gray-400"} text-sm md:text-base mt-0.5`}
                    >
                      @{profileUser.username}
                    </p>
                  </div>
                  <button
                    className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 ${theme === "light" ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-slate-700 text-gray-300 hover:bg-slate-600"} rounded-xl transition-all self-start sm:self-center text-sm`}
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="font-medium">Share</span>
                  </button>
                </div>

                {profileUser.bio && (
                  <p
                    className={`mt-3 sm:mt-4 ${theme === "light" ? "text-gray-700" : "text-gray-300"} text-sm md:text-base leading-relaxed`}
                  >
                    {profileUser.bio}
                  </p>
                )}

                {/* Profile Stats */}
                <div
                  className={`flex flex-wrap items-center gap-4 sm:gap-6 mt-4 sm:mt-5 pt-4 sm:pt-5 border-t ${theme === "light" ? "border-gray-200" : "border-slate-700"}`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                    </div>
                    <div>
                      <span
                        className={`font-bold ${theme === "light" ? "text-gray-900" : "text-white"} text-base sm:text-lg`}
                      >
                        {stats.posts}
                      </span>
                      <span
                        className={`ml-1.5 ${theme === "light" ? "text-gray-600" : "text-gray-400"} text-xs sm:text-sm`}
                      >
                        Posts
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                    </div>
                    <div>
                      <span
                        className={`font-bold ${theme === "light" ? "text-gray-900" : "text-white"} text-base sm:text-lg`}
                      >
                        {stats.followers}
                      </span>
                      <span
                        className={`ml-1.5 ${theme === "light" ? "text-gray-600" : "text-gray-400"} text-xs sm:text-sm`}
                      >
                        Followers
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500" />
                    </div>
                    <div>
                      <span
                        className={`font-bold ${theme === "light" ? "text-gray-900" : "text-white"} text-base sm:text-lg`}
                      >
                        {stats.following}
                      </span>
                      <span
                        className={`ml-1.5 ${theme === "light" ? "text-gray-600" : "text-gray-400"} text-xs sm:text-sm`}
                      >
                        Following
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Meta Info */}
                <div
                  className={`flex flex-wrap items-center gap-2 sm:gap-3 mt-4 text-xs sm:text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
                >
                  {profileUser.location && (
                    <div
                      className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r ${theme === "light" ? "from-blue-50 to-purple-50" : "from-blue-900/20 to-purple-900/20"} rounded-full`}
                    >
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                      <span className="truncate max-w-[150px]">
                        {profileUser.location}
                      </span>
                    </div>
                  )}
                  {profileUser.website_url && (
                    <a
                      href={
                        profileUser.website_url.startsWith("http")
                          ? profileUser.website_url
                          : `https://${profileUser.website_url}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r ${theme === "light" ? "from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100" : "from-blue-900/20 to-purple-900/20 hover:from-blue-900/30 hover:to-purple-900/30"} rounded-full transition-all`}
                    >
                      <Link2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                      <span className="truncate max-w-[150px]">
                        {profileUser.website_url}
                      </span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {profileUser.created_at && (
                    <div
                      className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r ${theme === "light" ? "from-blue-50 to-purple-50" : "from-blue-900/20 to-purple-900/20"} rounded-full`}
                    >
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                      <span>
                        Joined {formatJoinDate(profileUser.created_at)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div
            className={`${theme === "light" ? "bg-white/95" : "bg-slate-800/95"} backdrop-blur-lg border ${theme === "light" ? "border-gray-200/50" : "border-slate-700/50"} rounded-2xl p-2 mb-6 shadow-sm overflow-x-auto`}
          >
            <div className="flex items-center gap-1 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold whitespace-nowrap transition-all text-sm sm:text-base ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : `${theme === "light" ? "text-gray-700 hover:bg-gray-100" : "text-gray-300 hover:bg-slate-700"}`
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`ml-1 ${activeTab === tab.id ? "bg-white/20" : "bg-gray-900/10 dark:bg-white/10"} px-2 py-0.5 rounded-full text-xs`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="space-y-6">
            {activeTab === "posts" && (
              <>
                {posts.length > 0 ? (
                  posts.map((post) => {
                    const isLiked = likedPosts.has(post.id);
                    const isBookmarked = bookmarkedPosts.has(post.id);
                    const isCommentsOpen = activeCommentPost === post.id;

                    return (
                      <article
                        key={post.id}
                        className={`group relative ${theme === "light" ? "bg-white" : "bg-slate-800"} rounded-2xl border ${theme === "light" ? "border-gray-200" : "border-slate-700"} shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden`}
                      >
                        {/* Post Header */}
                        <div
                          className="p-4 sm:p-6 pb-4 cursor-pointer"
                          onClick={(e) => {
                            if (
                              !e.target.closest("button") &&
                              !e.target.closest("a")
                            ) {
                              navigate(`/post/${post.id}`);
                            }
                          }}
                        >
                          <div className="flex items-start justify-between mb-4 gap-3">
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                              <Link
                                to={`/profile/${profileUser.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="relative flex-shrink-0"
                              >
                                <img
                                  src={getAvatarUrl()}
                                  alt={
                                    profileUser.full_name ||
                                    profileUser.username
                                  }
                                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 ${theme === "light" ? "border-white" : "border-slate-800"} shadow-sm`}
                                />
                              </Link>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                  <Link
                                    to={`/profile/${profileUser.id}`}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <h3
                                      className={`font-bold ${theme === "light" ? "text-gray-900" : "text-white"} text-sm sm:text-base truncate`}
                                    >
                                      {profileUser.full_name ||
                                        profileUser.username}
                                    </h3>
                                  </Link>
                                  <span
                                    className={`text-xs ${theme === "light" ? "text-gray-400" : "text-gray-500"} hidden sm:inline`}
                                  >
                                    •
                                  </span>
                                  <span
                                    className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"} whitespace-nowrap`}
                                  >
                                    {formatDate(post.createdat)}
                                  </span>
                                </div>
                                <Link
                                  to={`/profile/${profileUser.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <p
                                    className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"} truncate`}
                                  >
                                    @{profileUser.username}
                                  </p>
                                </Link>
                              </div>
                            </div>

                            <div className="relative flex-shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMenu(post.id);
                                }}
                                className={`p-2 ${theme === "light" ? "text-gray-600 hover:text-blue-500 hover:bg-blue-50" : "text-gray-400 hover:text-blue-400 hover:bg-blue-900/20"} rounded-xl transition-all`}
                              >
                                <MoreHorizontal className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          {/* Post Title */}
                          <h2
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/post/${post.id}`);
                            }}
                            className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold ${theme === "light" ? "text-gray-900 hover:text-blue-600" : "text-white hover:text-blue-500"} mb-3 transition-colors cursor-pointer leading-tight`}
                          >
                            {post.title}
                          </h2>

                          {/* Post Content */}
                          {expandedPostId === post.id ? (
                            <div
                              className={`prose ${theme === "dark" ? "dark:prose-invert" : ""} max-w-none`}
                            >
                              <p
                                className={`${theme === "light" ? "text-gray-700" : "text-gray-300"} text-sm sm:text-base mb-4 leading-relaxed whitespace-pre-line`}
                              >
                                {post.content}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedPostId(null);
                                }}
                                className={`${theme === "light" ? "text-blue-600" : "text-blue-500"} hover:underline font-medium text-sm`}
                              >
                                Show less
                              </button>
                            </div>
                          ) : (
                            <div className="relative">
                              <div className="relative mb-3">
                                <p
                                  className={`${theme === "light" ? "text-gray-700" : "text-gray-300"} text-sm sm:text-base line-clamp-2 leading-relaxed pr-4 whitespace-pre-line`}
                                >
                                  {post.content}
                                </p>
                                {post.content && post.content.length > 150 && (
                                  <div
                                    className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t ${theme === "light" ? "from-white" : "from-slate-800"} to-transparent flex items-end justify-center`}
                                  >
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedPostId(post.id);
                                      }}
                                      className={`relative -bottom-2 px-4 py-1.5 ${theme === "light" ? "bg-white border-gray-200 text-blue-600 hover:text-blue-700 hover:bg-gray-50" : "bg-slate-800 border-slate-700 text-blue-500 hover:text-blue-400 hover:bg-slate-700"} border font-medium text-sm rounded-full shadow-sm transition-colors`}
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
                          <div
                            className="w-full h-48 sm:h-64 md:h-72 lg:h-80 overflow-hidden cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/post/${post.id}`);
                            }}
                          >
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}

                        {/* Post Footer */}
                        <div className="p-4 sm:p-6 pt-4">
                          {/* Tags */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                              {post.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r ${theme === "light" ? "from-blue-50 to-purple-50 text-blue-700" : "from-blue-900/20 to-purple-900/20 text-blue-400"} text-xs sm:text-sm font-medium rounded-full`}
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Stats & Actions */}
                          <div
                            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t ${theme === "light" ? "border-gray-200" : "border-slate-700"}`}
                          >
                            {/* Stats */}
                            <div
                              className={`flex items-center gap-3 sm:gap-6 text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
                            >
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{post.read_time || "5 min"}</span>
                              </div>
                              {post.viewscount > 0 && (
                                <div className="flex items-center gap-1">
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>{post.viewscount}</span>
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleLike(post.id);
                                }}
                                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl transition-all ${
                                  isLiked
                                    ? `bg-gradient-to-r ${theme === "light" ? "from-red-50 to-pink-50 text-red-600" : "from-red-900/20 to-pink-900/20 text-red-400"}`
                                    : `${theme === "light" ? "text-gray-600 hover:text-red-500 hover:bg-red-50" : "text-gray-400 hover:text-red-400 hover:bg-red-900/20"}`
                                }`}
                              >
                                <Heart
                                  className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? "fill-current" : ""}`}
                                />
                                <span className="font-medium text-xs sm:text-sm">
                                  {post.likescount || 0}
                                </span>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleComments(post.id);
                                }}
                                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl transition-all ${
                                  isCommentsOpen
                                    ? `bg-gradient-to-r ${theme === "light" ? "from-blue-50 to-cyan-50 text-blue-600" : "from-blue-900/20 to-cyan-900/20 text-blue-400"}`
                                    : `${theme === "light" ? "text-gray-600 hover:text-blue-500 hover:bg-blue-50" : "text-gray-400 hover:text-blue-400 hover:bg-blue-900/20"}`
                                }`}
                              >
                                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="font-medium text-xs sm:text-sm">
                                  {post.comments_count || 0}
                                </span>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleBookmark(post.id);
                                }}
                                className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl transition-all ${
                                  isBookmarked
                                    ? `bg-gradient-to-r ${theme === "light" ? "from-yellow-50 to-amber-50 text-yellow-600" : "from-yellow-900/20 to-amber-900/20 text-yellow-400"}`
                                    : `${theme === "light" ? "text-gray-600 hover:text-yellow-500 hover:bg-yellow-50" : "text-gray-400 hover:text-yellow-400 hover:bg-yellow-900/20"}`
                                }`}
                              >
                                <Bookmark
                                  className={`w-4 h-4 sm:w-5 sm:h-5 ${isBookmarked ? "fill-current" : ""}`}
                                />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Comments Section */}
                        {isCommentsOpen && (
                          <div
                            className={`border-t ${theme === "light" ? "border-gray-200 bg-gray-50/50" : "border-slate-700 bg-slate-900/30"}`}
                          >
                            <div className="p-3 sm:p-6 space-y-4 max-h-96 overflow-y-auto">
                              {/* Comments List */}
                              {comments[post.id]?.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                  <img
                                    src={comment.author.avatar}
                                    alt={comment.author.name}
                                    className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full border-2 ${theme === "light" ? "border-white" : "border-slate-800"} flex-shrink-0`}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div
                                      className={`${theme === "light" ? "bg-white" : "bg-slate-800"} rounded-xl p-3 sm:p-4`}
                                    >
                                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
                                          <span
                                            className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"} text-sm truncate`}
                                          >
                                            {comment.author.name}
                                          </span>
                                          <span
                                            className={`text-xs ${theme === "light" ? "text-gray-400" : "text-gray-500"} sm:hidden`}
                                          >
                                            •
                                          </span>
                                          <span
                                            className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"} sm:hidden`}
                                          >
                                            {comment.timestamp}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span
                                            className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"} hidden sm:block`}
                                          >
                                            {comment.timestamp}
                                          </span>
                                          <button
                                            onClick={() =>
                                              handleCommentLike(
                                                post.id,
                                                comment.id,
                                              )
                                            }
                                            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                                              comment.isLiked
                                                ? `${theme === "light" ? "text-red-600 bg-red-50" : "text-red-400 bg-red-900/20"}`
                                                : `${theme === "light" ? "text-gray-500 hover:text-red-500 hover:bg-gray-100" : "text-gray-400 hover:text-red-400 hover:bg-slate-700"}`
                                            }`}
                                          >
                                            <Heart
                                              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${comment.isLiked ? "fill-current" : ""}`}
                                            />
                                            <span className="text-xs font-medium">
                                              {comment.likes}
                                            </span>
                                          </button>
                                        </div>
                                      </div>
                                      <p
                                        className={`${theme === "light" ? "text-gray-700" : "text-gray-300"} text-sm leading-relaxed break-words`}
                                      >
                                        {comment.content}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              {/* Comment Input */}
                              <div className="flex items-end gap-3 sticky bottom-0 bg-gradient-to-t ${theme === 'light' ? 'from-gray-50' : 'from-slate-900/50'} pt-3">
                                <img
                                  src={
                                    currentUser?.avatar_url ||
                                    "https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser"
                                  }
                                  alt="You"
                                  className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full border-2 ${theme === "light" ? "border-gray-200" : "border-slate-700"} flex-shrink-0`}
                                />
                                <div className="flex-1">
                                  <textarea
                                    value={commentInputs[post.id] || ""}
                                    onChange={(e) =>
                                      setCommentInputs((prev) => ({
                                        ...prev,
                                        [post.id]: e.target.value,
                                      }))
                                    }
                                    placeholder="Add a comment..."
                                    className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 ${theme === "light" ? "bg-white text-gray-900 placeholder:text-gray-400" : "bg-slate-700 text-white placeholder:text-slate-500"} rounded-xl resize-none focus:outline-none focus:ring-2 ${theme === "light" ? "focus:ring-blue-500" : "focus:ring-blue-400"} text-sm`}
                                    rows="2"
                                  />
                                  <div className="flex justify-end mt-2">
                                    <button
                                      onClick={() => handleSendComment(post.id)}
                                      disabled={
                                        !(commentInputs[post.id] || "").trim()
                                      }
                                      className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-xl font-medium transition-all text-sm ${
                                        (commentInputs[post.id] || "").trim()
                                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                                          : `${theme === "light" ? "bg-gray-200 text-gray-400" : "bg-slate-700 text-slate-500"} cursor-not-allowed`
                                      }`}
                                    >
                                      Post
                                    </button>
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
                  <div
                    className={`text-center py-12 sm:py-16 ${theme === "light" ? "bg-white" : "bg-slate-800"} rounded-2xl border ${theme === "light" ? "border-gray-200" : "border-slate-700"}`}
                  >
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-r ${theme === "light" ? "from-blue-500/10 to-purple-500/10" : "from-blue-900/20 to-purple-900/20"} rounded-full flex items-center justify-center`}
                    >
                      <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                    </div>
                    <h3
                      className={`text-lg sm:text-xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"} mb-2`}
                    >
                      No posts yet
                    </h3>
                    <p
                      className={`${theme === "light" ? "text-gray-600" : "text-gray-400"} mb-6 max-w-md mx-auto text-sm sm:text-base px-4`}
                    >
                      {isOwnProfile
                        ? "Share your thoughts and experiences with the community"
                        : "This user hasn't posted anything yet"}
                    </p>
                    {isOwnProfile && (
                      <button
                        onClick={() => navigate("/create")}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg text-sm sm:text-base"
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
              <div
                className={`${theme === "light" ? "bg-white" : "bg-slate-800"} rounded-2xl border ${theme === "light" ? "border-gray-200" : "border-slate-700"} p-4 sm:p-6 shadow-lg`}
              >
                <h3
                  className={`text-lg sm:text-xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"} mb-6`}
                >
                  About {profileUser.full_name || profileUser.username}
                </h3>

                <div className="space-y-6">
                  {profileUser.bio && (
                    <div>
                      <h4
                        className={`font-semibold mb-3 text-xs sm:text-sm uppercase tracking-wider ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}
                      >
                        Bio
                      </h4>
                      <p
                        className={`${theme === "light" ? "text-gray-700" : "text-gray-300"} leading-relaxed text-sm sm:text-base`}
                      >
                        {profileUser.bio}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4
                      className={`font-semibold mb-3 text-xs sm:text-sm uppercase tracking-wider ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Activity Stats
                    </h4>
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                      <div
                        className={`text-center p-3 sm:p-4 bg-gradient-to-br ${theme === "light" ? "from-blue-50 to-purple-50 border-blue-100" : "from-blue-900/10 to-purple-900/10 border-blue-800/30"} rounded-xl border`}
                      >
                        <div
                          className={`text-xl sm:text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}
                        >
                          {stats.posts}
                        </div>
                        <div
                          className={`text-xs sm:text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"} mt-1`}
                        >
                          Posts
                        </div>
                      </div>
                      <div
                        className={`text-center p-3 sm:p-4 bg-gradient-to-br ${theme === "light" ? "from-green-50 to-emerald-50 border-green-100" : "from-green-900/10 to-emerald-900/10 border-green-800/30"} rounded-xl border`}
                      >
                        <div
                          className={`text-xl sm:text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}
                        >
                          {stats.followers}
                        </div>
                        <div
                          className={`text-xs sm:text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"} mt-1`}
                        >
                          Followers
                        </div>
                      </div>
                      <div
                        className={`text-center p-3 sm:p-4 bg-gradient-to-br ${theme === "light" ? "from-orange-50 to-red-50 border-orange-100" : "from-orange-900/10 to-red-900/10 border-orange-800/30"} rounded-xl border`}
                      >
                        <div
                          className={`text-xl sm:text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}
                        >
                          {stats.following}
                        </div>
                        <div
                          className={`text-xs sm:text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"} mt-1`}
                        >
                          Following
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "followers" && (
              <div
                className={`${theme === "light" ? "bg-white" : "bg-slate-800"} rounded-2xl border ${theme === "light" ? "border-gray-200" : "border-slate-700"} p-4 sm:p-6 shadow-lg`}
              >
                <h3
                  className={`text-lg sm:text-xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"} mb-6`}
                >
                  Followers ({stats.followers})
                </h3>
                {followers.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {followers.map((follower) => (
                      <div
                        key={follower.id}
                        className={`flex items-center justify-between p-3 sm:p-4 ${theme === "light" ? "hover:bg-gray-50" : "hover:bg-slate-700"} rounded-xl transition-colors`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <img
                            src={
                              follower.avatar_url ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${follower.username}`
                            }
                            alt={follower.full_name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h4
                              className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"} text-sm sm:text-base truncate`}
                            >
                              {follower.full_name}
                            </h4>
                            <p
                              className={`text-xs sm:text-sm ${theme === "light" ? "text-gray-500" : "text-gray-400"} truncate`}
                            >
                              @{follower.username}
                            </p>
                          </div>
                        </div>
                        <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium flex-shrink-0">
                          Follow
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p
                      className={`${theme === "light" ? "text-gray-600" : "text-gray-400"} text-sm sm:text-base`}
                    >
                      No followers yet
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "following" && (
              <div
                className={`${theme === "light" ? "bg-white" : "bg-slate-800"} rounded-2xl border ${theme === "light" ? "border-gray-200" : "border-slate-700"} p-4 sm:p-6 shadow-lg`}
              >
                <h3
                  className={`text-lg sm:text-xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"} mb-6`}
                >
                  Following ({stats.following})
                </h3>
                {following.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {following.map((followingUser) => (
                      <div
                        key={followingUser.id}
                        className={`flex items-center justify-between p-3 sm:p-4 ${theme === "light" ? "hover:bg-gray-50" : "hover:bg-slate-700"} rounded-xl transition-colors`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <img
                            src={
                              followingUser.avatar_url ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${followingUser.username}`
                            }
                            alt={followingUser.full_name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h4
                              className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"} text-sm sm:text-base truncate`}
                            >
                              {followingUser.full_name}
                            </h4>
                            <p
                              className={`text-xs sm:text-sm ${theme === "light" ? "text-gray-500" : "text-gray-400"} truncate`}
                            >
                              @{followingUser.username}
                            </p>
                          </div>
                        </div>
                        <button
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 ${theme === "light" ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-slate-700 text-gray-300 hover:bg-slate-600"} rounded-lg transition-colors text-xs sm:text-sm font-medium flex-shrink-0`}
                        >
                          Following
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p
                      className={`${theme === "light" ? "text-gray-600" : "text-gray-400"} text-sm sm:text-base`}
                    >
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
            fetchUserProfile();
          }}
        />

        <ImageModal
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          src={getAvatarUrl()}
          alt={profileUser.full_name || profileUser.username}
          name={profileUser.full_name}
          username={profileUser.username}
        />
      </div>
    </>
  );
}

import React, { useState, useEffect, useContext } from "react";
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

const ProfilePage = () => {
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
  const isDark = theme !== "light";

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
      if (!targetUserId) { navigate("/login"); return; }

      const [profileData, postsData, statsData] = await Promise.all([
        getUserProfileById(targetUserId),
        getUserPosts(targetUserId),
        getUserStats(targetUserId),
      ]);

      if (!profileData) { navigate("/404"); return; }

      setProfileUser(profileData);
      setPosts(postsData);
      setStats(statsData);

      if (currentUser && currentUser.id !== targetUserId) {
        try {
          const followStatus = await checkFollowStatus(targetUserId);
          setIsFollowing(followStatus.isFollowing);
        } catch {
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
    if (!currentUser) { navigate("/login"); return; }
    try {
      const targetUserId = userId || currentUser.id;
      const { isFollowing: newIsFollowing, action } = await toggleFollowUser(targetUserId);
      setIsFollowing(newIsFollowing);
      setStats((prev) => ({
        ...prev,
        followers: action === "followed" ? prev.followers + 1 : prev.followers - 1,
      }));
      if (profileUser) {
        setProfileUser((prev) => ({
          ...prev,
          followers_count: action === "followed" ? prev.followers_count + 1 : Math.max(prev.followers_count - 1, 0),
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
      newSet.has(postId) ? newSet.delete(postId) : newSet.add(postId);
      return newSet;
    });
  };

  const toggleBookmark = (postId) => {
    setBookmarkedPosts((prev) => {
      const newSet = new Set(prev);
      newSet.has(postId) ? newSet.delete(postId) : newSet.add(postId);
      return newSet;
    });
  };

  const toggleComments = async (postId) => {
    if (activeCommentPost === postId) { setActiveCommentPost(null); return; }
    setActiveCommentPost(postId);
    try {
      const commentsData = await getPostComments(postId);
      const mapped = (commentsData || []).map((c) => ({
        ...c,
        author: {
          name: c.author?.full_name || c.author?.username || "Anonymous",
          avatar: c.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.author?.username || c.user_id || "anonymous"}`,
        },
        timestamp: formatDate(c.created_at),
        likes: c.likes_count || 0,
        isLiked: likedComments.has(c.id),
      }));
      setComments((prev) => ({ ...prev, [postId]: mapped }));
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments((prev) => ({ ...prev, [postId]: [] }));
    }
  };

  const handleSendComment = async (postId) => {
    if (!currentUser?.id) { navigate("/login"); return; }
    const commentText = commentInputs[postId] || "";
    if (!commentText.trim()) return;
    try {
      const comment = await addComment(postId, currentUser.id, commentText.trim());
      const formatted = {
        ...comment,
        author: {
          name: comment.author?.full_name || comment.author?.username || "Anonymous",
          avatar: comment.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.username || comment.user_id || "anonymous"}`,
        },
        timestamp: formatDate(comment.created_at),
        likes: comment.likes_count || 0,
        isLiked: false,
      };
      setComments((prev) => ({ ...prev, [postId]: [formatted, ...(prev[postId] || [])] }));
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      setPosts((prevPosts) => prevPosts.map((p) => p.id === postId ? { ...p, comments_count: (p.comments_count || 0) + 1 } : p));
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!currentUser?.id) return;
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await deleteComment(commentId, currentUser.id);
      setComments((prev) => ({ ...prev, [postId]: (prev[postId] || []).filter((c) => c.id !== commentId) }));
      setPosts((prevPosts) => prevPosts.map((p) => p.id === postId ? { ...p, comments_count: Math.max(0, (p.comments_count || 0) - 1) } : p));
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment. Please try again.");
    }
  };

  const handleCommentLike = async (postId, commentId) => {
    if (!currentUser?.id) { navigate("/login"); return; }
    try {
      const { liked } = await toggleCommentLike(commentId, currentUser.id);
      setLikedComments((prev) => {
        const s = new Set(prev);
        liked ? s.add(commentId) : s.delete(commentId);
        return s;
      });
      setComments((prev) => ({
        ...prev,
        [postId]: (prev[postId] || []).map((c) =>
          c.id === commentId ? { ...c, likes: liked ? (c.likes || 0) + 1 : Math.max(0, (c.likes || 0) - 1), isLiked: liked } : c
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
    if (diffInHours < 1) return `${Math.floor(diffInHours * 60)}m ago`;
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatJoinDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const getAvatarUrl = () => {
    if (!profileUser) return "https://api.dicebear.com/7.x/avataaars/svg?seed=default";
    return profileUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileUser.username || "user"}`;
  };

  const backdropUrl = profileUser?.avatar_url

  const tabs = [
    { id: "posts", label: "Posts", count: stats.posts, icon: <FileText className="w-4 h-4" /> },
    { id: "about", label: "About", icon: <Users className="w-4 h-4" /> },
    { id: "followers", label: "Followers", count: stats.followers, icon: <Users className="w-4 h-4" /> },
    { id: "following", label: "Following", count: stats.following, icon: <Users className="w-4 h-4" /> },
  ];

  // ─── Loading state ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <NavbarPrivate />
        <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-gray-50"}`}>
          <div className={`h-72 w-full animate-pulse ${isDark ? "bg-slate-800" : "bg-gray-200"}`} />
          <div className="max-w-4xl mx-auto px-4 -mt-16">
            <div className={`h-80 rounded-2xl animate-pulse ${isDark ? "bg-slate-800" : "bg-gray-200"}`} />
          </div>
        </div>
      </>
    );
  }

  if (!profileUser) {
    return (
      <>
        <NavbarPrivate />
        <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-gray-50"} flex items-center justify-center`}>
          <div className="text-center">
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>User not found</h2>
            <button onClick={() => navigate("/home")} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg">
              Go Home
            </button>
          </div>
        </div>
      </>
    );
  }

  // ─── Main render ─────────────────────────────────────────────────────────────
  return (
    <>
      <NavbarPrivate />

      <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-gray-50"}`}>

        {/* ── HERO: full-bleed backdrop ── */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
          {/* Blurred backdrop image */}
          {backdropUrl ? (
            <img
              src={backdropUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover scale-110"
              style={{ filter: "blur(-1px)", transform: "scale(1)" }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800" />
          )}

          {/* Gradient overlay: fades from transparent at top to page bg at bottom */}
          <div
            className="absolute inset-0"
            style={{
              background: isDark
                ? "linear-gradient(to bottom, rgba(2,6,23,0.35) 0%, rgba(2,6,23,0.65) 55%, rgba(2,6,23,1) 100%)"
                : "linear-gradient(to bottom, rgba(249,250,251,0.15) 0%, rgba(249,250,251,0.55) 55%, rgba(249,250,251,1) 100%)",
            }}
          />
        </div>

        {/* ── PROFILE IDENTITY BLOCK — overlaps the hero ── */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative -mt-28 sm:-mt-32 md:-mt-36">

            {/* Avatar + name row */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 mb-6">

              {/* Avatar */}
              <div
                className="relative flex-shrink-0 cursor-pointer group"
                onClick={() => setImageModalOpen(true)}
              >
                <div
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-2xl ring-4"
                  style={{
                    ringColor: isDark ? "rgba(30,41,59,1)" : "white",
                    boxShadow: isDark
                      ? "0 0 0 4px #1e293b, 0 20px 60px rgba(0,0,0,0.6)"
                      : "0 0 0 4px white, 0 20px 60px rgba(0,0,0,0.2)",
                  }}
                >
                  <img
                    src={getAvatarUrl()}
                    alt={profileUser.full_name || profileUser.username}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {/* Online-ish indicator dot */}
                <span className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white shadow-sm" />
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                      {profileUser.full_name || profileUser.username}
                    </h1>
                    <p className={`text-sm mt-0.5 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                      @{profileUser.username}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    {isOwnProfile ? (
                      <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit profile
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleFollowToggle}
                          className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all ${
                            isFollowing
                              ? isDark
                                ? "bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600"
                                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm"
                              : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-blue-500/20"
                          }`}
                        >
                          {isFollowing ? "Following" : "Follow"}
                        </button>
                        <button
                          className={`p-2 rounded-xl transition-all ${isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm"}`}
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <button
                      className={`p-2 rounded-xl transition-all ${isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm"}`}
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── PROFILE CARD ── */}
            <div
              className={`rounded-2xl border p-5 sm:p-6 mb-5 ${
                isDark
                  ? "bg-slate-900/80 border-slate-800 backdrop-blur-sm"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              {/* Bio */}
              {profileUser.bio && (
                <p className={`text-sm sm:text-base leading-relaxed mb-5 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                  {profileUser.bio}
                </p>
              )}

              {/* Meta tags: location, website, joined */}
              <div className="flex flex-wrap gap-2 mb-5">
                {profileUser.location && (
                  <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full ${isDark ? "bg-slate-800 text-slate-300" : "bg-gray-100 text-gray-600"}`}>
                    <MapPin className="w-3 h-3 text-blue-500" />
                    {profileUser.location}
                  </span>
                )}
                {profileUser.website_url && (
                  <a
                    href={profileUser.website_url.startsWith("http") ? profileUser.website_url : `https://${profileUser.website_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors ${isDark ? "bg-slate-800 text-blue-400 hover:bg-slate-700" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
                  >
                    <Link2 className="w-3 h-3" />
                    {profileUser.website_url.replace(/^https?:\/\//, "")}
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>
                )}
                {profileUser.created_at && (
                  <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full ${isDark ? "bg-slate-800 text-slate-400" : "bg-gray-100 text-gray-500"}`}>
                    <Calendar className="w-3 h-3" />
                    Joined {formatJoinDate(profileUser.created_at)}
                  </span>
                )}
              </div>

              {/* Stats row */}
              <div className={`flex items-center gap-0 rounded-xl overflow-hidden border ${isDark ? "border-slate-800" : "border-gray-100"}`}>
                {[
                  { label: "Posts", value: stats.posts, color: "blue" },
                  { label: "Followers", value: stats.followers, color: "purple" },
                  { label: "Following", value: stats.following, color: "indigo" },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`flex-1 text-center py-3 px-2 ${
                      isDark
                        ? i < 2 ? "border-r border-slate-800" : ""
                        : i < 2 ? "border-r border-gray-100" : ""
                    } ${isDark ? "bg-slate-800/50" : "bg-gray-50"}`}
                  >
                    <div className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {stat.value.toLocaleString()}
                    </div>
                    <div className={`text-xs mt-0.5 ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── TABS ── */}
            <div
              className={`flex items-center gap-1 p-1 rounded-xl mb-6 ${isDark ? "bg-slate-900/80 border border-slate-800" : "bg-white border border-gray-200 shadow-sm"}`}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                      : isDark
                        ? "text-slate-400 hover:text-white hover:bg-slate-800"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden text-xs">{tab.label.slice(0, 4)}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        activeTab === tab.id
                          ? "bg-white/20 text-white"
                          : isDark ? "bg-slate-700 text-slate-300" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ── TAB CONTENT ── */}
            <div className="pb-28 space-y-4">

              {/* POSTS TAB */}
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
                          className={`group rounded-2xl border overflow-hidden transition-all duration-200 ${
                            isDark
                              ? "bg-slate-900 border-slate-800 hover:border-slate-700"
                              : "bg-white border-gray-200 shadow-sm hover:shadow-md"
                          }`}
                        >
                          {/* Post header */}
                          <div
                            className="p-5 sm:p-6 cursor-pointer"
                            onClick={(e) => {
                              if (!e.target.closest("button") && !e.target.closest("a")) {
                                navigate(`/post/${post.id}`);
                              }
                            }}
                          >
                            <div className="flex items-start justify-between mb-4 gap-3">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <Link to={`/profile/${profileUser.id}`} onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                                  <img
                                    src={getAvatarUrl()}
                                    alt={profileUser.full_name || profileUser.username}
                                    loading="lazy"
                                    className={`w-10 h-10 rounded-xl border-2 ${isDark ? "border-slate-800" : "border-white"} shadow-sm`}
                                  />
                                </Link>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Link to={`/profile/${profileUser.id}`} onClick={(e) => e.stopPropagation()}>
                                      <span className={`font-semibold text-sm ${isDark ? "text-white hover:text-blue-400" : "text-gray-900 hover:text-blue-600"} transition-colors`}>
                                        {profileUser.full_name || profileUser.username}
                                      </span>
                                    </Link>
                                    <span className={`text-xs ${isDark ? "text-slate-500" : "text-gray-400"}`}>·</span>
                                    <span className={`text-xs ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                                      {formatDate(post.createdat)}
                                    </span>
                                  </div>
                                  <p className={`text-xs ${isDark ? "text-slate-500" : "text-gray-400"}`}>@{profileUser.username}</p>
                                </div>
                              </div>

                              <button
                                onClick={(e) => { e.stopPropagation(); toggleMenu(post.id); }}
                                className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-slate-500 hover:text-slate-300 hover:bg-slate-800" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Title */}
                            <h2
                              onClick={(e) => { e.stopPropagation(); navigate(`/post/${post.id}`); }}
                              className={`text-lg sm:text-xl font-bold mb-2.5 leading-snug cursor-pointer transition-colors ${isDark ? "text-white hover:text-blue-400" : "text-gray-900 hover:text-blue-600"}`}
                            >
                              {post.title}
                            </h2>

                            {/* Content preview */}
                            {expandedPostId === post.id ? (
                              <div>
                                <p className={`text-sm leading-relaxed whitespace-pre-line mb-3 ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                                  {post.content}
                                </p>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setExpandedPostId(null); }}
                                  className={`text-sm font-medium ${isDark ? "text-blue-400" : "text-blue-600"} hover:underline`}
                                >
                                  Show less
                                </button>
                              </div>
                            ) : (
                              <div className="relative">
                                <p className={`text-sm leading-relaxed line-clamp-3 whitespace-pre-line ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                                  {post.content}
                                </p>
                                {post.content && post.content.length > 150 && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setExpandedPostId(post.id); }}
                                    className={`mt-2 text-sm font-medium ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"} transition-colors`}
                                  >
                                    Read more
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Featured image */}
                          {post.featured_image && (
                            <div
                              className="w-full h-48 sm:h-64 overflow-hidden cursor-pointer mx-0"
                              onClick={() => navigate(`/post/${post.id}`)}
                            >
                              <img
                                src={post.featured_image}
                                alt={post.title}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                              />
                            </div>
                          )}

                          {/* Post footer */}
                          <div className="px-5 sm:px-6 py-4">
                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {post.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${isDark ? "bg-blue-950/60 text-blue-400 border border-blue-900" : "bg-blue-50 text-blue-600"}`}
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Actions */}
                            <div className={`flex items-center justify-between pt-3 border-t ${isDark ? "border-slate-800" : "border-gray-100"}`}>
                              <div className={`flex items-center gap-1 text-xs ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                                <Clock className="w-3.5 h-3.5" />
                                <span className="mr-3">{post.read_time || "5 min read"}</span>
                                {post.viewscount > 0 && (
                                  <>
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>{post.viewscount}</span>
                                  </>
                                )}
                              </div>

                              <div className="flex items-center gap-0.5">
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}
                                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all text-sm font-medium ${
                                    isLiked
                                      ? isDark ? "text-red-400 bg-red-950/40" : "text-red-600 bg-red-50"
                                      : isDark ? "text-slate-400 hover:text-red-400 hover:bg-red-950/20" : "text-gray-500 hover:text-red-500 hover:bg-red-50"
                                  }`}
                                >
                                  <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                                  <span>{post.likescount || 0}</span>
                                </button>

                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleComments(post.id); }}
                                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all text-sm font-medium ${
                                    isCommentsOpen
                                      ? isDark ? "text-blue-400 bg-blue-950/40" : "text-blue-600 bg-blue-50"
                                      : isDark ? "text-slate-400 hover:text-blue-400 hover:bg-blue-950/20" : "text-gray-500 hover:text-blue-500 hover:bg-blue-50"
                                  }`}
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  <span>{post.comments_count || 0}</span>
                                </button>

                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleBookmark(post.id); }}
                                  className={`p-2 rounded-xl transition-all ${
                                    isBookmarked
                                      ? isDark ? "text-amber-400 bg-amber-950/40" : "text-amber-500 bg-amber-50"
                                      : isDark ? "text-slate-400 hover:text-amber-400 hover:bg-amber-950/20" : "text-gray-500 hover:text-amber-500 hover:bg-amber-50"
                                  }`}
                                >
                                  <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Comments section */}
                          {isCommentsOpen && (
                            <div className={`border-t ${isDark ? "border-slate-800 bg-slate-950/50" : "border-gray-100 bg-gray-50/60"}`}>
                              <div className="p-4 sm:p-5 space-y-4 max-h-96 overflow-y-auto">
                                {comments[post.id]?.map((comment) => (
                                  <div key={comment.id} className="flex gap-3">
                                    <img
                                      src={comment.author.avatar}
                                      alt={comment.author.name}
                                      loading="lazy"
                                      className={`w-8 h-8 rounded-full border-2 flex-shrink-0 ${isDark ? "border-slate-800" : "border-white"}`}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className={`rounded-xl p-3 ${isDark ? "bg-slate-800" : "bg-white border border-gray-200"}`}>
                                        <div className="flex items-center justify-between mb-1.5 gap-2">
                                          <div className="flex items-center gap-2 min-w-0">
                                            <span className={`font-semibold text-xs truncate ${isDark ? "text-white" : "text-gray-900"}`}>{comment.author.name}</span>
                                            <span className={`text-xs ${isDark ? "text-slate-500" : "text-gray-400"}`}>{comment.timestamp}</span>
                                          </div>
                                          <button
                                            onClick={() => handleCommentLike(post.id, comment.id)}
                                            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg transition-colors text-xs flex-shrink-0 ${
                                              comment.isLiked
                                                ? isDark ? "text-red-400 bg-red-950/30" : "text-red-500 bg-red-50"
                                                : isDark ? "text-slate-500 hover:text-red-400" : "text-gray-400 hover:text-red-400"
                                            }`}
                                          >
                                            <Heart className={`w-3 h-3 ${comment.isLiked ? "fill-current" : ""}`} />
                                            <span>{comment.likes}</span>
                                          </button>
                                        </div>
                                        <p className={`text-sm leading-relaxed break-words ${isDark ? "text-slate-300" : "text-gray-700"}`}>
                                          {comment.content}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {/* Comment input */}
                                <div className="flex gap-3 items-end pt-1">
                                  <img
                                    src={currentUser?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser"}
                                    alt="You"
                                    loading="lazy"
                                    className={`w-8 h-8 rounded-full border-2 flex-shrink-0 ${isDark ? "border-slate-700" : "border-gray-200"}`}
                                  />
                                  <div className="flex-1">
                                    <textarea
                                      value={commentInputs[post.id] || ""}
                                      onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                                      placeholder="Add a comment..."
                                      rows={2}
                                      className={`w-full px-3 py-2.5 text-sm rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                                        isDark
                                          ? "bg-slate-800 text-white placeholder:text-slate-500 border border-slate-700"
                                          : "bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200"
                                      }`}
                                    />
                                    <div className="flex justify-end mt-2">
                                      <button
                                        onClick={() => handleSendComment(post.id)}
                                        disabled={!(commentInputs[post.id] || "").trim()}
                                        className={`px-4 py-1.5 rounded-xl font-medium text-sm transition-all ${
                                          (commentInputs[post.id] || "").trim()
                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
                                            : isDark ? "bg-slate-800 text-slate-600 cursor-not-allowed" : "bg-gray-100 text-gray-400 cursor-not-allowed"
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
                    <div className={`text-center py-16 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"}`}>
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${isDark ? "bg-slate-800" : "bg-gray-100"}`}>
                        <FileText className={`w-8 h-8 ${isDark ? "text-slate-500" : "text-gray-400"}`} />
                      </div>
                      <h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>No posts yet</h3>
                      <p className={`text-sm mb-6 max-w-xs mx-auto ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                        {isOwnProfile ? "Share your thoughts with the community" : "This user hasn't posted anything yet"}
                      </p>
                      {isOwnProfile && (
                        <button
                          onClick={() => navigate("/create")}
                          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg text-sm"
                        >
                          <Zap className="w-4 h-4 inline mr-2" />
                          Write your first post
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* ABOUT TAB */}
              {activeTab === "about" && (
                <div className={`rounded-2xl border p-5 sm:p-6 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200 shadow-sm"}`}>
                  <h3 className={`text-lg font-bold mb-5 ${isDark ? "text-white" : "text-gray-900"}`}>
                    About {profileUser.full_name || profileUser.username}
                  </h3>
                  <div className="space-y-5">
                    {profileUser.bio && (
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${isDark ? "text-slate-500" : "text-gray-400"}`}>Bio</p>
                        <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}>{profileUser.bio}</p>
                      </div>
                    )}
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-widest mb-3 ${isDark ? "text-slate-500" : "text-gray-400"}`}>Activity</p>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Posts", value: stats.posts, from: "from-blue-600", to: "to-indigo-600" },
                          { label: "Followers", value: stats.followers, from: "from-purple-600", to: "to-pink-600" },
                          { label: "Following", value: stats.following, from: "from-indigo-600", to: "to-blue-600" },
                        ].map((s) => (
                          <div key={s.label} className={`rounded-xl p-4 text-center border ${isDark ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-100"}`}>
                            <div className={`text-2xl font-bold bg-gradient-to-r ${s.from} ${s.to} bg-clip-text text-transparent`}>{s.value.toLocaleString()}</div>
                            <div className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FOLLOWERS TAB */}
              {activeTab === "followers" && (
                <div className={`rounded-2xl border p-5 sm:p-6 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200 shadow-sm"}`}>
                  <h3 className={`text-lg font-bold mb-5 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Followers <span className={`text-base font-normal ${isDark ? "text-slate-500" : "text-gray-400"}`}>({stats.followers})</span>
                  </h3>
                  {followers.length > 0 ? (
                    <div className="space-y-2">
                      {followers.map((follower) => (
                        <div
                          key={follower.id}
                          className={`flex items-center justify-between p-3 rounded-xl transition-colors ${isDark ? "hover:bg-slate-800" : "hover:bg-gray-50"}`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <img
                              src={follower.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${follower.username}`}
                              alt={follower.full_name}
                              loading="lazy"
                              className="w-10 h-10 rounded-full flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className={`font-semibold text-sm truncate ${isDark ? "text-white" : "text-gray-900"}`}>{follower.full_name}</p>
                              <p className={`text-xs truncate ${isDark ? "text-slate-400" : "text-gray-500"}`}>@{follower.username}</p>
                            </div>
                          </div>
                          <button className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity flex-shrink-0">
                            Follow
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-center py-8 text-sm ${isDark ? "text-slate-500" : "text-gray-400"}`}>No followers yet</p>
                  )}
                </div>
              )}

              {/* FOLLOWING TAB */}
              {activeTab === "following" && (
                <div className={`rounded-2xl border p-5 sm:p-6 ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200 shadow-sm"}`}>
                  <h3 className={`text-lg font-bold mb-5 ${isDark ? "text-white" : "text-gray-900"}`}>
                    Following <span className={`text-base font-normal ${isDark ? "text-slate-500" : "text-gray-400"}`}>({stats.following})</span>
                  </h3>
                  {following.length > 0 ? (
                    <div className="space-y-2">
                      {following.map((followingUser) => (
                        <div
                          key={followingUser.id}
                          className={`flex items-center justify-between p-3 rounded-xl transition-colors ${isDark ? "hover:bg-slate-800" : "hover:bg-gray-50"}`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <img
                              src={followingUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${followingUser.username}`}
                              alt={followingUser.full_name}
                              loading="lazy"
                              className="w-10 h-10 rounded-full flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className={`font-semibold text-sm truncate ${isDark ? "text-white" : "text-gray-900"}`}>{followingUser.full_name}</p>
                              <p className={`text-xs truncate ${isDark ? "text-slate-400" : "text-gray-500"}`}>@{followingUser.username}</p>
                            </div>
                          </div>
                          <button
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex-shrink-0 ${isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                          >
                            Following
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-center py-8 text-sm ${isDark ? "text-slate-500" : "text-gray-400"}`}>Not following anyone yet</p>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ── Modals (unchanged) ── */}
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
        loading="lazy"
        srcSet={getAvatarUrl()}
      />
    </>
  );
};

export default React.memo(ProfilePage);
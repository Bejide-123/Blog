import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useUser } from "../../Context/userContext";
import { useTheme } from "../../Context/themeContext";
import NavbarPrivate from "../../Components/Private/Navbarprivate";
import ImageModal from "../../Components/Private/ImageModal";
import {
  getUserProfileById,
  getUserPosts,
  getUserStats,
  checkFollowStatus,
  toggleFollowUser,
} from "../../Services/user.js";
import {
  MapPin,
  Calendar,
  Link2,
  Users,
  FileText,
  ExternalLink,
  MoreHorizontal,
  Share2,
  Heart,
  MessageCircle,
  Bookmark,
  Zap,
  TrendingUp,
  Repeat2,
  Clock,
  Eye,
  Hash,
  Mail,
  Globe,
  MessageSquare,
} from "lucide-react";

const PublicProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useUser();
  const { theme } = useTheme();

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });
  const [imageModalOpen, setImageModalOpen] = useState(false);

  // Post interaction states
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set());
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState({});
  const [activeMenuPost, setActiveMenuPost] = useState(null);

  const isOwnProfile = currentUser?.id === userId;
  const isDark = theme !== "light";

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);

      const [profileData, postsData, statsData] = await Promise.all([
        getUserProfileById(userId),
        getUserPosts(userId),
        getUserStats(userId),
      ]);

      if (!profileData) {
        navigate("/404");
        return;
      }

      setProfileUser(profileData);
      setPosts(postsData);
      setStats(statsData);

      if (currentUser && currentUser.id !== userId) {
        try {
          const followStatus = await checkFollowStatus(userId);
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
      const { isFollowing: newIsFollowing, action } = await toggleFollowUser(userId);
      setIsFollowing(newIsFollowing);
      setStats((prev) => ({
        ...prev,
        followers: action === "followed" ? prev.followers + 1 : prev.followers - 1,
      }));
    } catch (error) {
      console.error("Error toggling follow:", error);
      alert("Unable to follow/unfollow at this time. The follow system may not be fully set up yet.");
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

  const toggleComments = (postId) => {
    setActiveCommentPost(activeCommentPost === postId ? null : postId);
  };

  const toggleMenu = (postId) => {
    setActiveMenuPost(activeMenuPost === postId ? null : postId);
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
      setComments((prev) => ({ ...prev, [postId]: [...(prev[postId] || []), comment] }));
      setNewComment("");
    }
  };

  const toggleCommentLike = (postId, commentId) => {
    setComments((prev) => ({
      ...prev,
      [postId]: (prev[postId] || []).map((comment) =>
        comment.id === commentId
          ? { ...comment, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1, isLiked: !comment.isLiked }
          : comment
      ),
    }));
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

  const getPostAuthor = (post) => {
    if (post.profiles) {
      return {
        id: profileUser.id,
        username: post.profiles.username || profileUser.username,
        full_name: post.profiles.full_name || profileUser.full_name,
        avatar_url: post.profiles.avatar_url || profileUser.avatar_url,
      };
    }
    return profileUser;
  };

  const getAvatarUrl = () =>
    profileUser?.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileUser?.username || "user"}`;

  const tabs = [
    { id: "posts", label: "Posts", count: stats.posts, icon: <FileText className="w-4 h-4" /> },
    { id: "about", label: "About", icon: <Users className="w-4 h-4" /> },
  ];

  // ─── Loading ─────────────────────────────────────────────────────────────────
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
            <button
              onClick={() => navigate("/home")}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
            >
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
          {profileUser.avatar_url ? (
            <img
              src={profileUser.avatar_url}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "blur(1px)", transform: "scale(1)" }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800" />
          )}

          {/* Gradient fade into page bg */}
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
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    boxShadow: isDark
                      ? "0 0 0 4px #0f172a, 0 20px 60px rgba(0,0,0,0.6)"
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

                {/* Verified badge */}
                {profileUser.is_verified && (
                  <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </div>
                )}

                {/* Online dot */}
                <span className="absolute top-2 right-2 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-sm" />
              </div>

              {/* Name + actions */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
                        {profileUser.full_name || profileUser.username}
                      </h1>
                      {profileUser.is_verified && (
                        <span className="text-blue-500 text-lg">✓</span>
                      )}
                    </div>
                    <p className={`text-sm mt-0.5 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                      @{profileUser.username}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {!isOwnProfile && (
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
                          onClick={() => navigate(`/messages?user=${profileUser.id}`)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                            isDark
                              ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"
                          }`}
                        >
                          <MessageSquare className="w-4 h-4" />
                          Message
                        </button>

                        <button
                          className={`p-2 rounded-xl transition-all ${
                            isDark
                              ? "bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700"
                              : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200 shadow-sm"
                          }`}
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    <button
                      className={`p-2 rounded-xl transition-all ${
                        isDark
                          ? "bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700"
                          : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200 shadow-sm"
                      }`}
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

              {/* Meta pills */}
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
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors ${
                      isDark
                        ? "bg-slate-800 text-blue-400 hover:bg-slate-700"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    }`}
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
                  { label: "Posts", value: stats.posts },
                  { label: "Followers", value: stats.followers },
                  { label: "Following", value: stats.following },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`flex-1 text-center py-3 px-2 ${
                      i < 2
                        ? isDark ? "border-r border-slate-800" : "border-r border-gray-100"
                        : ""
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
              className={`flex items-center gap-1 p-1 rounded-xl mb-6 ${
                isDark
                  ? "bg-slate-900/80 border border-slate-800"
                  : "bg-white border border-gray-200 shadow-sm"
              }`}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                      : isDark
                        ? "text-slate-400 hover:text-white hover:bg-slate-800"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
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
                      const postAuthor = getPostAuthor(post);

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
                              <div className="flex items-center gap-3">
                                <Link to={`/profile/${profileUser.id}`} onClick={(e) => e.stopPropagation()}>
                                  <img
                                    src={postAuthor.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${postAuthor.username}`}
                                    alt={postAuthor.full_name}
                                    loading="lazy"
                                    className={`w-10 h-10 rounded-xl border-2 ${isDark ? "border-slate-800" : "border-white"} shadow-sm`}
                                  />
                                </Link>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Link to={`/profile/${profileUser.id}`} onClick={(e) => e.stopPropagation()}>
                                      <span className={`font-semibold text-sm transition-colors ${isDark ? "text-white hover:text-blue-400" : "text-gray-900 hover:text-blue-600"}`}>
                                        {postAuthor.full_name || postAuthor.username}
                                      </span>
                                    </Link>
                                    <span className={`text-xs ${isDark ? "text-slate-500" : "text-gray-400"}`}>·</span>
                                    <span className={`text-xs ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                                      {formatDate(post.createdat)}
                                    </span>
                                  </div>
                                  <Link to={`/profile/${profileUser.id}`} onClick={(e) => e.stopPropagation()}>
                                    <p className={`text-xs ${isDark ? "text-slate-500 hover:text-blue-400" : "text-gray-400 hover:text-blue-600"} transition-colors`}>
                                      @{postAuthor.username}
                                    </p>
                                  </Link>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {post.trending && (
                                  <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    Trending
                                  </span>
                                )}
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleMenu(post.id); }}
                                  className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-slate-500 hover:text-slate-300 hover:bg-slate-800" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </div>
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
                              <div>
                                <p className={`text-sm leading-relaxed line-clamp-3 whitespace-pre-line ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                                  {post.content?.substring(0, 150)}...
                                </p>
                                {post.content && post.content.length > 150 && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setExpandedPostId(post.id); }}
                                    className={`mt-2 text-sm font-medium transition-colors ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
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
                              className="w-full h-48 sm:h-64 overflow-hidden cursor-pointer"
                              onClick={() => navigate(`/post/${post.id}`)}
                            >
                              <img
                                src={post.featured_image}
                                alt={post.title}
                                loading="lazy"
                                srcSet={post.featured_image}
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
                                    className={`text-xs px-2.5 py-1 rounded-full font-medium cursor-pointer transition-colors ${
                                      isDark
                                        ? "bg-blue-950/60 text-blue-400 border border-blue-900 hover:bg-blue-950"
                                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                    }`}
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
                              <div className="p-4 sm:p-5 space-y-4 max-h-80 overflow-y-auto">
                                {/* Comment list */}
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
                                          <div className="flex items-center gap-2">
                                            <span className={`font-semibold text-xs ${isDark ? "text-white" : "text-gray-900"}`}>{comment.author.name}</span>
                                            <span className={`text-xs ${isDark ? "text-slate-500" : "text-gray-400"}`}>{comment.timestamp}</span>
                                          </div>
                                          <button
                                            onClick={() => toggleCommentLike(post.id, comment.id)}
                                            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs transition-colors ${
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
                                <div className={`rounded-xl border p-4 ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
                                  <div className="flex items-end gap-3">
                                    <img
                                      src={currentUser?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser"}
                                      alt="You"
                                      loading="lazy"
                                      className={`w-8 h-8 rounded-full border-2 flex-shrink-0 ${isDark ? "border-slate-700" : "border-gray-200"}`}
                                    />
                                    <div className="flex-1">
                                      <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Share your thoughts..."
                                        rows={2}
                                        className={`w-full px-3 py-2.5 text-sm rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                                          isDark
                                            ? "bg-slate-700 text-white placeholder:text-slate-500 border border-slate-600"
                                            : "bg-gray-50 text-gray-900 placeholder:text-gray-400 border border-gray-200"
                                        }`}
                                      />
                                      <div className="flex items-center justify-between mt-2">
                                        <span className={`text-xs ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                                          Shift+Enter for new line
                                        </span>
                                        <button
                                          onClick={() => handleSendComment(post.id)}
                                          disabled={!newComment.trim()}
                                          className={`px-4 py-1.5 rounded-xl font-medium text-sm transition-all ${
                                            newComment.trim()
                                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
                                              : isDark ? "bg-slate-700 text-slate-500 cursor-not-allowed" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                          }`}
                                        >
                                          Post
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
                    <div className={`text-center py-16 rounded-2xl border ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"}`}>
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${isDark ? "bg-slate-800" : "bg-gray-100"}`}>
                        <FileText className={`w-8 h-8 ${isDark ? "text-slate-500" : "text-gray-400"}`} />
                      </div>
                      <h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>No posts yet</h3>
                      <p className={`text-sm max-w-xs mx-auto ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                        {isOwnProfile ? "Share your thoughts with the community" : "This user hasn't posted anything yet"}
                      </p>
                      {isOwnProfile && (
                        <button
                          onClick={() => navigate("/create")}
                          className="mt-6 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg text-sm"
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
                            <div className={`text-2xl font-bold bg-gradient-to-r ${s.from} ${s.to} bg-clip-text text-transparent`}>
                              {s.value.toLocaleString()}
                            </div>
                            <div className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ── Modal (unchanged) ── */}
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

export default React.memo(PublicProfilePage);
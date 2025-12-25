import { useState, useEffect, useContext } from "react";
import {
  Settings,
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

export default function ProfilePage() {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set([1, 3]));
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set([2]));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState({});
  const [activeMenuPost, setActiveMenuPost] = useState(null);
  const [repostedPosts, setRepostedPosts] = useState(new Set());

  useEffect(() => {
    setTimeout(() => {
      setIsPageLoading(false);
    }, 3000);
  }, []);

  const isOwnProfile = true;

  // Generate avatar URL for the profile
  const getAvatarUrl = () => {
    if (!user) return "https://api.dicebear.com/7.x/avataaars/svg?seed=default";
    return user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || user?.email || "user"}`;
  };

  // Get display name
  const getDisplayName = () => {
    if (!user) return "User";
    return user?.name || user?.username || user?.email?.split('@')[0] || "User";
  };

  // Get display username
  const getDisplayUsername = () => {
    if (!user) return "user";
    return user?.username || user?.email?.split('@')[0] || "user";
  };

  // Profile data using user context
  const profile = {
    name: getDisplayName(),
    username: getDisplayUsername(),
    avatar: getAvatarUrl(),
    bio: "Full-stack developer passionate about React, Node.js, and building cool stuff. Writing about web dev, tech, and life. ☕️💻",
    location: "Lagos, Nigeria",
    website: "johndoe.dev",
    joinedDate: "January 2024",
    stats: {
      posts: 24,
      followers: 1234,
      following: 567,
    },
    badges: ["React Pro", "Open Source", "Tech Writer"],
    topics: ["React", "JavaScript", "Node.js", "TypeScript", "Web Development"],
    verified: true,
    followers: "1.2K",
  };

  const userPosts = [
    {
      id: 1,
      author: {
        name: getDisplayName(),
        username: getDisplayUsername(),
        avatar: getAvatarUrl(),
        verified: true,
        followers: "1.2K",
      },
      title: "Getting Started with React Hooks",
      content:
        "React Hooks have revolutionized the way we write React components. In this comprehensive guide, we will explore useState, useEffect, and custom hooks to build better applications...",
      excerpt:
        "React Hooks have revolutionized the way we write React components. In this comprehensive guide, we will explore useState, useEffect, and custom hooks...",
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
      tags: ["React", "JavaScript", "Web Dev"],
      readTime: "5 min read",
      date: "2 days ago",
      likes: 124,
      comments: 18,
      shares: 45,
      views: "2.3K",
      trending: true,
      isSponsored: false,
    },
    {
      id: 2,
      author: {
        name: getDisplayName(),
        username: getDisplayUsername(),
        avatar: getAvatarUrl(),
        verified: true,
        followers: "1.2K",
      },
      title: "Building Scalable REST APIs",
      content: "Learn how to build production-ready REST APIs using Node.js, Express, and MongoDB. This tutorial covers authentication, error handling, rate limiting, and best practices for API design that will help you create robust backend services.",
      excerpt: "Learn how to build production-ready REST APIs using Node.js, Express, and MongoDB. This tutorial covers authentication, error handling, rate limiting...",
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
      tags: ["Node.js", "Backend", "API"],
      readTime: "8 min read",
      date: "5 days ago",
      likes: 256,
      comments: 34,
      shares: 89,
      views: "5.6K",
      trending: true,
      isSponsored: false,
    },
    {
      id: 3,
      author: {
        name: getDisplayName(),
        username: getDisplayUsername(),
        avatar: getAvatarUrl(),
        verified: true,
        followers: "1.2K",
      },
      title: "My Journey Learning TypeScript",
      content:
        "After years of writing JavaScript, I decided to dive deep into TypeScript. Here is what I learned along the way and why I think every JavaScript developer should consider making the switch to TypeScript for better code quality and developer experience.",
      excerpt:
        "After years of writing JavaScript, I decided to dive deep into TypeScript. Here is what I learned along the way and why I think every JavaScript developer should...",
      image:
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
      tags: ["TypeScript", "Learning", "JavaScript"],
      readTime: "6 min read",
      date: "1 week ago",
      likes: 312,
      comments: 45,
      shares: 124,
      views: "8.9K",
      trending: false,
      isSponsored: false,
    },
    {
      id: 4,
      author: {
        name: getDisplayName(),
        username: getDisplayUsername(),
        avatar: getAvatarUrl(),
        verified: true,
        followers: "1.2K",
      },
      title: "CSS Grid vs Flexbox",
      content: "Understanding when to use CSS Grid vs Flexbox in modern web development.",
      excerpt: "Understanding when to use CSS Grid vs Flexbox in modern web development.",
      image: null,
      tags: ["CSS", "Frontend", "Web Design"],
      readTime: "4 min read",
      date: "2 weeks ago",
      likes: 178,
      comments: 23,
      shares: 67,
      views: "3.2K",
      trending: false,
      isSponsored: false,
    },
  ];

  const tabs = [
    { id: "posts", label: "Posts", count: profile.stats.posts, icon: <FileText className="w-4 h-4" /> },
    { id: "about", label: "About", icon: <Users className="w-4 h-4" /> },
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

  // If no user and still loading, show loading state
  if (isPageLoading) {
    return <PageLoader />;
  }

  // If no user after loading, redirect or show message
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Please log in to view profile
          </h2>
          <button
            onClick={() => window.location.href = "/login"}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavbarPrivate />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 pt-16 md:pt-20">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Profile Header - Enhanced Design */}
          <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border border-gray-200/50 dark:border-slate-700/50 rounded-2xl shadow-lg hover:shadow-xl dark:hover:shadow-slate-900/50 transition-all duration-300 mb-8 overflow-hidden">
            {/* Cover Photo */}
            <div className="h-40 md:h-52 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 dark:from-blue-700 dark:via-blue-600 dark:to-purple-700 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Profile Info */}
            <div className="relative px-6 pb-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-20 sm:-mt-24">
                {/* Avatar Container */}
                <div className="relative">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 p-1">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full rounded-xl object-cover"
                    />
                    {profile.verified && (
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 sm:mt-0">
                  {isOwnProfile ? (
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsFollowing(!isFollowing)}
                        className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                          isFollowing
                            ? "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600 border border-gray-300 dark:border-slate-600"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                        }`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                      <button className="p-2.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300">
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
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {profile.name}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base mt-1">
                      @{profile.username}
                    </p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-300 self-start sm:self-center">
                    <Share2 className="w-4 h-4" />
                    <span className="font-medium">Share</span>
                  </button>
                </div>

                <p className="mt-4 text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                  {profile.bio}
                </p>

                {/* Profile Stats */}
                <div className="flex items-center gap-6 mt-5 pt-5 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-1.5 cursor-pointer group">
                    <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
                      <FileText className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
                        {profile.stats.posts}
                      </span>
                      <span className="ml-1.5 text-gray-600 dark:text-gray-400 text-sm">
                        Posts
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 cursor-pointer group">
                    <div className="p-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg">
                      <Users className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-green-600 dark:group-hover:text-green-500 transition-colors">
                        {profile.stats.followers}
                      </span>
                      <span className="ml-1.5 text-gray-600 dark:text-gray-400 text-sm">
                        Followers
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 cursor-pointer group">
                    <div className="p-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg">
                      <Users className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors">
                        {profile.stats.following}
                      </span>
                      <span className="ml-1.5 text-gray-600 dark:text-gray-400 text-sm">
                        Following
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                  {profile.location && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.website && (
                    <a
                      href={`https://${profile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all"
                    >
                      <Link2 className="w-3.5 h-3.5 text-blue-500" />
                      <span>{profile.website}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>Joined {profile.joinedDate}</span>
                  </div>
                </div>

                {/* Badges */}
                {profile.badges && profile.badges.length > 0 && (
                  <div className="mt-5">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Badges & Achievements
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.badges.map((badge, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 text-yellow-700 dark:text-yellow-400 text-sm font-medium rounded-full border border-yellow-200 dark:border-yellow-800/30"
                        >
                          <Star className="w-3 h-3 inline mr-1" />
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border border-gray-200/50 dark:border-slate-700/50 rounded-2xl p-2 mb-8 shadow-sm">
            <div className="flex items-center gap-1 overflow-x-auto">
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
                  {tab.count !== undefined && (
                    <span className="ml-1 bg-white/20 dark:bg-slate-900/30 px-2 py-0.5 rounded-full text-xs">
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
                {userPosts.length > 0 ? (
                  userPosts.map((post) => {
                    const isLiked = likedPosts.has(post.id);
                    const isBookmarked = bookmarkedPosts.has(post.id);
                    const isCommentsOpen = activeCommentPost === post.id;
                    const isMenuOpen = activeMenuPost === post.id;
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
                                  src={post.author.avatar}
                                  alt={post.author.name}
                                  className="w-12 h-12 rounded-xl border-2 border-white dark:border-slate-800 shadow-sm"
                                />
                                {post.author.verified && (
                                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                                    <svg
                                      className="w-2 h-2 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
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
                                    {post.date}
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

                            {/* Right side container for badges and menu button */}
                            <div className="flex items-center gap-2">
                              {/* Badges container */}
                              <div className="flex flex-wrap justify-end gap-1">
                                {post.trending && (
                                  <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                                    <TrendingUp className="w-3 h-3" />
                                    Trending
                                  </span>
                                )}

                                {post.isSponsored && (
                                  <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                                    <Star className="w-3 h-3" />
                                    Sponsored
                                  </span>
                                )}

                                {isReposted && (
                                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg">
                                    <Repeat2 className="w-3 h-3 text-green-500" />
                                    <span className="font-medium text-green-600 dark:text-green-400">
                                      You reposted
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Menu Button */}
                              <button
                                onClick={() => toggleMenu(post.id)}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300"
                              >
                                <MoreHorizontal className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          {/* Post Title */}
                          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-500 transition-colors cursor-pointer leading-tight">
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
                                  {post.excerpt || post.content}
                                </p>
                                {(post.excerpt || post.content.length > 150) && (
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
                                  {post.comments + (comments[post.id]?.length || 0)}
                                </span>
                              </button>

                              {/* Share */}
                              <button
                                onClick={() => toggleMenu(post.id)}
                                className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300"
                              >
                                <ShareIcon className="w-5 h-5" />
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

                        {/* Comments Section */}
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
                ) : (
                  <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center">
                      <FileText className="w-10 h-10 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      No posts yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      Share your thoughts and experiences with the community
                    </p>
                    {isOwnProfile && (
                      <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <Zap className="w-4 h-4 inline mr-2" />
                        Write your first post
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {activeTab === "about" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* About Card */}
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-lg transition-all duration-300">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      About {profile.name}
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Bio
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {profile.bio}
                        </p>
                      </div>

                      {/* Topics of Interest */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Topics of Interest
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.topics.map((topic, index) => (
                            <span
                              key={index}
                              className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-400 font-medium rounded-xl hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all cursor-pointer"
                            >
                              <Hash className="w-3.5 h-3.5 inline mr-1.5" />
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Stats Cards */}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Activity Stats
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {profile.stats.posts}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Posts
                            </div>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl border border-green-100 dark:border-green-800/30">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {profile.stats.followers}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Followers
                            </div>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 rounded-xl border border-orange-100 dark:border-orange-800/30">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                              {profile.stats.following}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Following
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Side Info */}
                <div className="space-y-6">
                  {/* Join Date */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Member Since
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {profile.joinedDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  {profile.location && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
                          <MapPin className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Location
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {profile.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Website */}
                  {profile.website && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
                          <Link2 className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Website
                          </h4>
                          <a
                            href={`https://${profile.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            {profile.website}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentProfile={profile}
        />
      </div>
    </>
  );
}
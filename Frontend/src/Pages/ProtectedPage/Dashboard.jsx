import { useState, useEffect } from "react";
import {
  FileText,
  Heart,
  MessageCircle,
  Users,
  Edit,
  Trash2,
  PlusCircle,
  Eye,
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  Zap,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
  BarChart3,
  Target,
  Calendar,
  Hash,
} from "lucide-react";
import NavbarPrivate from "../../Components/Private/Navbarprivate";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "../../Components/Private/Loader";
import { useTheme } from "../../Context/themeContext";

export default function DashboardPage() {
  const { theme } = useTheme();
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsPageLoading(false);
    }, 3000);
  });

  const navigate = useNavigate();

  // Mock data - will come from API
  const stats = {
    totalPosts: 24,
    postsChange: 12,
    totalLikes: 567,
    likesChange: 8,
    totalComments: 89,
    commentsChange: -3,
    followers: 45,
    followersChange: 15,
    drafts: 3,
    views: "2.3K",
    viewsChange: 25,
  };

  const topPost = {
    id: 1,
    title: "Building Scalable REST APIs with Node.js",
    likes: 256,
    comments: 34,
    views: "5.6K",
    excerpt: "Learn how to build production-ready REST APIs...",
    tags: ["Node.js", "Backend", "API"],
    publishedAt: "5 days ago",
  };

  const recentActivity = [
    {
      type: "like",
      user: "Sarah J.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      action: "liked your post",
      post: "React Hooks Guide",
      time: "2h ago",
    },
    {
      type: "comment",
      user: "Michael C.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      action: "commented on",
      post: "TypeScript Journey",
      time: "5h ago",
    },
    {
      type: "follow",
      user: "Emma W.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
      action: "started following you",
      time: "1d ago",
    },
    {
      type: "like",
      user: "David B.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      action: "liked your post",
      post: "CSS Grid vs Flexbox",
      time: "2d ago",
    },
  ];

  const recentPosts = [
    {
      id: 1,
      title: "Getting Started with React Hooks",
      likes: 124,
      comments: 18,
      views: "2.3K",
      publishedAt: "2 days ago",
      status: "published",
      trending: true,
    },
    {
      id: 2,
      title: "Building Scalable REST APIs",
      likes: 256,
      comments: 34,
      views: "5.6K",
      publishedAt: "5 days ago",
      status: "published",
      trending: true,
    },
    {
      id: 3,
      title: "My Journey Learning TypeScript",
      likes: 312,
      comments: 45,
      views: "8.9K",
      publishedAt: "1 week ago",
      status: "published",
      trending: false,
    },
  ];

  const handleEditPost = (postId) => {
    alert(`Edit post ${postId} - Navigate to edit page`);
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      alert(`Delete post ${postId} - Call API`);
    }
  };

  const handleViewPost = (postId) => {
    alert(`View post ${postId} - Navigate to post page`);
  };

  return (
    <>
      {isPageLoading ? (
        <PageLoader />
      ) : (
        <>
          <NavbarPrivate />
          <div className={`min-h-screen bg-gradient-to-b ${theme === 'light' ? 'from-gray-50 via-white to-white' : 'from-slate-900 via-slate-900 to-slate-950'} pt-16 md:pt-20`}>
            <div className="max-w-7xl mx-auto px-4 py-8">
              {/* Header */}
              <div className={`relative ${theme === 'light' ? 'bg-white/95' : 'bg-slate-800/95'} backdrop-blur-lg border ${theme === 'light' ? 'border-gray-200/50' : 'border-slate-700/50'} rounded-2xl p-6 mb-8 shadow-lg hover:shadow-xl ${theme === 'light' ? '' : 'dark:hover:shadow-slate-900/50'} transition-all duration-300`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${theme === 'light' ? 'from-blue-600 to-purple-600' : 'from-blue-500 to-purple-500'} bg-clip-text text-transparent`}>
                      Dashboard
                    </h1>
                    <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-sm mt-1`}>
                      Track your blog's performance and engagement
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className={`flex items-center gap-2 px-4 py-2.5 ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'} rounded-xl transition-all`}>
                      <Filter className="w-4 h-4" />
                      <span className="font-medium">Filters</span>
                    </button>
                    <button className={`flex items-center gap-2 px-4 py-2.5 ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'} rounded-xl transition-all`}>
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">Last 30 days</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Grid with Trends */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {/* Total Posts */}
                <div className={`group relative ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} p-6 shadow-lg hover:shadow-2xl ${theme === 'light' ? '' : 'dark:hover:shadow-slate-900/50'} transition-all duration-300 hover:-translate-y-1`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl">
                      <FileText className="w-6 h-6 text-blue-500" />
                    </div>
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        stats.postsChange >= 0
                          ? `bg-green-500/10 text-green-600 ${theme === 'dark' ? 'dark:text-green-400' : ''} border border-green-500/20`
                          : `bg-red-500/10 text-red-600 ${theme === 'dark' ? 'dark:text-red-400' : ''} border border-red-500/20`
                      }`}
                    >
                      {stats.postsChange >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {Math.abs(stats.postsChange)}%
                    </div>
                  </div>
                  <h3 className={`text-3xl md:text-4xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-2`}>
                    {stats.totalPosts}
                  </h3>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} font-medium`}>
                    Total Posts
                  </p>
                  {stats.drafts > 0 && (
                    <div className={`mt-3 flex items-center gap-2 text-sm ${theme === 'light' ? 'text-orange-600' : 'text-orange-400'} font-medium`}>
                      <FileText className="w-4 h-4" />
                      <span>{stats.drafts} drafts pending</span>
                    </div>
                  )}
                </div>

                {/* Total Likes */}
                <div className={`group relative ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} p-6 shadow-lg hover:shadow-2xl ${theme === 'light' ? '' : 'dark:hover:shadow-slate-900/50'} transition-all duration-300 hover:-translate-y-1`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-xl">
                      <Heart className="w-6 h-6 text-red-500 fill-red-500/20" />
                    </div>
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        stats.likesChange >= 0
                          ? `bg-green-500/10 text-green-600 ${theme === 'dark' ? 'dark:text-green-400' : ''} border border-green-500/20`
                          : `bg-red-500/10 text-red-600 ${theme === 'dark' ? 'dark:text-red-400' : ''} border border-red-500/20`
                      }`}
                    >
                      {stats.likesChange >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {Math.abs(stats.likesChange)}%
                    </div>
                  </div>
                  <h3 className={`text-3xl md:text-4xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-2`}>
                    {stats.totalLikes}
                  </h3>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} font-medium`}>
                    Total Likes
                  </p>
                </div>

                {/* Total Comments */}
                <div className={`group relative ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} p-6 shadow-lg hover:shadow-2xl ${theme === 'light' ? '' : 'dark:hover:shadow-slate-900/50'} transition-all duration-300 hover:-translate-y-1`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl">
                      <MessageCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        stats.commentsChange >= 0
                          ? `bg-green-500/10 text-green-600 ${theme === 'dark' ? 'dark:text-green-400' : ''} border border-green-500/20`
                          : `bg-red-500/10 text-red-600 ${theme === 'dark' ? 'dark:text-red-400' : ''} border border-red-500/20`
                      }`}
                    >
                      {stats.commentsChange >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {Math.abs(stats.commentsChange)}%
                    </div>
                  </div>
                  <h3 className={`text-3xl md:text-4xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-2`}>
                    {stats.totalComments}
                  </h3>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} font-medium`}>
                    Total Comments
                  </p>
                </div>

                {/* Followers */}
                <div className={`group relative ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} p-6 shadow-lg hover:shadow-2xl ${theme === 'light' ? '' : 'dark:hover:shadow-slate-900/50'} transition-all duration-300 hover:-translate-y-1`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl">
                      <Users className="w-6 h-6 text-purple-500" />
                    </div>
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        stats.followersChange >= 0
                          ? `bg-green-500/10 text-green-600 ${theme === 'dark' ? 'dark:text-green-400' : ''} border border-green-500/20`
                          : `bg-red-500/10 text-red-600 ${theme === 'dark' ? 'dark:text-red-400' : ''} border border-red-500/20`
                      }`}
                    >
                      {stats.followersChange >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {Math.abs(stats.followersChange)}%
                    </div>
                  </div>
                  <h3 className={`text-3xl md:text-4xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-2`}>
                    {stats.followers}
                  </h3>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} font-medium`}>
                    Followers
                  </p>
                </div>
              </div>

              {/* Top Post & Activity Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Top Performing Post */}
                <div className={`lg:col-span-2 group relative ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} shadow-lg hover:shadow-2xl ${theme === 'light' ? '' : 'dark:hover:shadow-slate-900/50'} transition-all duration-300 overflow-hidden`}>
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                      <Award className="w-3 h-3" />
                      Top Performing
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className={`w-5 h-5 ${theme === 'light' ? 'text-blue-600' : 'text-blue-500'}`} />
                      <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        Top Performing Post
                      </h2>
                    </div>

                    <div className={`bg-gradient-to-r ${theme === 'light' ? 'from-yellow-50 to-orange-50' : 'from-yellow-900/10 to-orange-900/10'} rounded-xl p-5 border ${theme === 'light' ? 'border-yellow-200' : 'border-yellow-900/30'}`}>
                      <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-3`}>
                        {topPost.title}
                      </h3>
                      <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-4`}>
                        {topPost.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {topPost.tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 bg-gradient-to-r ${theme === 'light' ? 'from-blue-50 to-purple-50 text-blue-700' : 'from-blue-900/20 to-purple-900/20 text-blue-400'} text-xs font-medium rounded-full`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className={`text-center p-3 ${theme === 'light' ? 'bg-white/50' : 'bg-slate-800/50'} rounded-xl`}>
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
                            <span className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              {topPost.likes}
                            </span>
                          </div>
                          <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            Likes
                          </span>
                        </div>
                        <div className={`text-center p-3 ${theme === 'light' ? 'bg-white/50' : 'bg-slate-800/50'} rounded-xl`}>
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <MessageCircle className="w-4 h-4 text-green-500" />
                            <span className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              {topPost.comments}
                            </span>
                          </div>
                          <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            Comments
                          </span>
                        </div>
                        <div className={`text-center p-3 ${theme === 'light' ? 'bg-white/50' : 'bg-slate-800/50'} rounded-xl`}>
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <Eye className="w-4 h-4 text-blue-500" />
                            <span className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              {topPost.views}
                            </span>
                          </div>
                          <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            Views
                          </span>
                        </div>
                      </div>
                      <div className={`mt-4 pt-3 border-t ${theme === 'light' ? 'border-yellow-200' : 'border-yellow-900/30'}`}>
                        <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          Published {topPost.publishedAt}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className={`group relative ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} shadow-lg hover:shadow-2xl ${theme === 'light' ? '' : 'dark:hover:shadow-slate-900/50'} transition-all duration-300 overflow-hidden`}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className={`w-5 h-5 ${theme === 'light' ? 'text-blue-600' : 'text-blue-500'}`} />
                        <h2 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          Recent Activity
                        </h2>
                      </div>
                      <button className={`text-sm ${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'} font-medium`}>
                        View all
                      </button>
                    </div>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-xl ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700/50'} transition-all duration-200 group/item`}
                        >
                          <img
                            src={activity.avatar}
                            alt={activity.user}
                            className={`w-10 h-10 rounded-full border-2 ${theme === 'light' ? 'border-white' : 'border-slate-800'} shadow-sm`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'} truncate`}>
                              {activity.user}
                            </p>
                            <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} truncate`}>
                              {activity.action}{" "}
                              {activity.post && (
                                <span className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                  "{activity.post}"
                                </span>
                              )}
                            </p>
                            <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                              {activity.time}
                            </p>
                          </div>
                          <div
                            className={`p-2 rounded-lg ${
                              activity.type === "like"
                                ? `bg-red-500/10 text-red-600 ${theme === 'dark' ? 'dark:text-red-400' : ''}`
                                : activity.type === "comment"
                                ? `bg-green-500/10 text-green-600 ${theme === 'dark' ? 'dark:text-green-400' : ''}`
                                : `bg-purple-500/10 text-purple-600 ${theme === 'dark' ? 'dark:text-purple-400' : ''}`
                            }`}
                          >
                            {activity.type === "like" && (
                              <Heart className="w-4 h-4" />
                            )}
                            {activity.type === "comment" && (
                              <MessageCircle className="w-4 h-4" />
                            )}
                            {activity.type === "follow" && (
                              <Users className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3 mb-8">
                <button
                  onClick={() => navigate("/create")}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <PlusCircle className="w-5 h-5" />
                  Write New Post
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className={`flex items-center gap-2 px-6 py-3 ${theme === 'light' ? 'bg-white text-gray-700 border-gray-300 hover:border-blue-600 hover:text-blue-600 hover:bg-gray-50' : 'bg-slate-800 text-gray-300 border-slate-600 hover:border-blue-500 hover:text-blue-500 hover:bg-slate-700'} font-semibold rounded-xl border transition-all duration-300`}
                >
                  <Eye className="w-5 h-5" />
                  View All Posts
                </button>
                {stats.drafts > 0 && (
                  <button
                    onClick={() => navigate("/create")}
                    className={`flex items-center gap-2 px-6 py-3 ${theme === 'light' ? 'bg-white text-gray-700 border-orange-300 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50' : 'bg-slate-800 text-gray-300 border-orange-600 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-900/20'} font-semibold rounded-xl border transition-all duration-300`}
                  >
                    <FileText className="w-5 h-5" />
                    Manage Drafts ({stats.drafts})
                  </button>
                )}
                <button className={`flex items-center gap-2 px-6 py-3 ${theme === 'light' ? 'bg-white text-gray-700 border-gray-300 hover:border-green-600 hover:text-green-600 hover:bg-gray-50' : 'bg-slate-800 text-gray-300 border-slate-600 hover:border-green-500 hover:text-green-500 hover:bg-slate-700'} font-semibold rounded-xl border transition-all duration-300`}>
                  <Target className="w-5 h-5" />
                  View Analytics
                </button>
              </div>

              {/* Recent Posts Table */}
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} shadow-lg overflow-hidden`}>
                <div className={`px-6 py-4 border-b ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} bg-gradient-to-r from-blue-500/5 to-purple-500/5`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          Your Recent Posts
                        </h2>
                        <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                          Manage and track your published content
                        </p>
                      </div>
                    </div>
                    <button className={`flex items-center gap-1 text-sm ${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'} font-medium`}>
                      View all
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${theme === 'light' ? 'bg-gray-50' : 'bg-slate-900'}`}>
                      <tr>
                        <th className={`px-6 py-4 text-left text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} uppercase tracking-wider`}>
                          Post Title
                        </th>
                        <th className={`px-6 py-4 text-center text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} uppercase tracking-wider`}>
                          Engagement
                        </th>
                        <th className={`px-6 py-4 text-center text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} uppercase tracking-wider`}>
                          Views
                        </th>
                        <th className={`px-6 py-4 text-center text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} uppercase tracking-wider`}>
                          Published
                        </th>
                        <th className={`px-6 py-4 text-right text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} uppercase tracking-wider`}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === 'light' ? 'divide-gray-200' : 'divide-slate-700'}`}>
                      {recentPosts.map((post) => (
                        <tr
                          key={post.id}
                          className={`${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-900/50'} transition-colors`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <button
                                  onClick={() => handleViewPost(post.id)}
                                  className={`${theme === 'light' ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-500'} font-medium transition-colors text-left block truncate`}
                                >
                                  {post.title}
                                </button>
                                {post.trending && (
                                  <span className={`inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-red-500/10 to-pink-500/10 text-red-600 ${theme === 'dark' ? 'dark:text-red-400' : ''} text-xs font-semibold rounded-full mt-1`}>
                                    <TrendingUp className="w-3 h-3" />
                                    Trending
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-6">
                              <div className="text-center">
                                <div className="flex items-center gap-1 justify-center">
                                  <Heart className="w-4 h-4 text-red-500" />
                                  <span className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                    {post.likes}
                                  </span>
                                </div>
                                <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                  Likes
                                </span>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center gap-1 justify-center">
                                  <MessageCircle className="w-4 h-4 text-green-500" />
                                  <span className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                    {post.comments}
                                  </span>
                                </div>
                                <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                  Comments
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center gap-1 justify-center">
                              <Eye className="w-4 h-4 text-blue-500" />
                              <span className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                {post.views}
                              </span>
                            </div>
                          </td>
                          <td className={`px-6 py-4 text-center text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            {post.publishedAt}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleViewPost(post.id)}
                                className={`p-2 ${theme === 'light' ? 'text-gray-600 hover:text-blue-500 hover:bg-blue-50' : 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20'} rounded-xl transition-all duration-300`}
                                title="View post"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEditPost(post.id)}
                                className={`p-2 ${theme === 'light' ? 'text-gray-600 hover:text-blue-500 hover:bg-blue-50' : 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20'} rounded-xl transition-all duration-300`}
                                title="Edit post"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className={`p-2 ${theme === 'light' ? 'text-gray-600 hover:text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-red-400 hover:bg-red-900/20'} rounded-xl transition-all duration-300`}
                                title="Delete post"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden">
                  {recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className={`p-4 border-b ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} last:border-0`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => handleViewPost(post.id)}
                            className={`text-base font-semibold ${theme === 'light' ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-500'} transition-colors mb-1 text-left block truncate`}
                          >
                            {post.title}
                          </button>
                          {post.trending && (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-red-500/10 to-pink-500/10 text-red-600 ${theme === 'dark' ? 'dark:text-red-400' : ''} text-xs font-semibold rounded-full`}>
                              <TrendingUp className="w-3 h-3" />
                              Trending
                            </span>
                          )}
                          <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mt-2`}>
                            Published {post.publishedAt}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className={`text-center p-2 ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-700/50'} rounded-lg`}>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              {post.likes}
                            </span>
                          </div>
                          <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            Likes
                          </span>
                        </div>
                        <div className={`text-center p-2 ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-700/50'} rounded-lg`}>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <MessageCircle className="w-4 h-4 text-green-500" />
                            <span className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              {post.comments}
                            </span>
                          </div>
                          <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            Comments
                          </span>
                        </div>
                        <div className={`text-center p-2 ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-700/50'} rounded-lg`}>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Eye className="w-4 h-4 text-blue-500" />
                            <span className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              {post.views}
                            </span>
                          </div>
                          <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            Views
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewPost(post.id)}
                          className={`flex-1 px-3 py-2 text-sm ${theme === 'light' ? 'text-gray-700 bg-gray-100 hover:bg-gray-200' : 'text-gray-300 bg-slate-700 hover:bg-slate-600'} rounded-lg transition-colors font-medium flex items-center justify-center gap-1`}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleEditPost(post.id)}
                          className={`flex-1 px-3 py-2 text-sm ${theme === 'light' ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-blue-500 bg-blue-900/20 hover:bg-blue-900/30'} rounded-lg transition-colors font-medium flex items-center justify-center gap-1`}
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className={`px-3 py-2 text-sm ${theme === 'light' ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-red-500 bg-red-900/20 hover:bg-red-900/30'} rounded-lg transition-colors flex items-center justify-center`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

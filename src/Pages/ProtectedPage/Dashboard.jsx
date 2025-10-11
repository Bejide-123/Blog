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
} from "lucide-react";
import NavbarPrivate from "../../Components/Private/Navbarprivate";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
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
  };

  const topPost = {
    id: 1,
    title: "Building Scalable REST APIs with Node.js",
    likes: 256,
    comments: 34,
    excerpt: "Learn how to build production-ready REST APIs...",
  };

  const recentActivity = [
    {
      type: "like",
      user: "Sarah J.",
      action: "liked your post",
      post: "React Hooks Guide",
      time: "2h ago",
    },
    {
      type: "comment",
      user: "Michael C.",
      action: "commented on",
      post: "TypeScript Journey",
      time: "5h ago",
    },
    {
      type: "follow",
      user: "Emma W.",
      action: "started following you",
      time: "1d ago",
    },
    {
      type: "like",
      user: "David B.",
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
      publishedAt: "2 days ago",
      status: "published",
    },
    {
      id: 2,
      title: "Building Scalable REST APIs",
      likes: 256,
      comments: 34,
      publishedAt: "5 days ago",
      status: "published",
    },
    {
      id: 3,
      title: "My Journey Learning TypeScript",
      likes: 312,
      comments: 45,
      publishedAt: "1 week ago",
      status: "published",
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
      {isPageLoading ? <PageLoader /> : 
        <>
          <NavbarPrivate />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-16 md:pt-20 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Track your blog's performance and engagement
            </p>
          </div>

          {/* Stats Grid with Trends */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {/* Total Posts */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl shadow-sm border border-blue-200 dark:border-blue-800 p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-xl shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                    stats.postsChange >= 0
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
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
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.totalPosts}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-400 font-medium">
                Total Posts
              </p>
              {stats.drafts > 0 && (
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 font-medium">
                  {stats.drafts} drafts pending
                </p>
              )}
            </div>

            {/* Total Likes */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 rounded-xl shadow-sm border border-red-200 dark:border-red-800 p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-red-500 dark:bg-red-500 rounded-xl shadow-lg">
                  <Heart className="w-6 h-6 text-white fill-white" />
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                    stats.likesChange >= 0
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
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
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.totalLikes}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-400 font-medium">
                Total Likes
              </p>
            </div>

            {/* Total Comments */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-xl shadow-sm border border-green-200 dark:border-green-800 p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-green-600 dark:bg-green-500 rounded-xl shadow-lg">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                    stats.commentsChange >= 0
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
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
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.totalComments}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-400 font-medium">
                Total Comments
              </p>
            </div>

            {/* Followers */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-xl shadow-sm border border-purple-200 dark:border-purple-800 p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-purple-600 dark:bg-purple-500 rounded-xl shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                    stats.followersChange >= 0
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
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
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.followers}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-400 font-medium">
                Followers
              </p>
            </div>
          </div>

          {/* Top Post & Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Top Performing Post */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Top Performing Post
                </h2>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-lg p-4 border border-yellow-200 dark:border-yellow-900/30">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {topPost.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {topPost.excerpt}
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      {topPost.likes}
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      likes
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      {topPost.comments}
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      comments
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Recent Activity
                </h2>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-slate-700 last:border-0 last:pb-0"
                  >
                    <div
                      className={`p-2 rounded-full ${
                        activity.type === "like"
                          ? "bg-red-100 dark:bg-red-900/20"
                          : activity.type === "comment"
                          ? "bg-green-100 dark:bg-green-900/20"
                          : "bg-purple-100 dark:bg-purple-900/20"
                      }`}
                    >
                      {activity.type === "like" && (
                        <Heart className="w-4 h-4 text-red-600 dark:text-red-400" />
                      )}
                      {activity.type === "comment" && (
                        <MessageCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      )}
                      {activity.type === "follow" && (
                        <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 dark:text-white font-medium truncate">
                        {activity.user}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        {activity.action}{" "}
                        {activity.post && `"${activity.post}"`}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={() => navigate('/create') }
              className="flex cursor-pointer items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <PlusCircle className="w-5 h-5" />
              Write New Post
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex cursor-pointer items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg border-2 border-gray-300 dark:border-slate-600 hover:border-blue-600 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
            >
              <Eye className="w-5 h-5" />
              View All Posts
            </button>
            {stats.drafts > 0 && (
              <button
                onClick={() => navigate('/create')}
                className="flex cursor-pointer items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-lg border-2 border-orange-300 dark:border-orange-600 hover:border-orange-500 dark:hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
              >
                <FileText className="w-5 h-5" />
                Manage Drafts ({stats.drafts})
              </button>
            )}
          </div>

          {/* Recent Posts Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Your Recent Posts
              </h2>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Post Title
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Likes
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Comments
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {recentPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewPost(post.id)}
                          className="text-slate-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-500 transition-colors text-left"
                        >
                          {post.title}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 font-semibold">
                          <Heart className="w-4 h-4 text-red-500" />
                          {post.likes}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 font-semibold">
                          <MessageCircle className="w-4 h-4 text-green-600" />
                          {post.comments}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                        {post.publishedAt}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewPost(post.id)}
                            className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="View post"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditPost(post.id)}
                            className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Edit post"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
            <div className="md:hidden divide-y divide-gray-200 dark:divide-slate-700">
              {recentPosts.map((post) => (
                <div key={post.id} className="p-4">
                  <button
                    onClick={() => handleViewPost(post.id)}
                    className="text-base font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500 transition-colors mb-2 text-left block"
                  >
                    {post.title}
                  </button>
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                      {post.comments}
                    </span>
                    <span>{post.publishedAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewPost(post.id)}
                      className="flex-1 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEditPost(post.id)}
                      className="flex-1 px-3 py-2 text-sm text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="px-3 py-2 text-sm text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
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
      }
    </>
  );
}

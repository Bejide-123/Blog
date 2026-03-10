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
  BarChart3,
  Target,
  Calendar,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import NavbarPrivate from "../../Components/Private/Navbarprivate";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "../../Components/Private/Loader";
import { useTheme } from "../../Context/themeContext";
import { useUser } from "../../Context/userContext"; // Import useUser
import { getUserPosts, deletePost } from "../../Services/post"; // Import post services
import { getUserStats } from "../../Services/user"; // Import user services

export default function DashboardPage() {
  const { theme } = useTheme();
  const { user } = useUser();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const navigate = useNavigate();

  const [userStats, setUserStats] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [draftPosts, setDraftPosts] = useState([]);
  const [topUserPost, setTopUserPost] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        navigate('/login'); // Redirect if no user
        return;
      }

      try {
        setLoadingData(true);
        setError(null);

        // Fetch user stats
        const statsData = await getUserStats(user.id);
        setUserStats(statsData);

        // Fetch published posts
        const publishedPostsResult = await getUserPosts(user.id, { status: 'published', limit: 100 }); // Fetch enough to find top post
        const publishedPosts = publishedPostsResult.posts || [];
        setUserPosts(publishedPosts);

        // Fetch draft posts
        const draftPostsResult = await getUserPosts(user.id, { status: 'draft' });
        setDraftPosts(draftPostsResult.posts || []);

        // Calculate aggregated stats
        let totalLikes = 0;
        let totalComments = 0;
        publishedPosts.forEach(post => {
          totalLikes += post.likescount || 0;
          totalComments += post.comments_count || 0;
        });

        // Determine top post (e.g., by likes count)
        const sortedPostsByLikes = [...publishedPosts].sort((a, b) => (b.likescount || 0) - (a.likescount || 0));
        if (sortedPostsByLikes.length > 0) {
          setTopUserPost(sortedPostsByLikes[0]);
        } else {
          setTopUserPost(null);
        }

        // Mock data for changes (can be replaced with real analytics later)
        const mockChanges = {
          postsChange: 12,
          likesChange: 8,
          commentsChange: -3,
          followersChange: 15,
          viewsChange: 25,
        };

        // Combine all stats
        const combinedStats = {
          totalPosts: publishedPosts.length,
          totalLikes: totalLikes,
          totalComments: totalComments,
          followers: statsData.followers,
          drafts: draftPostsResult.posts?.length || 0,
          views: "N/A", // Placeholder, as views are not directly available in current services
          ...mockChanges, // Include mock changes for now
        };
        setUserStats(combinedStats);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoadingData(false);
        setIsPageLoading(false); // Set page loading to false after data is fetched
      }
    };

    fetchData();
  }, [user?.id, navigate]);

  // Mock data for recent activity (as it's more complex to fetch live)
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

  const handleEditPost = (postId) => {
    navigate(`/edit/${postId}`);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(postId);
        // Remove the deleted post from the state
        setUserPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        setDraftPosts(prevDrafts => prevDrafts.filter(post => post.id !== postId));
        // Recalculate stats if necessary
        // For simplicity, a full refetch might be easier for stats after deletion
        // or update counts manually. For now, just remove from list.
        alert("Post deleted successfully!");
      } catch (err) {
        console.error("Error deleting post:", err);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  const handleViewPost = (postId) => {
    navigate(`/post/${postId}`);
  };

  // Helper to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isPageLoading || loadingData) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-900'} pt-16 md:pt-20 flex items-center justify-center`}>
        <div className="text-center p-8 rounded-lg shadow-lg bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400">
          <p className="text-lg font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavbarPrivate />
      <div className={`min-h-screen bg-gradient-to-br ${theme === 'light' ? 'from-gray-50 via-white to-blue-50' : 'from-slate-900 via-slate-900 to-slate-950'} pt-16 md:pt-20`}>
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 left-10 w-96 h-96 ${theme === 'light' ? 'bg-blue-200/30' : 'bg-blue-900/10'} rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-20 right-10 w-96 h-96 ${theme === 'light' ? 'bg-purple-200/30' : 'bg-purple-900/10'} rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 pb-24 relative z-10">
          
          {/* Header */}
          <div className={`relative ${theme === 'light' ? 'bg-white/95' : 'bg-slate-800/95'} backdrop-blur-xl border-2 ${theme === 'light' ? 'border-gray-200/50' : 'border-slate-700/50'} rounded-2xl p-6 mb-6 shadow-xl hover:shadow-2xl transition-all duration-300`}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl"></div>
            <div className="relative">
              <h1 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${theme === 'light' ? 'from-blue-600 via-purple-600 to-pink-600' : 'from-blue-500 via-purple-500 to-pink-500'} bg-clip-text text-transparent mb-2`}>
                Dashboard
              </h1>
              <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Track your blog's performance and engagement
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Posts */}
            <div className={`group ${theme === 'light' ? 'bg-white/95' : 'bg-slate-800/95'} backdrop-blur-sm border-2 ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${theme === 'light' ? 'from-blue-50 to-blue-100' : 'from-blue-900/30 to-blue-800/20'} shadow-inner`}>
                    <FileText className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shadow-sm ${
                    userStats?.postsChange >= 0
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/20 dark:text-green-400'
                      : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 dark:from-red-900/30 dark:to-pink-900/20 dark:text-red-400'
                  }`}>
                    {userStats?.postsChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(userStats?.postsChange || 0)}%
                  </div>
                </div>
                <h3 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-1`}>
                  {userStats?.totalPosts || 0}
                </h3>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} font-medium`}>
                  Total Posts
                </p>
                {userStats?.drafts > 0 && (
                  <p className={`text-xs ${theme === 'light' ? 'text-orange-600' : 'text-orange-400'} mt-2 font-semibold`}>
                    {userStats?.drafts} drafts pending
                  </p>
                )}
              </div>
            </div>

            {/* Likes */}
            <div className={`group ${theme === 'light' ? 'bg-white/95' : 'bg-slate-800/95'} backdrop-blur-sm border-2 ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${theme === 'light' ? 'from-red-50 to-pink-100' : 'from-red-900/30 to-pink-800/20'} shadow-inner`}>
                    <Heart className="w-6 h-6 text-red-500 fill-red-500/20" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shadow-sm ${
                    userStats?.likesChange >= 0
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/20 dark:text-green-400'
                      : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 dark:from-red-900/30 dark:to-pink-900/20 dark:text-red-400'
                  }`}>
                    {userStats?.likesChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(userStats?.likesChange || 0)}%
                  </div>
                </div>
                <h3 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-1`}>
                  {userStats?.totalLikes || 0}
                </h3>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} font-medium`}>
                  Total Likes
                </p>
              </div>
            </div>

            {/* Comments */}
            <div className={`group ${theme === 'light' ? 'bg-white/95' : 'bg-slate-800/95'} backdrop-blur-sm border-2 ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${theme === 'light' ? 'from-green-50 to-emerald-100' : 'from-green-900/30 to-emerald-800/20'} shadow-inner`}>
                    <MessageCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shadow-sm ${
                    userStats?.commentsChange >= 0
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/20 dark:text-green-400'
                      : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 dark:from-red-900/30 dark:to-pink-900/20 dark:text-red-400'
                  }`}>
                    {userStats?.commentsChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(userStats?.commentsChange || 0)}%
                  </div>
                </div>
                <h3 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-1`}>
                  {userStats?.totalComments || 0}
                </h3>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} font-medium`}>
                  Total Comments
                </p>
              </div>
            </div>

            {/* Followers */}
            <div className={`group ${theme === 'light' ? 'bg-white/95' : 'bg-slate-800/95'} backdrop-blur-sm border-2 ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${theme === 'light' ? 'from-purple-50 to-pink-100' : 'from-purple-900/30 to-pink-800/20'} shadow-inner`}>
                    <Users className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shadow-sm ${
                    userStats?.followersChange >= 0
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/20 dark:text-green-400'
                      : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 dark:from-red-900/30 dark:to-pink-900/20 dark:text-red-400'
                  }`}>
                    {userStats?.followersChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(userStats?.followersChange || 0)}%
                  </div>
                </div>
                <h3 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-1`}>
                  {userStats?.followers || 0}
                </h3>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} font-medium`}>
                  Followers
                </p>
              </div>
            </div>
          </div>

          {/* Top Post & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Top Post */}
            <div className={`lg:col-span-2 ${theme === 'light' ? 'bg-white/95' : 'bg-slate-800/95'} backdrop-blur-sm border-2 ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-orange-500/5 to-transparent"></div>
              {topUserPost && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                    <Award className="w-3 h-3" />
                    Top Post
                  </span>
                </div>
              )}
              
              <div className="mb-4 relative z-10">
                <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-1`}>
                  Top Performing Post
                </h2>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Your best content this month
                </p>
              </div>

              {topUserPost ? (
                <div className={`relative z-10 ${theme === 'light' ? 'bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 border-yellow-200' : 'bg-gradient-to-br from-yellow-900/10 via-orange-900/10 to-yellow-900/5 border-yellow-900/30'} border-2 rounded-xl p-5 shadow-inner`}>
                  <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-2`}>
                    {topUserPost.title}
                  </h3>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-3`}>
                    {topUserPost.content?.substring(0, 150)}...
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {topUserPost.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 bg-gradient-to-r ${theme === 'light' ? 'from-blue-50 to-purple-50 text-blue-700 border border-blue-200' : 'from-blue-900/20 to-purple-900/20 text-blue-400 border border-blue-800'} text-xs font-medium rounded-full shadow-sm`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className={`text-center p-3 ${theme === 'light' ? 'bg-white/80' : 'bg-slate-800/50'} rounded-xl backdrop-blur-sm shadow-sm`}>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className={`text-lg font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {topUserPost.likescount || 0}
                        </span>
                      </div>
                      <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Likes</span>
                    </div>
                    <div className={`text-center p-3 ${theme === 'light' ? 'bg-white/80' : 'bg-slate-800/50'} rounded-xl backdrop-blur-sm shadow-sm`}>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <MessageCircle className="w-4 h-4 text-green-500" />
                        <span className={`text-lg font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {topUserPost.comments_count || 0}
                        </span>
                      </div>
                      <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Comments</span>
                    </div>
                    <div className={`text-center p-3 ${theme === 'light' ? 'bg-white/80' : 'bg-slate-800/50'} rounded-xl backdrop-blur-sm shadow-sm`}>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Eye className="w-4 h-4 text-blue-500" />
                        <span className={`text-lg font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {topUserPost.views || "N/A"}
                        </span>
                      </div>
                      <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Views</span>
                    </div>
                  </div>
                  <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} pt-2 border-t ${theme === 'light' ? 'border-yellow-200' : 'border-yellow-900/30'}`}>
                    Published {formatDate(topUserPost.createdat)}
                  </p>
                </div>
              ) : (
                <div className={`relative z-10 ${theme === 'light' ? 'bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 border-yellow-200' : 'bg-gradient-to-br from-yellow-900/10 via-orange-900/10 to-yellow-900/5 border-yellow-900/30'} border-2 rounded-xl p-5 shadow-inner text-center`}>
                  <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>No top post yet. Create some content!</p>
                </div>
              )}
            </div>

            {/* Activity */}
            <div className={`${theme === 'light' ? 'bg-white/95' : 'bg-slate-800/95'} backdrop-blur-sm border-2 ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    Recent Activity
                  </h2>
                  <button className={`text-sm ${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'} font-medium transition-colors`}>
                    View all
                  </button>
                </div>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-xl ${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-700/50'} transition-all duration-200`}
                    >
                      <img
                        src={activity.avatar}
                        alt={activity.user}
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {activity.user}
                        </p>
                        <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} truncate`}>
                          {activity.action}
                          {activity.post && ` "${activity.post}"`}
                        </p>
                        <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'} mt-0.5`}>
                          {activity.time}
                        </p>
                      </div>
                      <div className={`p-2 rounded-lg shadow-sm ${
                        activity.type === "like"
                          ? 'bg-gradient-to-br from-red-100 to-pink-100 text-red-600 dark:from-red-900/30 dark:to-pink-900/20 dark:text-red-400'
                          : activity.type === "comment"
                          ? 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-600 dark:from-green-900/30 dark:to-emerald-900/20 dark:text-green-400'
                          : 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 dark:from-purple-900/30 dark:to-pink-900/20 dark:text-purple-400'
                      }`}>
                        {activity.type === "like" && <Heart className="w-4 h-4" />}
                        {activity.type === "comment" && <MessageCircle className="w-4 h-4" />}
                        {activity.type === "follow" && <Users className="w-4 h-4" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => navigate("/create")}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Write New Post
            </button>
            <button
              onClick={() => navigate("/profile")}
              className={`flex items-center gap-2 px-6 py-3 ${theme === 'light' ? 'bg-white text-gray-700 border-gray-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50' : 'bg-slate-800 text-gray-300 border-slate-700 hover:border-blue-500 hover:text-blue-400 hover:bg-blue-900/20'} border-2 font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95`}
            >
              <Eye className="w-5 h-5" />
              View All Posts
            </button>
            {userStats?.drafts > 0 && (
              <button
                onClick={() => navigate("/create")}
                className={`flex items-center gap-2 px-6 py-3 ${theme === 'light' ? 'bg-gradient-to-r from-orange-50 to-yellow-50 text-orange-600 border-orange-300 hover:from-orange-100 hover:to-yellow-100' : 'bg-gradient-to-r from-orange-900/20 to-yellow-900/20 text-orange-400 border-orange-600 hover:from-orange-900/30 hover:to-yellow-900/30'} border-2 font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95`}
              >
                <FileText className="w-5 h-5" />
                Drafts ({userStats?.drafts})
              </button>
            )}
          </div>

          {/* Recent Posts */}
          <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700'} border-2 rounded-2xl overflow-hidden`}>
            <div className={`px-6 py-4 border-b ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-slate-700 bg-slate-900'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    Recent Posts
                  </h2>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mt-0.5`}>
                    Manage your published content
                  </p>
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
                    <th className={`px-6 py-3 text-left text-xs font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} uppercase`}>
                      Post Title
                    </th>
                    <th className={`px-6 py-3 text-center text-xs font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} uppercase`}>
                      Engagement
                    </th>
                    <th className={`px-6 py-3 text-center text-xs font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} uppercase`}>
                      Views
                    </th>
                    <th className={`px-6 py-3 text-center text-xs font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} uppercase`}>
                      Published
                    </th>
                    <th className={`px-6 py-3 text-right text-xs font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} uppercase`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${theme === 'light' ? 'divide-gray-200' : 'divide-slate-700'}`}>
                  {userPosts.map((post) => (
                    <tr
                      key={post.id}
                      className={`${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-slate-900/50'} transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <button
                            onClick={() => handleViewPost(post.id)}
                            className={`${theme === 'light' ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-400'} font-medium transition-colors text-left`}
                          >
                            {post.title}
                          </button>
                          {post.trending && ( // Assuming 'trending' property exists or can be derived
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold rounded-full mt-1">
                              <TrendingUp className="w-3 h-3" />
                              Trending
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-4">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              {post.likescount || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4 text-green-500" />
                            <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              {post.comments_count || 0}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <Eye className="w-4 h-4 text-blue-500" />
                          <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            {post.views || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-center text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                        {formatDate(post.createdat)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleViewPost(post.id)}
                            className={`p-2 ${theme === 'light' ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-700'} rounded-lg transition-colors`}
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditPost(post.id)}
                            className={`p-2 ${theme === 'light' ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-700'} rounded-lg transition-colors`}
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className={`p-2 ${theme === 'light' ? 'text-gray-600 hover:bg-red-50 hover:text-red-600' : 'text-gray-400 hover:bg-red-900/20 hover:text-red-400'} rounded-lg transition-colors`}
                            title="Delete"
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
              {userPosts.map((post) => (
                <div key={post.id} className="p-4">
                  <div className="mb-3">
                    <button
                      onClick={() => handleViewPost(post.id)}
                      className={`text-base font-semibold ${theme === 'light' ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-400'} transition-colors text-left mb-1`}
                    >
                      {post.title}
                    </button>
                    {post.trending && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        Trending
                      </span>
                    )}
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mt-1`}>
                      {formatDate(post.createdat)}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className={`text-center p-2 ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-700/50'} rounded-lg`}>
                      <div className="flex items-center justify-center gap-1 mb-0.5">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {post.likescount || 0}
                        </span>
                      </div>
                      <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                        Likes
                      </span>
                    </div>
                    <div className={`text-center p-2 ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-700/50'} rounded-lg`}>
                      <div className="flex items-center justify-center gap-1 mb-0.5">
                        <MessageCircle className="w-4 h-4 text-green-500" />
                        <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {post.comments_count || 0}
                        </span>
                      </div>
                      <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                        Comments
                      </span>
                    </div>
                    <div className={`text-center p-2 ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-700/50'} rounded-lg`}>
                      <div className="flex items-center justify-center gap-1 mb-0.5">
                        <Eye className="w-4 h-4 text-blue-500" />
                        <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {post.views || "N/A"}
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
                      className={`flex-1 px-3 py-2 text-sm ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'} rounded-lg font-medium flex items-center justify-center gap-1`}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleEditPost(post.id)}
                      className={`flex-1 px-3 py-2 text-sm ${theme === 'light' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30'} rounded-lg font-medium flex items-center justify-center gap-1`}
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className={`px-3 py-2 text-sm ${theme === 'light' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-red-900/20 text-red-400 hover:bg-red-900/30'} rounded-lg flex items-center justify-center`}
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
  );
}
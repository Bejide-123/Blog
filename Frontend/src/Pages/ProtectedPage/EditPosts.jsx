import { useState, useEffect } from "react";
import {
  FileText,
  Edit,
  Trash2,
  PlusCircle,
  Eye,
  Filter,
  Calendar,
} from "lucide-react";
import NavbarPrivate from "../../Components/Private/Navbarprivate";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "../../Components/Private/Loader";
import { useTheme } from "../../Context/themeContext";

export default function EditPostsPage() {
  const { theme } = useTheme();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
    // Mock data for posts
    setPosts([
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
        status: "draft",
        trending: false,
      },
    ]);
  }, []);

  const navigate = useNavigate();

  const handleEditPost = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      // API call to delete post
      setPosts(posts.filter((post) => post.id !== postId));
    }
  };

  const handleViewPost = (postId) => {
    navigate(`/post/${postId}`);
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
              <div className={`relative ${theme === 'light' ? 'bg-white/95' : 'bg-slate-800/95'} backdrop-blur-lg border ${theme === 'light' ? 'border-gray-200/50' : 'border-slate-700/50'} rounded-2xl p-6 mb-8 shadow-lg`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${theme === 'light' ? 'from-blue-600 to-purple-600' : 'from-blue-500 to-purple-500'} bg-clip-text text-transparent`}>
                      Edit Posts
                    </h1>
                    <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-sm mt-1`}>
                      Manage and edit your posts
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className={`flex items-center gap-2 px-4 py-2.5 ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'} rounded-xl transition-all`}>
                      <Filter className="w-4 h-4" />
                      <span className="font-medium">Filters</span>
                    </button>
                    <button
                      onClick={() => navigate("/create")}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      <PlusCircle className="w-5 h-5" />
                      New Post
                    </button>
                  </div>
                </div>
              </div>
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} shadow-lg overflow-hidden`}>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${theme === 'light' ? 'bg-gray-50' : 'bg-slate-900'}`}>
                      <tr>
                        <th className={`px-6 py-4 text-left text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} uppercase tracking-wider`}>
                          Post Title
                        </th>
                        <th className={`px-6 py-4 text-center text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} uppercase tracking-wider`}>
                          Status
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
                      {posts.map((post) => (
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
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                post.status === "published"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {post.status}
                            </span>
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
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
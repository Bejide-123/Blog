// src/pages/SearchResults.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  FiSearch,
  FiFilter,
  FiHash,
  FiUser,
  FiFileText,
  FiClock,
  FiHeart,
  FiMessageCircle,
  FiBookmark,
  FiTrendingUp,
  FiZap,
  FiUsers,
  FiChevronDown,
  FiX,
  FiCalendar,
  FiEye,
  FiCheck,
  FiPlus,
  FiMapPin,
  FiBriefcase,
  FiLink,
  FiGlobe,
  FiLock,
  FiStar,
  FiTrendingUp as FiTrendingUpIcon,
  FiShare2,
  FiExternalLink,
  FiMessageSquare
} from 'react-icons/fi';
import { 
  getPublicPosts,
  togglePostLike,
  toggleSavePost,
  getUserLikedPosts,
  getUserSavedPosts,
  searchUsers,
  searchTags
} from '../../Services/post';
import { getUserStats } from '../../Services/user';
import { useUser } from '../../Context/userContext';
import { useTheme } from '../../Context/themeContext';
import { Heart, MessageCircle, Bookmark, Zap, Hash, User, Check, Plus, TrendingUp, Clock, Eye, ThumbsUp, Share2, ExternalLink, Globe, Lock, Star } from 'lucide-react';
import NavbarPrivate from '../../Components/Private/Navbarprivate';

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useUser();
  
  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [loading, setLoading] = useState(false);
  
  // Search results
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [followedUsers, setFollowedUsers] = useState(new Set());
  
  // New state for collapsible header
  const [showSearchHeader, setShowSearchHeader] = useState(false);
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    hasMore: false
  });

  // Parse search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    const type = params.get('type') || 'all';
    const sort = params.get('sort') || 'relevance';
    
    setSearchQuery(query);
    setSearchType(type);
    setSortBy(sort);
    
    if (query.trim()) {
      performSearch(query, type, sort);
    }
  }, [location.search]);

  // Fetch user data
  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      if (!user?.id) return;
      
      // Fetch liked posts
      const likedPostIds = await getUserLikedPosts(user.id);
      setLikedPosts(new Set(likedPostIds));
      
      // Fetch saved posts
      const savedPostIds = await getUserSavedPosts(user.id);
      setSavedPosts(new Set(savedPostIds));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const performSearch = async (query, type = 'all', sort = 'relevance', page = 1) => {
    if (!query.trim()) return;
    
    setLoading(true);
    
    try {
      let sortOptions = {};
      switch (sort) {
        case 'latest':
          sortOptions = { sortBy: 'createdat', sortOrder: 'desc' };
          break;
        case 'popular':
          sortOptions = { sortBy: 'likescount', sortOrder: 'desc' };
          break;
        default:
          sortOptions = { sortBy: 'createdat', sortOrder: 'desc' };
      }
      
      const offset = (page - 1) * pagination.limit;
      
      // Smart search detection
      const hasAtSymbol = query.trim().startsWith('@');
      const hasHashSymbol = query.trim().startsWith('#');
      
      // Auto-detect search type if not specified
      let detectedType = type;
      if (type === 'all') {
        if (hasAtSymbol) detectedType = 'users';
        else if (hasHashSymbol) detectedType = 'tags';
      }
      
      // Perform search based on type
      if (detectedType === 'all' || detectedType === 'posts') {
        const postsData = await getPublicPosts({
          ...sortOptions,
          limit: pagination.limit,
          offset: offset,
        });
        
        // Clean the query for searching (remove @ and # for better results)
        const cleanQuery = query.replace(/^[@#]/, '');
        const filteredPosts = postsData.posts.filter(post => 
          post.title.toLowerCase().includes(cleanQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(cleanQuery.toLowerCase()) ||
          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(cleanQuery.toLowerCase())))
        );
        
        if (page === 1) {
          setPosts(filteredPosts);
        } else {
          setPosts(prev => [...prev, ...filteredPosts]);
        }
        
        setPagination(prev => ({
          ...prev,
          page,
          total: filteredPosts.length,
          hasMore: filteredPosts.length === pagination.limit
        }));
      }
      
      if (detectedType === 'all' || detectedType === 'users') {
        // Clean query for user search (remove @ symbol)
        const cleanQuery = query.replace(/^@/, '');
        const usersData = await searchUsers(cleanQuery);
        
        // Fetch stats for each user (same as ProfilePage does)
        const usersWithStats = await Promise.all(
          usersData.map(async (userProfile) => {
            try {
              const stats = await getUserStats(userProfile.id);
              return {
                ...userProfile,
                posts_count: stats.posts || 0,
                followers_count: stats.followers || 0,
                following_count: stats.following || 0
              };
            } catch (error) {
              console.error(`Error fetching stats for user ${userProfile.id}:`, error);
              return {
                ...userProfile,
                posts_count: 0,
                followers_count: 0,
                following_count: 0
              };
            }
          })
        );
        
        setUsers(usersWithStats);
      }
      
      if (detectedType === 'all' || detectedType === 'tags') {
        // Clean query for tag search (remove # symbol)
        const cleanQuery = query.replace(/^#/, '');
        const tagsData = await searchTags(cleanQuery);
        setTags(tagsData);
      }
      
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}&sort=${sortBy}`);
    }
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${type}&sort=${sortBy}`);
    }
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}&sort=${sort}`);
    }
  };

  const handleLike = async (postId) => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    
    try {
      const { liked, count } = await togglePostLike(postId, user.id);
      
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (liked) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });
      
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, likescount: count || 0 } 
            : post
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSave = async (postId) => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    
    try {
      const { saved } = await toggleSavePost(postId, user.id);
      
      setSavedPosts(prev => {
        const newSet = new Set(prev);
        if (saved) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const handleFollow = (userId) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

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

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    const numberValue = Number(num);
    if (isNaN(numberValue)) return '0';
    if (numberValue >= 1000000) return (numberValue / 1000000).toFixed(1) + 'M';
    if (numberValue >= 1000) return (numberValue / 1000).toFixed(1) + 'K';
    return numberValue.toString();
  };

  const searchTypes = [
    { id: 'all', label: 'All', icon: <FiSearch className="w-4 h-4" />, count: posts.length + users.length + tags.length },
    { id: 'posts', label: 'Posts', icon: <FiFileText className="w-4 h-4" />, count: posts.length },
    { id: 'users', label: 'Users', icon: <FiUser className="w-4 h-4" />, count: users.length },
    { id: 'tags', label: 'Tags', icon: <FiHash className="w-4 h-4" />, count: tags.length },
  ];

  const sortOptions = [
    { id: 'relevance', label: 'Most Relevant', icon: <Star className="w-4 h-4" /> },
    { id: 'latest', label: 'Latest', icon: <Clock className="w-4 h-4" /> },
    { id: 'popular', label: 'Most Popular', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  // Smart result ordering
  const hasPosts = posts.length > 0;
  const hasUsers = users.length > 0;
  const hasTags = tags.length > 0;

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-900'}`}>
      <NavbarPrivate />
      
      <div className="pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 pb-24">
          
          {/* Mobile Toggle - Only show on small screens */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowSearchHeader(!showSearchHeader)}
              className={`w-full flex items-center justify-between px-4 py-3 ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700'} border-2 rounded-xl shadow-sm transition-all`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${showSearchHeader ? 'bg-blue-500/10' : theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'}`}>
                  <FiSearch className={`w-5 h-5 ${showSearchHeader ? 'text-blue-500' : 'text-gray-500'}`} />
                </div>
                <div className="text-left">
                  <h3 className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    Search Options
                  </h3>
                  <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {showSearchHeader ? 'Hide' : 'Show'} filters
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${theme === 'light' ? 'bg-blue-50 text-blue-600' : 'bg-blue-900/30 text-blue-400'}`}>
                {posts.length + users.length + tags.length}
              </span>
            </button>
          </div>

          {/* Enhanced Header */}
          <div className={`${showSearchHeader ? 'block' : 'hidden'} lg:block mb-8 animate-in fade-in slide-in-from-top-4 duration-300`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-4 rounded-2xl ${theme === 'light' ? 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100' : 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/30'} shadow-lg`}>
                    <FiSearch className={`w-10 h-10 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
                  </div>
                  <div>
                    <h1 className={`text-3xl md:text-4xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-1`}>
                      Search Results
                    </h1>
                    <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-sm`}>
                      Discover posts, users, and topics
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className={`flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r ${theme === 'light' ? 'from-blue-50 to-purple-50 border border-blue-100' : 'from-blue-900/20 to-purple-900/20 border border-blue-800/30'} rounded-xl shadow-sm`}>
                    <Zap className={`w-4 h-4 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
                    <span className={`font-semibold text-sm ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
                      {posts.length + users.length + tags.length} results
                    </span>
                  </div>
                  
                  {searchQuery && (
                    <div className={`flex items-center gap-2 px-4 py-2.5 ${theme === 'light' ? 'bg-gray-100 border border-gray-200' : 'bg-slate-800 border border-slate-700'} rounded-xl shadow-sm`}>
                      <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        "{searchQuery}"
                      </span>
                      <button
                        onClick={() => setSearchQuery('')}
                        className={`p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors`}
                      >
                        <FiX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Search Bar */}
              <div className="w-full lg:w-96">
                <div className="relative">
                  <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'light' ? 'text-gray-400' : 'text-slate-500'}`} />
                  <form onSubmit={handleSearchSubmit}>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="@username, #topic, keywords..."
                      className={`w-full pl-12 pr-12 py-3.5 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-slate-800 border-slate-700 text-white'} border-2 rounded-2xl focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:ring-blue-500/50 focus:border-blue-500' : 'focus:ring-blue-400/50 focus:border-blue-400'} transition-all shadow-sm`}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 ${theme === 'light' ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700'} rounded-lg transition-colors`}
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    )}
                  </form>
                </div>
              </div>
            </div>

            {/* Filter Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {searchTypes.map((type, idx) => (
                <div 
                  key={type.id}
                  onClick={() => {
                    handleSearchTypeChange(type.id);
                    if (window.innerWidth < 1024) setShowSearchHeader(false);
                  }}
                  className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border-2 p-4 cursor-pointer transition-all hover:scale-105 hover:shadow-xl animate-in fade-in slide-in-from-bottom-4 ${
                    searchType === type.id 
                      ? 'border-blue-500 shadow-lg ring-2 ring-blue-500/20' 
                      : `${theme === 'light' ? 'border-gray-200 hover:border-gray-300' : 'border-slate-700 hover:border-slate-600'}`
                  }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${
                      searchType === type.id
                        ? `${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/30'}`
                        : `${theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'}`
                    }`}>
                      {React.cloneElement(type.icon, { 
                        className: `w-5 h-5 ${
                          searchType === type.id
                            ? `${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`
                            : `${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`
                        }` 
                      })}
                    </div>
                    {searchType === type.id && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    )}
                  </div>
                  <p className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-1`}>
                    {type.count}
                  </p>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{type.label}</p>
                </div>
              ))}
            </div>

            {/* Sort Bar */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700'} border-2 rounded-2xl p-4 shadow-sm`}>
              <div className="flex items-center gap-2">
                <FiFilter className={`w-5 h-5 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                <span className={`font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Sort by:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSortChange(option.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      sortBy === option.id
                        ? `bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105`
                        : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-100 border border-gray-200' : 'text-gray-300 hover:bg-slate-700 border border-slate-700'}`
                    }`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            
            {/* Sidebar - Desktop Only */}
            <div className="hidden lg:block">
              <div className="sticky top-28 space-y-4">
                <div className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700'} rounded-2xl border-2 p-4 shadow-sm`}>
                  <h3 className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-3 flex items-center gap-2`}>
                    <FiFilter className="w-5 h-5" />
                    Search Types
                  </h3>
                  <div className="space-y-2">
                    {searchTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleSearchTypeChange(type.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          searchType === type.id
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                            : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-slate-700'}`
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {type.icon}
                          {type.label}
                        </div>
                        {type.count > 0 && (
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            searchType === type.id
                              ? 'bg-white/20'
                              : `${theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'}`
                          }`}>
                            {type.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              {loading && (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Searching...</p>
                  </div>
                </div>
              )}

              {!loading && searchQuery && (
                <div className="space-y-8">
                  {/* Users */}
                  {(searchQuery.startsWith('@') || hasUsers) && (searchType === 'all' || searchType === 'users') && hasUsers && (
                    <div>
                      <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-6`}>
                        Users ({users.length})
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map((userProfile) => {
                          const isFollowing = followedUsers.has(userProfile.id);
                          return (
                            <div
                              key={userProfile.id}
                              className={`${theme === 'light' ? 'bg-white hover:shadow-2xl' : 'bg-slate-800 hover:shadow-slate-900/50'} rounded-2xl border-2 ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} p-6 transition-all duration-300 hover:-translate-y-2`}
                            >
                              <div className="flex flex-col items-center text-center mb-4">
                                <img
                                  src={userProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.username}`}
                                  alt={userProfile.full_name}
                                  className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-800 shadow-lg mb-4"
                                />
                                <h3 className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-lg mb-1`}>
                                  {userProfile.full_name || userProfile.username}
                                </h3>
                                <p className={`text-sm ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'} font-medium mb-3`}>
                                  @{userProfile.username}
                                </p>
                              </div>

                              <div className="grid grid-cols-3 gap-2 mb-4">
                                {['posts_count', 'followers_count', 'following_count'].map((key, idx) => (
                                  <div key={idx} className={`text-center p-2 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-700/50'}`}>
                                    <div className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                      {formatNumber(userProfile[key] || 0)}
                                    </div>
                                    <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                      {key.replace('_count', '').replace('_', ' ')}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {userProfile.bio && (
                                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} mb-4 text-center line-clamp-2`}>
                                  {userProfile.bio}
                                </p>
                              )}

                              <div className="flex gap-2">
                                <button
                                  onClick={() => navigate(`/profile/${userProfile.id}`)}
                                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                                >
                                  View Profile
                                </button>
                                <button
                                  onClick={() => handleFollow(userProfile.id)}
                                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                                    isFollowing
                                      ? `${theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-slate-700 text-gray-300'}`
                                      : `${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'}`
                                  }`}
                                >
                                  {isFollowing ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {(searchQuery.startsWith('#') || hasTags) && (searchType === 'all' || searchType === 'tags') && hasTags && (
                    <div>
                      <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-6`}>
                        Tags ({tags.length})
                      </h2>
                      <div className="flex flex-wrap gap-3">
                        {tags.map((tagObj, index) => (
                          <button
                            key={index}
                            onClick={() => navigate(`/tag/${tagObj.tag}`)}
                            className={`flex items-center gap-3 px-5 py-4 ${theme === 'light' ? 'bg-white hover:bg-gray-50 border-gray-200' : 'bg-slate-800 hover:bg-slate-700 border-slate-700'} border-2 rounded-2xl transition-all hover:scale-105 hover:shadow-xl`}
                          >
                            <div className={`p-3 ${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'} rounded-lg`}>
                              <Hash className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                              <span className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-lg`}>
                                #{tagObj.tag}
                              </span>
                              <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                {tagObj.count} posts
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Posts */}
                  {!searchQuery.startsWith('@') && !searchQuery.startsWith('#') && hasPosts && (searchType === 'all' || searchType === 'posts') && (
                    <div>
                      <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-6`}>
                        Posts ({posts.length})
                      </h2>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {posts.map((post) => {
                          const isLiked = likedPosts.has(post.id);
                          const isSaved = savedPosts.has(post.id);

                          return (
                            <article
                              key={post.id}
                              className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border-2 ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer`}
                              onClick={() => navigate(`/post/${post.id}`)}
                            >
                              <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                  <img
                                    src={post.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.username || 'anonymous'}`}
                                    alt={post.author?.full_name}
                                    className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800"
                                  />
                                  <div>
                                    <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-sm`}>
                                      {post.author?.full_name || 'Anonymous'}
                                    </h3>
                                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                      @{post.author?.username || 'anonymous'} • {formatDate(post.createdat)}
                                    </p>
                                  </div>
                                </div>

                                <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-3 line-clamp-2`}>
                                  {post.title}
                                </h3>
                                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} text-sm line-clamp-3 mb-4`}>
                                  {post.content}
                                </p>

                                {post.tags && post.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {post.tags.slice(0, 3).map((tag, index) => (
                                      <span key={index} className={`px-3 py-1 bg-gradient-to-r ${theme === 'light' ? 'from-blue-50 to-purple-50 text-blue-700' : 'from-blue-900/20 to-purple-900/20 text-blue-400'} text-xs font-medium rounded-full`}>
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                                  <div className={`flex items-center gap-4 text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    <span className="flex items-center gap-1">
                                      <FiHeart className="w-4 h-4" /> {post.likescount || 0}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <FiMessageCircle className="w-4 h-4" /> {post.comments_count || 0}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleLike(post.id);
                                      }}
                                      className={`p-2 rounded-lg transition-colors ${
                                        isLiked ? `${theme === 'light' ? 'text-red-600 bg-red-50' : 'text-red-400 bg-red-900/20'}` : `${theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-700'}`
                                      }`}
                                    >
                                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSave(post.id);
                                      }}
                                      className={`p-2 rounded-lg transition-colors ${
                                        isSaved ? `${theme === 'light' ? 'text-yellow-600 bg-yellow-50' : 'text-yellow-400 bg-yellow-900/20'}` : `${theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-slate-700'}`
                                      }`}
                                    >
                                      <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {searchQuery && !hasPosts && !hasUsers && !hasTags && (
                    <div className={`text-center py-20 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border-2 ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}`}>
                      <FiSearch className={`w-16 h-16 mx-auto ${theme === 'light' ? 'text-gray-300' : 'text-slate-600'} mb-4`} />
                      <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-2`}>
                        No results found
                      </h3>
                      <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-6`}>
                        Try different keywords or check your spelling
                      </p>
                      <button
                        onClick={() => navigate('/home')}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg"
                      >
                        Browse Feed
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Search Prompt */}
              {!searchQuery && (
                <div className={`text-center py-20 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border-2 ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}`}>
                  <FiSearch className={`w-16 h-16 mx-auto ${theme === 'light' ? 'text-gray-300' : 'text-slate-600'} mb-4`} />
                  <h3 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-2`}>
                    Start Searching
                  </h3>
                  <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-6`}>
                    Search for posts, users (@username), or topics (#topic)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
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
    // Handle undefined or null values
    if (num === undefined || num === null) return '0';
    
    // Convert to number if it's a string
    const numberValue = Number(num);
    
    // Check if it's a valid number
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

  // Smart result ordering - show what has results first
  const hasPosts = posts.length > 0;
  const hasUsers = users.length > 0;
  const hasTags = tags.length > 0;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme === 'light' ? 'from-gray-50 via-white to-white' : 'from-slate-900 via-slate-900 to-slate-950'}`}>
      <NavbarPrivate />
      
      <div className="pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 md:py-8">
          {/* Mobile Toggle Button - Only show on small screens */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowSearchHeader(!showSearchHeader)}
              className={`w-full flex items-center justify-between px-4 py-3 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} rounded-xl shadow-sm transition-all duration-300`}
            >
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${showSearchHeader ? 'bg-blue-500/10' : theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'}`}>
                  {showSearchHeader ? (
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    Search Options
                  </h3>
                  <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {showSearchHeader ? 'Hide filters and stats' : 'Show filters and stats'}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-medium ${theme === 'light' ? 'bg-blue-50 text-blue-600' : 'bg-blue-900/30 text-blue-400'}`}>
                {posts.length + users.length + tags.length} results
              </span>
            </button>
          </div>

          {/* Enhanced Header - Hidden on mobile by default, togglable */}
          <div className={`${showSearchHeader ? 'block' : 'hidden'} lg:block mb-6 md:mb-8 transition-all duration-300`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30" />
                    <FiSearch className={`relative w-8 h-8 md:w-10 md:h-10 ${theme === 'light' ? 'text-blue-600' : 'text-blue-500'}`} />
                  </div>
                  <div>
                    <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r ${theme === 'light' ? 'from-blue-600 to-purple-600' : 'from-blue-500 to-purple-500'} bg-clip-text text-transparent`}>
                      Search Results
                    </h1>
                    <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-sm sm:text-base mt-1`}>
                      Find posts, users, and topics across the platform
                    </p>
                  </div>
                </div>

                {/* Quick Stats Bar - Mobile Optimized */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <div className={`flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r ${theme === 'light' ? 'from-blue-50 to-purple-50' : 'from-blue-900/20 to-purple-900/20'} rounded-lg sm:rounded-xl`}>
                    <Zap className={`w-3 h-3 sm:w-4 sm:h-4 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
                    <span className={`font-semibold text-sm sm:text-base ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
                      {posts.length + users.length + tags.length} results
                    </span>
                  </div>
                  
                  {searchQuery && (
                    <div className={`flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 ${theme === 'light' ? 'bg-gray-100' : 'bg-slate-800'} rounded-lg sm:rounded-xl`}>
                      <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        "{searchQuery}"
                      </span>
                      <button
                        onClick={() => setSearchQuery('')}
                        className={`p-0.5 ${theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Search Bar - Mobile Optimized */}
              <div className="w-full lg:w-96 mt-4 lg:mt-0">
                <div className="relative group">
                  <FiSearch className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${theme === 'light' ? 'text-gray-400 group-hover:text-blue-500' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`} />
                  <form onSubmit={handleSearchSubmit}>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="@username, #topic, or keywords..."
                      className={`w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400' : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'} border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:ring-blue-500/50 focus:border-blue-500' : 'focus:ring-blue-400/50 focus:border-blue-400'} transition-all`}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 ${theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-slate-500 hover:text-slate-300'} transition-colors`}
                      >
                        <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    )}
                  </form>
                </div>
              </div>
            </div>

            {/* Search Type Cards - Responsive Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8">
              {searchTypes.map((type) => (
                <div 
                  key={type.id}
                  onClick={() => {
                    handleSearchTypeChange(type.id);
                    // On mobile, close header after selecting filter
                    if (window.innerWidth < 1024) {
                      setShowSearchHeader(false);
                    }
                  }}
                  className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg sm:rounded-xl md:rounded-2xl border p-3 sm:p-4 cursor-pointer transition-all active:scale-95 md:hover:scale-105 md:hover:shadow-lg ${
                    searchType === type.id 
                      ? 'border-blue-500 shadow-lg' 
                      : `${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`p-1.5 sm:p-2 rounded-lg ${
                        searchType === type.id
                          ? `${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/30'}`
                          : `${theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'}`
                      }`}>
                        {React.cloneElement(type.icon, { 
                          className: `w-3 h-3 sm:w-4 sm:h-4 ${
                            searchType === type.id
                              ? `${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`
                              : `${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`
                          }` 
                        })}
                      </div>
                      <div>
                        <p className={`text-lg sm:text-xl md:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {type.count}
                        </p>
                        <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{type.label}</p>
                      </div>
                    </div>
                    {searchType === type.id && (
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Sort Options Bar */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} p-4 mb-6`}>
              <div className="flex items-center gap-2">
                <FiFilter className={`w-4 h-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                <span className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Sort by:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSortChange(option.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-medium text-sm transition-all active:scale-95 ${
                      sortBy === option.id
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                        : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`
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
            {/* Filters Sidebar - Hidden on mobile */}
            <div className="hidden lg:block space-y-4">
              <div className="sticky top-28 space-y-4">
                {/* Search Type Filters */}
                <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} p-4`}>
                  <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-3 flex items-center gap-2`}>
                    <FiFilter className="w-4 h-4" />
                    Search Types
                  </h3>
                  <div className="space-y-2">
                    {searchTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleSearchTypeChange(type.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
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
                              : `${theme === 'light' ? 'bg-gray-200 text-gray-600' : 'bg-slate-700 text-gray-300'}`
                          }`}>
                            {type.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Filters */}
                <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} p-4`}>
                  <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-3 flex items-center gap-2`}>
                    <TrendingUp className="w-4 h-4" />
                    Sort By
                  </h3>
                  <div className="space-y-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleSortChange(option.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          sortBy === option.id
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                            : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-slate-700'}`
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {option.icon}
                          {option.label}
                        </div>
                        {sortBy === option.id && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced Filters */}
                <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} p-4`}>
                  <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-3 flex items-center gap-2`}>
                    <FiGlobe className="w-4 h-4" />
                    Advanced Filters
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Verified only</span>
                      <button className="w-10 h-6 bg-blue-500 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Following only</span>
                      <button className="w-10 h-6 bg-gray-300 dark:bg-slate-600 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Include private</span>
                      <button className="w-10 h-6 bg-blue-500 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results List */}
            <div className="lg:col-span-3">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowSearchHeader(!showSearchHeader)}
                  className={`w-full flex items-center justify-between px-4 py-3 ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-slate-800 border-slate-700'} border rounded-xl active:scale-95 transition-transform`}
                >
                  <div className="flex items-center gap-2">
                    <FiFilter className="w-5 h-5" />
                    <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {searchTypes.find(f => f.id === searchType)?.label || 'All Results'}
                    </span>
                    <span className={`px-2 py-0.5 ${theme === 'light' ? 'bg-gray-200 text-gray-600' : 'bg-slate-700 text-gray-300'} rounded-full text-sm`}>
                      {posts.length + users.length + tags.length}
                    </span>
                  </div>
                  <FiChevronDown className={`w-5 h-5 transition-transform ${showSearchHeader ? 'rotate-180' : ''}`} />
                </button>

                {/* Mobile Sort Options */}
                <div className="mt-3">
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleSortChange(option.id)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg flex-shrink-0 text-sm font-medium transition-all active:scale-95 ${
                          sortBy === option.id
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                            : `${theme === 'light' ? 'text-gray-700 bg-gray-100 hover:bg-gray-200' : 'text-gray-300 bg-slate-700 hover:bg-slate-600'}`
                        }`}
                      >
                        {option.icon}
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className={`mt-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Searching...</p>
                  </div>
                </div>
              )}

              {/* Results - Smart Ordering */}
              {!loading && searchQuery && (
                <div className="space-y-8">
                  {/* Users Results First if that's what they're likely searching for */}
                  {(searchQuery.startsWith('@') || hasUsers) && (searchType === 'all' || searchType === 'users') && hasUsers && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          Users ({users.length})
                        </h2>
                        <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          Found {users.length} matching profiles
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map((userProfile) => {
                          const isFollowing = followedUsers.has(userProfile.id);
                          
                          return (
                            <div
                              key={userProfile.id}
                              className={`group ${theme === 'light' ? 'bg-white hover:shadow-xl' : 'bg-slate-800 hover:shadow-slate-900/50'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} p-6 transition-all duration-300 hover:-translate-y-1`}
                            >
                              <div className="flex flex-col items-center text-center mb-4">
                                <div className="relative mb-4">
                                  <img
                                    src={userProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.username}`}
                                    alt={userProfile.full_name}
                                    className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-800 shadow-lg"
                                  />
                                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                                </div>
                                
                                <h3 className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-lg mb-1`}>
                                  {userProfile.full_name || userProfile.username}
                                </h3>
                                <p className={`text-sm ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'} font-medium mb-3`}>
                                  @{userProfile.username}
                                </p>
                              </div>

                              {/* User Stats - Now using properly fetched stats */}
                              <div className="grid grid-cols-3 gap-2 mb-4">
                                <div className={`text-center p-2 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-700/50'}`}>
                                  <div className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                    {formatNumber(userProfile.posts_count || 0)}
                                  </div>
                                  <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Posts
                                  </div>
                                </div>
                                <div className={`text-center p-2 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-700/50'}`}>
                                  <div className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                    {formatNumber(userProfile.followers_count || 0)}
                                  </div>
                                  <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Followers
                                  </div>
                                </div>
                                <div className={`text-center p-2 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-700/50'}`}>
                                  <div className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                    {formatNumber(userProfile.following_count || 0)}
                                  </div>
                                  <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Following
                                  </div>
                                </div>
                              </div>

                              {/* User Info */}
                              {userProfile.bio && (
                                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} mb-4 text-center line-clamp-2`}>
                                  {userProfile.bio}
                                </p>
                              )}

                              {/* User Meta Info */}
                              <div className="space-y-2 mb-4">
                                {userProfile.location && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <FiMapPin className={`w-4 h-4 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                      {userProfile.location}
                                    </span>
                                  </div>
                                )}
                                {userProfile.website_url && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <FiLink className={`w-4 h-4 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <a 
                                      href={userProfile.website_url.startsWith('http') ? userProfile.website_url : `https://${userProfile.website_url}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`${theme === 'light' ? 'text-blue-600 hover:underline' : 'text-blue-400 hover:underline'}`}
                                    >
                                      {userProfile.website_url.length > 30 ? userProfile.website_url.substring(0, 30) + '...' : userProfile.website_url}
                                    </a>
                                  </div>
                                )}
                                {userProfile.created_at && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <FiCalendar className={`w-4 h-4 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                      Joined {new Date(userProfile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => navigate(`/profile/${userProfile.id}`)}
                                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                                >
                                  View Profile
                                </button>
                                <button
                                  onClick={() => handleFollow(userProfile.id)}
                                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                                    isFollowing
                                      ? `${theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-slate-700 text-gray-300'}`
                                      : `${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'}`
                                  }`}
                                >
                                  {isFollowing ? (
                                    <>
                                      <Check className="w-4 h-4" />
                                      Following
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-4 h-4" />
                                      Follow
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tags Results */}
                  {(searchQuery.startsWith('#') || hasTags) && (searchType === 'all' || searchType === 'tags') && hasTags && (
                    <div>
                      <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-6`}>
                        Tags ({tags.length})
                      </h2>
                      <div className="flex flex-wrap gap-3">
                        {tags.map((tagObj, index) => (
                          <button
                            key={index}
                            onClick={() => navigate(`/tag/${tagObj.tag}`)}
                            className={`group flex items-center gap-3 px-5 py-4 ${theme === 'light' ? 'bg-white hover:bg-gray-50' : 'bg-slate-800 hover:bg-slate-700'} border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                          >
                            <div className={`p-3 ${theme === 'light' ? 'bg-blue-50 group-hover:bg-blue-100' : 'bg-blue-900/20 group-hover:bg-blue-900/30'} rounded-lg`}>
                              <Hash className="w-6 h-6 text-blue-500" />
                            </div>
                            <div className="text-left">
                              <span className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-lg`}>
                                #{tagObj.tag}
                              </span>
                              <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                {tagObj.count} posts • Trending
                              </p>
                            </div>
                            <FiChevronDown className={`w-5 h-5 ml-4 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'} group-hover:text-blue-500 transform group-hover:rotate-90 transition-transform`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Posts Results - Only show if there are posts AND it's not a user/tag specific search */}
                  {!searchQuery.startsWith('@') && !searchQuery.startsWith('#') && hasPosts && (searchType === 'all' || searchType === 'posts') && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          Posts ({posts.length})
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {posts.map((post) => {
                          const isLiked = likedPosts.has(post.id);
                          const isSaved = savedPosts.has(post.id);

                          return (
                            <article
                              key={post.id}
                              className={`group relative ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer`}
                              onClick={() => navigate(`/post/${post.id}`)}
                            >
                              <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                  <img
                                    src={post.author?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.username || 'anonymous'}`}
                                    alt={post.author?.full_name || 'Anonymous'}
                                    className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} text-sm truncate`}>
                                      {post.author?.full_name || 'Anonymous'}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs">
                                      <span className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                        @{post.author?.username || 'anonymous'}
                                      </span>
                                      <span className={`${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>•</span>
                                      <span className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                        {formatDate(post.createdat)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-500'} mb-3 transition-colors line-clamp-2`}>
                                  {post.title}
                                </h3>
                                
                                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} text-sm line-clamp-3 mb-4`}>
                                  {post.content}
                                </p>

                                {post.tags && post.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {post.tags.slice(0, 3).map((tag, index) => (
                                      <span
                                        key={index}
                                        className={`px-3 py-1 bg-gradient-to-r ${theme === 'light' ? 'from-blue-50 to-purple-50 text-blue-700' : 'from-blue-900/20 to-purple-900/20 text-blue-400'} text-xs font-medium rounded-full`}
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                                  <div className={`flex items-center gap-4 text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    <div className="flex items-center gap-1">
                                      <FiHeart className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
                                      <span>{post.likescount || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <FiMessageCircle className="w-4 h-4" />
                                      <span>{post.comments_count || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <FiClock className="w-4 h-4" />
                                      <span>{post.read_time || 5} min</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleLike(post.id);
                                      }}
                                      className={`p-2 rounded-lg transition-colors ${
                                        isLiked
                                          ? `${theme === 'light' ? 'text-red-600 bg-red-50' : 'text-red-400 bg-red-900/20'}`
                                          : `${theme === 'light' ? 'text-gray-500 hover:text-red-500 hover:bg-gray-100' : 'text-gray-400 hover:text-red-400 hover:bg-slate-700'}`
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
                                        isSaved
                                          ? `${theme === 'light' ? 'text-yellow-600 bg-yellow-50' : 'text-yellow-400 bg-yellow-900/20'}`
                                          : `${theme === 'light' ? 'text-gray-500 hover:text-yellow-500 hover:bg-gray-100' : 'text-gray-400 hover:text-yellow-400 hover:bg-slate-700'}`
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
                    <div className={`text-center py-16 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}`}>
                      <FiSearch className={`w-16 h-16 mx-auto ${theme === 'light' ? 'text-gray-300' : 'text-slate-600'} mb-4`} />
                      <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-2`}>
                        No results found
                      </h3>
                      <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-6 max-w-md mx-auto`}>
                        We couldn't find any results for "{searchQuery}". Try different keywords or check your spelling.
                      </p>
                      <div className="space-x-4">
                        <button
                          onClick={() => navigate('/home')}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors"
                        >
                          Browse Feed
                        </button>
                        <button
                          onClick={() => navigate('/create')}
                          className="px-6 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 font-semibold rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          Create Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Search Prompt */}
              {!searchQuery && (
                <div className={`text-center py-16 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}`}>
                  <FiSearch className={`w-16 h-16 mx-auto ${theme === 'light' ? 'text-gray-300' : 'text-slate-600'} mb-4`} />
                  <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-2`}>
                    Start Searching
                  </h3>
                  <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-6 max-w-md mx-auto`}>
                    Search for posts, users (@username), or topics (#topic)
                  </p>
                  <div className="space-y-4 max-w-md mx-auto">
                    <div className={`p-4 ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-700/50'} rounded-xl text-left`}>
                      <p className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-1`}>
                        Search tips:
                      </p>
                      <ul className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} space-y-1`}>
                        <li>• <span className="font-semibold">@username</span> - Search for specific users</li>
                        <li>• <span className="font-semibold">#topic</span> - Search for topics or tags</li>
                        <li>• <span className="font-semibold">"exact phrase"</span> - For exact matches</li>
                        <li>• Try different search filters for better results</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
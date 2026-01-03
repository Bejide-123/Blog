import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Repeat2,
  TrendingUp,
  CheckCircle,
  X,
  Settings,
  Trash2,
  EyeOff,
  Bookmark,
  Sparkles,
  Clock,
  Zap,
  ExternalLink,
  Filter,
  ChevronDown,
  MoreHorizontal,
  AlertCircle,
  Star,
  CheckCheck,
  Volume2,
  VolumeX,
  Mail,
  Users,
  Target,
  Trophy,
  MessageSquare,
  ThumbsUp,
  Share2,
  Eye,
  TrendingUp as TrendingUpIcon,
  Search,
  RotateCcw,
  Calendar,
  Hash,
  Globe,
  Lock
} from 'lucide-react'
import NavbarPrivate from '../../Components/Private/Navbarprivate'
import { PageLoader } from '../../Components/Private/Loader'
import { useTheme } from '../../Context/themeContext'

const Notifications = () => {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedNotifications, setSelectedNotifications] = useState(new Set())
  const [selectMode, setSelectMode] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef(1)

  // Add state for mobile header visibility
  const [showFeedHeader, setShowFeedHeader] = useState(false);

  // Fetch notifications
  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = useCallback(async (page = 1) => {
    setIsLoading(page === 1)
    try {
      // Mock data for now
      setTimeout(() => {
        const mockData = generateMockNotifications(page)
        setNotifications(prev => page === 1 ? mockData : [...prev, ...mockData])
        setUnreadCount(mockData.filter(n => !n.read).length)
        setHasMore(page < 3) // Mock 3 pages
        setIsLoading(false)
        setLoadingMore(false)
      }, 1000)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      setIsLoading(false)
      setLoadingMore(false)
    }
  }, [])

  const generateMockNotifications = (page) => {
    const baseId = (page - 1) * 8
    return [
      {
        id: baseId + 1,
        type: 'like',
        user: {
          name: 'Alex Turner',
          username: 'alext',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
          verified: true
        },
        post: {
          title: 'Mastering React Performance Optimization',
          excerpt: 'Learn advanced techniques to optimize your React applications...',
          id: 'post123'
        },
        timestamp: 'Just now',
        read: false,
        meta: { likes: 124, isLiked: true }
      },
      {
        id: baseId + 2,
        type: 'comment',
        user: {
          name: 'Maria Garcia',
          username: 'mariag',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
          verified: false
        },
        post: {
          title: 'Building Real-time Chat with Socket.io',
          id: 'post456'
        },
        comment: 'This tutorial saved my project! The step-by-step approach was exactly what I needed.',
        timestamp: '5 minutes ago',
        read: false,
        meta: { replyCount: 3 }
      },
      {
        id: baseId + 3,
        type: 'follow',
        user: {
          name: 'James Wilson',
          username: 'jamesw',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
          verified: true
        },
        timestamp: '15 minutes ago',
        read: true,
        meta: { mutualFollowers: 12 }
      },
      {
        id: baseId + 4,
        type: 'mention',
        user: {
          name: 'Sophie Chen',
          username: 'sophiec',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophie',
          verified: true
        },
        post: {
          title: 'The Future of Web3 Development',
          id: 'post789'
        },
        mention: 'mentioned you in a discussion about React patterns',
        timestamp: '1 hour ago',
        read: true
      },
      {
        id: baseId + 5,
        type: 'repost',
        user: {
          name: 'David Kim',
          username: 'davidk',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
          verified: true
        },
        post: {
          title: 'CSS Grid vs Flexbox: Complete Guide 2024',
          id: 'post101'
        },
        timestamp: '2 hours ago',
        read: true,
        meta: { shares: 89, views: '2.4K' }
      },
      {
        id: baseId + 6,
        type: 'trending',
        post: {
          title: 'My Journey Learning TypeScript in 30 Days',
          excerpt: 'After years of JavaScript, I finally took the TypeScript plunge...',
          id: 'post202'
        },
        timestamp: '6 hours ago',
        read: true,
        meta: { rank: 3, category: 'Programming', views: '15.2K' }
      },
      {
        id: baseId + 7,
        type: 'achievement',
        title: 'Top Contributor Award',
        description: 'You\'ve been recognized as a Top Contributor for your active engagement!',
        timestamp: '1 day ago',
        read: true,
        meta: { badge: 'Top Contributor', level: 3 }
      },
      {
        id: baseId + 8,
        type: 'system',
        title: 'New Feature: Dark Mode',
        description: 'We\'ve added a beautiful dark mode! Try it out in settings.',
        timestamp: '2 days ago',
        read: true,
        meta: { priority: 'info' }
      }
    ]
  }

  const filters = [
    { id: 'all', label: 'All', icon: <Bell className="w-4 h-4" />, count: notifications.length },
    { id: 'unread', label: 'Unread', icon: <Zap className="w-4 h-4" />, count: unreadCount },
    { id: 'likes', label: 'Likes', icon: <Heart className="w-4 h-4" />, count: notifications.filter(n => n.type === 'like').length },
    { id: 'comments', label: 'Comments', icon: <MessageCircle className="w-4 h-4" />, count: notifications.filter(n => n.type === 'comment').length },
    { id: 'follows', label: 'Follows', icon: <UserPlus className="w-4 h-4" />, count: notifications.filter(n => n.type === 'follow').length },
    { id: 'mentions', label: 'Mentions', icon: <Hash className="w-4 h-4" />, count: notifications.filter(n => n.type === 'mention').length },
    { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" />, count: notifications.filter(n => n.type === 'achievement').length },
    { id: 'trending', label: 'Trending', icon: <TrendingUpIcon className="w-4 h-4" />, count: notifications.filter(n => n.type === 'trending').length }
  ]

  const getNotificationIcon = (type) => {
    const icons = {
      'like': <Heart className="w-5 h-5 text-red-500" />,
      'comment': <MessageCircle className="w-5 h-5 text-blue-500" />,
      'follow': <UserPlus className="w-5 h-5 text-emerald-500" />,
      'repost': <Repeat2 className="w-5 h-5 text-purple-500" />,
      'trending': <TrendingUpIcon className="w-5 h-5 text-amber-500" />,
      'achievement': <Trophy className="w-5 h-5 text-yellow-500" />,
      'mention': <Hash className="w-5 h-5 text-indigo-500" />,
      'system': <Settings className="w-5 h-5 text-gray-500" />
    }
    return icons[type] || <Bell className="w-5 h-5 text-gray-500" />
  }

  const getNotificationColor = (type) => {
    const colors = {
      'like': 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 border-red-100 dark:border-red-800',
      'comment': 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border-blue-100 dark:border-blue-800',
      'follow': 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 border-emerald-100 dark:border-emerald-800',
      'repost': 'bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 border-purple-100 dark:border-purple-800',
      'trending': 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-100 dark:border-amber-800',
      'achievement': 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 border-yellow-100 dark:border-yellow-800',
      'mention': 'bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 border-indigo-100 dark:border-indigo-800',
      'system': 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/10 dark:to-slate-900/10 border-gray-100 dark:border-gray-800'
    }
    return colors[type] || 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'
  }

  const markAsRead = async (id) => {
    try {
      setNotifications(prev => prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      ))
      setUnreadCount(prev => prev - 1)
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const deleteSingleNotification = async (id) => {
    try {
      setNotifications(prev => prev.filter(notif => notif.id !== id))
      if (selectedNotifications.has(id)) {
        setSelectedNotifications(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
      }
      if (unreadCount > 0 && !notifications.find(n => n.id === id)?.read) {
        setUnreadCount(prev => prev - 1)
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const deleteSelectedNotifications = async () => {
    try {
      setNotifications(prev => prev.filter(notif => !selectedNotifications.has(notif.id)))
      
      const deletedUnreadCount = notifications.filter(n => 
        selectedNotifications.has(n.id) && !n.read
      ).length
      setUnreadCount(prev => Math.max(0, prev - deletedUnreadCount))
      
      setSelectedNotifications(new Set())
      setSelectMode(false)
      setShowDeleteConfirm(false)
    } catch (error) {
      console.error('Error deleting selected:', error)
    }
  }

  const toggleSelect = (id) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true)
      pageRef.current += 1
      fetchNotifications(pageRef.current)
    }
  }

  const filteredNotifications = notifications.filter(notif => {
    if (activeFilter === 'unread') return !notif.read
    if (activeFilter === 'all') return true
    return notif.type === activeFilter
  }).filter(notif => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      notif.user?.name?.toLowerCase().includes(searchLower) ||
      notif.post?.title?.toLowerCase().includes(searchLower) ||
      notif.comment?.toLowerCase().includes(searchLower) ||
      notif.description?.toLowerCase().includes(searchLower)
    )
  })

  const getTimeAgo = (timestamp) => {
    return timestamp
  }

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <>
      <NavbarPrivate />
      <div className={`min-h-screen bg-gradient-to-b ${theme === 'light' ? 'from-gray-50 via-white to-white' : 'from-slate-900 via-slate-900 to-slate-950'} pt-16 md:pt-20 lg:pt-24`}>
        <div className="max-w-7xl mx-auto px-4 py-8 pb-28 md:pb-28 lg:pb-32">
          {/* Mobile Toggle Button - Only show on small screens */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFeedHeader(!showFeedHeader)}
              className={`w-full flex items-center justify-between px-4 py-3 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} rounded-xl shadow-sm transition-all duration-300`}
            >
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${showFeedHeader ? 'bg-blue-500/10' : theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'}`}>
                  {showFeedHeader ? (
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
                    Notification Options
                  </h3>
                  <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {showFeedHeader ? 'Hide stats and actions' : 'Show stats and actions'}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-medium ${theme === 'light' ? 'bg-blue-50 text-blue-600' : 'bg-blue-900/30 text-blue-400'}`}>
                {unreadCount} unread
              </span>
            </button>
          </div>

          {/* Enhanced Header - Hidden on mobile by default, togglable */}
          <div className={`${showFeedHeader ? 'block' : 'hidden'} lg:block mb-6 md:mb-8 transition-all duration-300`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30" />
                    <Bell className={`relative w-8 h-8 md:w-10 md:h-10 ${theme === 'light' ? 'text-blue-600' : 'text-blue-500'}`} />
                  </div>
                  <div>
                    <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r ${theme === 'light' ? 'from-blue-600 to-purple-600' : 'from-blue-500 to-purple-500'} bg-clip-text text-transparent`}>
                      Notifications
                    </h1>
                    <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-sm sm:text-base mt-1`}>
                      Stay updated with your community
                    </p>
                  </div>
                </div>

                {/* Quick Actions Bar - Mobile Optimized */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <div className={`flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r ${theme === 'light' ? 'from-blue-50 to-purple-50' : 'from-blue-900/20 to-purple-900/20'} rounded-lg sm:rounded-xl`}>
                    <Zap className={`w-3 h-3 sm:w-4 sm:h-4 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
                    <span className={`font-semibold text-sm sm:text-base ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
                      {unreadCount} unread
                    </span>
                  </div>
                  
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-slate-800 hover:bg-slate-700'} rounded-lg sm:rounded-xl transition-colors`}
                  >
                    {isMuted ? (
                      <VolumeX className={`w-3 h-3 sm:w-4 sm:h-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                    ) : (
                      <Volume2 className={`w-3 h-3 sm:w-4 sm:h-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                    )}
                    <span className={`text-xs sm:text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      {isMuted ? 'Unmute' : 'Mute'}
                    </span>
                  </button>

                  <button
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    className={`flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all ${
                      unreadCount > 0
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl active:scale-95'
                        : `${theme === 'light' ? 'bg-gray-100 text-gray-400' : 'bg-slate-800 text-slate-500'} cursor-not-allowed`
                    }`}
                  >
                    <CheckCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Mark all read</span>
                    <span className="sm:hidden">Read all</span>
                  </button>
                </div>
              </div>

              {/* Search Bar - Mobile Optimized */}
              <div className="w-full lg:w-80 mt-4 lg:mt-0">
                <div className="relative group">
                  <Search className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${theme === 'light' ? 'text-gray-400 group-hover:text-blue-500' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search notifications..."
                    className={`w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400' : 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'} border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:ring-blue-500/50 focus:border-blue-500' : 'focus:ring-blue-400/50 focus:border-blue-400'} transition-all`}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 ${theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-slate-500 hover:text-slate-300'} transition-colors`}
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Cards - Responsive Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8">
              {filters.slice(1, 5).map((filter) => (
                <div 
                  key={filter.id}
                  onClick={() => {
                    setActiveFilter(filter.id);
                    // On mobile, close header after selecting filter
                    if (window.innerWidth < 1024) {
                      setShowFeedHeader(false);
                    }
                  }}
                  className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg sm:rounded-xl md:rounded-2xl border p-3 sm:p-4 cursor-pointer transition-all active:scale-95 md:hover:scale-105 md:hover:shadow-lg ${
                    activeFilter === filter.id 
                      ? 'border-blue-500 shadow-lg' 
                      : `${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`p-1.5 sm:p-2 rounded-lg ${
                        activeFilter === filter.id
                          ? `${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/30'}`
                          : `${theme === 'light' ? 'bg-gray-100' : 'bg-slate-700'}`
                      }`}>
                        {React.cloneElement(filter.icon, { 
                          className: `w-3 h-3 sm:w-4 sm:h-4 ${
                            activeFilter === filter.id
                              ? `${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`
                              : `${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`
                          }` 
                        })}
                      </div>
                      <div>
                        <p className={`text-lg sm:text-xl md:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {filter.count}
                        </p>
                        <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{filter.label}</p>
                      </div>
                    </div>
                    {activeFilter === filter.id && (
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Filters Sidebar - Hidden on mobile */}
            <div className="hidden lg:block space-y-4">
              <div className="sticky top-28 space-y-4">
                <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} p-4`}>
                  <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-3 flex items-center gap-2`}>
                    <Filter className="w-4 h-4" />
                    Filters
                  </h3>
                  <div className="space-y-2">
                    {filters.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          activeFilter === filter.id
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                            : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 hover:bg-slate-700'}`
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {filter.icon}
                          {filter.label}
                        </div>
                        {filter.count > 0 && (
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            activeFilter === filter.id
                              ? 'bg-white/20'
                              : `${theme === 'light' ? 'bg-gray-200 text-gray-600' : 'bg-slate-700 text-gray-300'}`
                          }`}>
                            {filter.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} p-4`}>
                  <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-3 flex items-center gap-2`}>
                    <Settings className="w-4 h-4" />
                    Settings
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Email notifications</span>
                      <button className="w-10 h-6 bg-blue-500 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Push notifications</span>
                      <button className="w-10 h-6 bg-blue-500 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Sound alerts</span>
                      <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className={`w-10 h-6 rounded-full relative transition-all ${
                          isMuted ? `${theme === 'light' ? 'bg-gray-300' : 'bg-slate-600'}` : 'bg-blue-500'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                          isMuted ? 'left-1' : 'right-1'
                        }`}></div>
                      </button>
                    </div>
                    <button className={`w-full text-sm ${theme === 'light' ? 'text-blue-600 hover:text-blue-700' : 'text-blue-400 hover:text-blue-300'} text-center pt-2`}>
                      Customize notifications
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="lg:col-span-3">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className={`w-full flex items-center justify-between px-4 py-3 ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-slate-800 border-slate-700'} border rounded-xl active:scale-95 transition-transform`}
                >
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    <span className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {filters.find(f => f.id === activeFilter)?.label || 'All Notifications'}
                    </span>
                    <span className={`px-2 py-0.5 ${theme === 'light' ? 'bg-gray-200 text-gray-600' : 'bg-slate-700 text-gray-300'} rounded-full text-sm`}>
                      {filteredNotifications.length}
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
                </button>

                {/* Mobile Filters Dropdown */}
                {showMobileFilters && (
                  <div className={`mt-2 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-2xl border ${theme === 'light' ? 'border-gray-300' : 'border-slate-700'} p-3`}>
                    <div className="grid grid-cols-4 gap-2">
                      {filters.map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => {
                            setActiveFilter(filter.id)
                            setShowMobileFilters(false)
                            // Also close the main header on mobile
                            setShowFeedHeader(false);
                          }}
                          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all active:scale-95 ${
                            activeFilter === filter.id
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                              : `${theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-slate-700 text-gray-300'}`
                          }`}
                        >
                          {React.cloneElement(filter.icon, { className: "w-4 h-4 mb-1" })}
                          <span className="text-xs font-medium text-center">{filter.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar - Mobile Optimized */}
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg sm:rounded-2xl border ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'} p-3 sm:p-4`}>
                <div className="flex items-center gap-2 mb-3 sm:mb-0">
                  {selectMode ? (
                    <>
                      <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                        {selectedNotifications.size} selected
                      </span>
                      <button
                        onClick={deleteSelectedNotifications}
                        disabled={selectedNotifications.size === 0}
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium text-sm transition-all active:scale-95 ${
                          selectedNotifications.size > 0
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : `${theme === 'light' ? 'bg-gray-200 text-gray-400' : 'bg-slate-700 text-slate-500'} cursor-not-allowed`
                        }`}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          setSelectMode(false)
                          setSelectedNotifications(new Set())
                        }}
                        className={`px-3 py-1.5 text-sm ${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'} active:scale-95`}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setSelectMode(true)}
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:text-gray-900' : 'bg-slate-700 text-gray-300 hover:text-white'} rounded-lg font-medium text-sm transition-colors active:scale-95`}
                      >
                        Select
                      </button>
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:text-gray-900' : 'bg-slate-700 text-gray-300 hover:text-white'} rounded-lg font-medium text-sm transition-colors active:scale-95`}
                      >
                        <Settings className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                        Settings
                      </button>
                    </>
                  )}
                </div>
                <div className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {filteredNotifications.length} of {notifications.length} notifications
                </div>
              </div>

              {/* Notifications - Mobile Optimized */}
              <div className="space-y-3 sm:space-y-4">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => {
                    const isSelected = selectedNotifications.has(notification.id)

                    return (
                      <div
                        key={notification.id}
                        className={`group relative rounded-lg sm:rounded-2xl border transition-all duration-300 active:scale-95 sm:hover:shadow-xl sm:hover:-translate-y-1 ${
                          getNotificationColor(notification.type)
                        } ${!notification.read ? `ring-2 ${theme === 'light' ? 'ring-blue-500/20' : 'ring-blue-400/20'}` : ''}`}
                      >
                        {selectMode && (
                          <div className="absolute left-3 sm:left-4 top-3 sm:top-4 z-10">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(notification.id)}
                              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-lg border-2 ${theme === 'light' ? 'border-gray-300 bg-white' : 'border-slate-600 bg-slate-700'} checked:bg-blue-500 checked:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                            />
                          </div>
                        )}
                        
                        <div className="p-3 sm:p-4 md:p-6">
                          <div className="flex items-start gap-3 sm:gap-4">
                            {/* Icon */}
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
                              notification.read ? `${theme === 'light' ? 'bg-white' : 'bg-slate-700'}` : `${theme === 'light' ? 'bg-blue-50' : 'bg-blue-900/20'}`
                            }`}>
                              {getNotificationIcon(notification.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                                <div className="flex-1 min-w-0">
                                  {/* Header */}
                                  <div className="flex items-start gap-2 mb-2">
                                    {notification.user && (
                                      <>
                                        <img
                                          src={notification.user.avatar}
                                          alt={notification.user.name}
                                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 ${theme === 'light' ? 'border-white' : 'border-slate-800'} flex-shrink-0`}
                                        />
                                        <div className="min-w-0">
                                          <div className="flex items-center gap-1 flex-wrap">
                                            <span className={`font-semibold text-sm sm:text-base ${theme === 'light' ? 'text-gray-900' : 'text-white'} truncate`}>
                                              {notification.user.name}
                                            </span>
                                            {notification.user.verified && (
                                              <span className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <svg className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                                </svg>
                                              </span>
                                            )}
                                          </div>
                                          <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} truncate block`}>
                                            @{notification.user.username}
                                          </span>
                                        </div>
                                      </>
                                    )}
                                    
                                    {!notification.user && notification.type === 'achievement' && (
                                      <div className="flex items-center gap-2">
                                        <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                                        <span className={`font-semibold text-sm sm:text-base ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                          Achievement!
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Message */}
                                  <p className={`${theme === 'light' ? 'text-gray-800' : 'text-gray-200'} text-sm sm:text-base mb-2 leading-relaxed`}>
                                    {notification.type === 'like' && `liked your post`}
                                    {notification.type === 'comment' && `commented on your post`}
                                    {notification.type === 'follow' && 'started following you'}
                                    {notification.type === 'repost' && `shared your post`}
                                    {notification.type === 'trending' && `Your post is trending`}
                                    {notification.type === 'achievement' && notification.description}
                                    {notification.type === 'mention' && `mentioned you in a post`}
                                    {notification.type === 'system' && notification.description}
                                  </p>

                                  {/* Post Title */}
                                  {notification.post?.title && (
                                    <div className={`mt-2 sm:mt-3 p-2 sm:p-3 ${theme === 'light' ? 'bg-white/50' : 'bg-slate-700/30'} rounded-lg border ${theme === 'light' ? 'border-gray-200' : 'border-slate-600'}`}>
                                      <h4 className={`font-semibold text-sm sm:text-base ${theme === 'light' ? 'text-gray-900' : 'text-white'} line-clamp-2`}>
                                        {notification.post.title}
                                      </h4>
                                      {notification.post.excerpt && (
                                        <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mt-1 line-clamp-2`}>
                                          {notification.post.excerpt}
                                        </p>
                                      )}
                                    </div>
                                  )}

                                  {/* Comment Preview */}
                                  {notification.comment && (
                                    <div className={`mt-2 sm:mt-3 p-2 sm:p-3 ${theme === 'light' ? 'bg-blue-50/50' : 'bg-blue-900/10'} rounded-lg border ${theme === 'light' ? 'border-blue-100' : 'border-blue-800'}`}>
                                      <p className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} line-clamp-3`}>"{notification.comment}"</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Meta Info & Actions Row */}
                              <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 mt-3 sm:mt-4">
                                {/* Left side: Meta info */}
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                                  <span className={`flex items-center gap-1 text-xs sm:text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    <Clock className="w-3 h-3" />
                                    {getTimeAgo(notification.timestamp)}
                                  </span>
                                  {!notification.read && (
                                    <span className={`px-2 py-0.5 ${theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-900/30 text-blue-400'} text-xs font-medium rounded-full`}>
                                      New
                                    </span>
                                  )}
                                  {notification.meta && (
                                    <div className="flex items-center gap-2 sm:gap-3">
                                      {notification.meta.likes && (
                                        <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} flex items-center gap-1`}>
                                          <Heart className="w-3 h-3" /> {notification.meta.likes}
                                        </span>
                                      )}
                                      {notification.meta.shares && (
                                        <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} flex items-center gap-1`}>
                                          <Share2 className="w-3 h-3" /> {notification.meta.shares}
                                        </span>
                                      )}
                                      {notification.meta.views && (
                                        <span className={`text-xs sm:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} flex items-center gap-1`}>
                                          <Eye className="w-3 h-3" /> {notification.meta.views}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Right side: Action buttons (only when not in select mode) */}
                                {!selectMode && (
                                  <div className="flex items-center gap-1">
                                    {!notification.read && (
                                      <button
                                        onClick={() => markAsRead(notification.id)}
                                        className={`p-1.5 sm:p-2 text-gray-400 hover:text-green-600 ${theme === 'dark' ? 'dark:hover:text-green-400' : ''} hover:bg-green-50 ${theme === 'dark' ? 'dark:hover:bg-green-900/20' : ''} rounded-lg sm:rounded-xl transition-colors active:scale-95`}
                                        title="Mark as read"
                                      >
                                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => deleteSingleNotification(notification.id)}
                                      className={`p-1.5 sm:p-2 text-gray-400 hover:text-red-600 ${theme === 'dark' ? 'dark:hover:text-red-400' : ''} hover:bg-red-50 ${theme === 'dark' ? 'dark:hover:bg-red-900/20' : ''} rounded-lg sm:rounded-xl transition-colors active:scale-95`}
                                      title="Delete notification"
                                    >
                                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Action Buttons for comments/mentions */}
                              {(notification.type === 'comment' || notification.type === 'mention') && !selectMode && (
                                <div className={`flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-slate-700'}`}>
                                  <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-xs sm:text-sm active:scale-95">
                                    Reply
                                  </button>
                                  <button className={`px-3 py-1.5 sm:px-4 sm:py-2 ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'} rounded-lg transition-colors font-medium text-xs sm:text-sm active:scale-95`}>
                                    View post
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  /* Empty State */
                  <div className={`text-center py-12 sm:py-20 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'} rounded-lg sm:rounded-2xl border-2 border-dashed ${theme === 'light' ? 'border-gray-300' : 'border-slate-700'}`}>
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-r ${theme === 'light' ? 'from-blue-100 to-purple-100' : 'from-blue-900/20 to-purple-900/20'} rounded-full flex items-center justify-center`}>
                      <Bell className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${theme === 'light' ? 'text-blue-600' : 'text-blue-500'}`} />
                    </div>
                    <h3 className={`text-lg sm:text-xl md:text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-2 sm:mb-3`}>
                      No notifications found
                    </h3>
                    <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto px-4`}>
                      {searchTerm
                        ? `No notifications matching "${searchTerm}"`
                        : activeFilter === 'unread'
                        ? "You're all caught up! No unread notifications."
                        : "When you get activity on your posts, you'll see it here."}
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="px-6 py-2.5 sm:px-8 sm:py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 text-sm sm:text-base"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Load More */}
              {hasMore && filteredNotifications.length > 0 && (
                <div className="flex justify-center mt-8 sm:mt-12">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="px-6 py-2.5 sm:px-8 sm:py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base"
                  >
                    {loadingMore ? (
                      <>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                        Load More
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Notifications
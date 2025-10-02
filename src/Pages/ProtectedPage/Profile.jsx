import { useState } from "react";
import {
  Settings,
  MapPin,
  Calendar,
  Link2,
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import NavbarPrivate from "../../Components/Private/Navbarprivate";
import EditProfileModal from "./EditProfile";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set([1, 3]));
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set([2]));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isOwnProfile = true;

  const profile = {
    name: "John Doe",
    username: "johndoe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe",
    bio: "Full-stack developer passionate about React, Node.js, and building cool stuff. Writing about web dev, tech, and life. ☕️💻",
    location: "Lagos, Nigeria",
    website: "johndoe.dev",
    joinedDate: "January 2024",
    stats: {
      posts: 24,
      followers: 1234,
      following: 567,
    },
  };

  const userPosts = [
    {
      id: 1,
      title: "Getting Started with React Hooks",
      excerpt:
        "React Hooks have revolutionized the way we write React components...",
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
      tags: ["React", "JavaScript"],
      readTime: "5 min read",
      date: "2 days ago",
      likes: 124,
      comments: 18,
    },
    {
      id: 2,
      title: "Building Scalable REST APIs",
      excerpt: "Learn how to build production-ready REST APIs using Node.js...",
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
      tags: ["Node.js", "Backend"],
      readTime: "8 min read",
      date: "5 days ago",
      likes: 256,
      comments: 34,
    },
    {
      id: 3,
      title: "My Journey Learning TypeScript",
      excerpt:
        "After years of JavaScript, I decided to dive into TypeScript...",
      image:
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
      tags: ["TypeScript"],
      readTime: "6 min read",
      date: "1 week ago",
      likes: 312,
      comments: 45,
    },
    {
      id: 4,
      title: "CSS Grid vs Flexbox",
      excerpt: "Understanding when to use CSS Grid vs Flexbox...",
      image: null,
      tags: ["CSS", "Frontend"],
      readTime: "4 min read",
      date: "2 weeks ago",
      likes: 178,
      comments: 23,
    },
  ];

  const tabs = [
    { id: "posts", label: "Posts", count: profile.stats.posts },
    { id: "about", label: "About" },
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

  return (
    <>
      <NavbarPrivate />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-16 md:pt-20 pb-20 md:pb-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden mb-6">
            <div className="h-32 md:h-48 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700"></div>

            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 sm:-mt-20">
                <div className="relative">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-lg"
                  />
                </div>

                <div className="flex gap-2 mt-4 sm:mt-0">
                  {isOwnProfile ? (
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-2 border-gray-300 dark:border-slate-600 rounded-lg hover:border-blue-600 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-500 font-semibold transition-all duration-200"
                    >
                      <Settings className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsFollowing(!isFollowing)}
                        className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                          isFollowing
                            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-2 border-gray-300 dark:border-slate-600 hover:border-red-500 hover:text-red-500"
                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                        }`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                      <button className="p-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white border-2 border-gray-300 dark:border-slate-600 rounded-lg hover:border-blue-600 dark:hover:border-blue-500 transition-all">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                  {profile.name}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
                  @{profile.username}
                </p>
              </div>

              <p className="mt-4 text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                {profile.bio}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-600 dark:text-slate-400">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.website && (
                  <a
                    href={`https://${profile.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                  >
                    <Link2 className="w-4 h-4" />
                    <span>{profile.website}</span>
                  </a>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {profile.joinedDate}</span>
                </div>
              </div>

              <div className="flex gap-6 mt-5 pt-5 border-t border-gray-200 dark:border-slate-700">
                <div className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {profile.stats.posts}
                  </span>
                  <span className="ml-1 text-slate-600 dark:text-slate-400 text-sm">
                    Posts
                  </span>
                </div>
                <div className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {profile.stats.followers}
                  </span>
                  <span className="ml-1 text-slate-600 dark:text-slate-400 text-sm">
                    Followers
                  </span>
                </div>
                <div className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {profile.stats.following}
                  </span>
                  <span className="ml-1 text-slate-600 dark:text-slate-400 text-sm">
                    Following
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-16 md:top-20 z-40 rounded-t-xl">
            <div className="flex gap-1 px-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-semibold text-sm relative transition-colors ${
                    activeTab === tab.id
                      ? "text-blue-600 dark:text-blue-500"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-1.5 text-xs">({tab.count})</span>
                  )}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-500 rounded-t"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            {activeTab === "posts" && (
              <div className="space-y-6">
                {userPosts.length > 0 ? (
                  userPosts.map((post) => {
                    const isLiked = likedPosts.has(post.id);
                    const isBookmarked = bookmarkedPosts.has(post.id);

                    return (
                      <article
                        key={post.id}
                        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-md dark:hover:shadow-slate-900/50 transition-all duration-200"
                      >
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {post.date}
                            </span>
                            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </div>

                          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-500 transition-colors cursor-pointer leading-tight">
                            {post.title}
                          </h2>

                          {post.excerpt && (
                            <p className="text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed">
                              {post.excerpt}
                            </p>
                          )}
                        </div>

                        {post.image && (
                          <div className="w-full h-64 md:h-80 overflow-hidden">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                            />
                          </div>
                        )}

                        <div className="p-5 pt-4">
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-slate-700">
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                              {post.readTime}
                            </span>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => toggleLike(post.id)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 ${
                                  isLiked
                                    ? "text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30"
                                    : "text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                }`}
                              >
                                <Heart
                                  className={`w-5 h-5 ${
                                    isLiked ? "fill-current" : ""
                                  }`}
                                />
                                <span className="text-sm font-medium">
                                  {post.likes + (isLiked ? 1 : 0)}
                                </span>
                              </button>

                              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">
                                <MessageCircle className="w-5 h-5" />
                                <span className="text-sm font-medium">
                                  {post.comments}
                                </span>
                              </button>

                              <button
                                onClick={() => toggleBookmark(post.id)}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                  isBookmarked
                                    ? "text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                    : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
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
                      </article>
                    );
                  })
                ) : (
                  <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                      No posts yet
                    </p>
                    {isOwnProfile && (
                      <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors">
                        Write your first post
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "about" && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  About
                </h3>
                <div className="space-y-4 text-slate-700 dark:text-slate-300">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Bio
                    </h4>
                    <p className="leading-relaxed">{profile.bio}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Location
                    </h4>
                    <p>{profile.location}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Website
                    </h4>
                    <a
                      href={`https://${profile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      {profile.website}
                    </a>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Member Since
                    </h4>
                    <p>{profile.joinedDate}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Activity
                    </h4>
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {profile.stats.posts}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          Posts
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {profile.stats.followers}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          Followers
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {profile.stats.following}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          Following
                        </div>
                      </div>
                    </div>
                  </div>
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

import { useState, useEffect } from "react";
import {
  Mail,
  User,
  Lock,
  Trash2,
  Save,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Settings as SettingsIcon,
  Globe,
  Moon,
  Sun,
  Key,
  AlertCircle,
} from "lucide-react";
import NavbarPrivate from "../../Components/Private/Navbarprivate";
import { useContext } from "react";
import { UserContext } from "../../Context/userContext";
import { PageLoader } from "../../Components/Private/Loader";

export default function SettingsPage() {
  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.username || "");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [preferences, setPreferences] = useState({
    darkMode: document.documentElement.classList.contains('dark'),
    emailNotifications: true,
    weeklyDigest: false,
    profilePublic: true,
    allowComments: true,
  });

  const [privacy, setPrivacy] = useState({
    showFollowers: true,
    showFollowing: true,
    profileSearchable: true,
  });

  useEffect(() => {
    setTimeout(() => {
      setIsPageLoading(false);
    }, 3000);
  }, []);

  const togglePreference = (key) => {
    const newValue = !preferences[key];
    setPreferences((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    if (key === 'darkMode') {
      if (newValue) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  };

  const togglePrivacy = (key) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      alert("Settings saved successfully!");
      setIsSaving(false);
    }, 1000);
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmed) {
      const doubleConfirm = window.prompt(
        'Type "DELETE" to confirm account deletion:'
      );

      if (doubleConfirm === "DELETE") {
        alert("Account deletion confirmed - Call API to delete account");
      }
    }
  };

  return (
    <>
      {isPageLoading ? (
        <PageLoader />
      ) : (
        <>
          <NavbarPrivate />
          <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 pt-16 md:pt-20">
            <div className="max-w-4xl mx-auto px-4 py-8">
              {/* Header */}
              <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border border-gray-200/50 dark:border-slate-700/50 rounded-2xl p-6 mb-8 shadow-lg hover:shadow-xl dark:hover:shadow-slate-900/50 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 bg-clip-text text-transparent">
                      Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      Manage your account settings and preferences
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSaveSettings}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Account Settings */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Account Settings */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl dark:hover:shadow-slate-900/50 transition-all duration-300 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
                          <User className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Account Settings
                          </h2>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Update your account information
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Email */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-500" />
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 pl-10 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                            placeholder="your@email.com"
                          />
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                        </div>
                      </div>

                      {/* Username */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-500" />
                          Username
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500">
                            @
                          </span>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                            placeholder="username"
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <Lock className="w-4 h-4 text-blue-500" />
                          Password
                        </label>
                        <button
                          onClick={() => setShowPasswordModal(true)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-300 w-full justify-center"
                        >
                          <Key className="w-4 h-4" />
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl dark:hover:shadow-slate-900/50 transition-all duration-300 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
                          <Shield className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Privacy Settings
                          </h2>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Control your privacy preferences
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Show Followers */}
                      <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-300">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Show Followers Count
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Display your followers count on profile
                          </p>
                        </div>
                        <button
                          onClick={() => togglePrivacy("showFollowers")}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                            privacy.showFollowers
                              ? "bg-gradient-to-r from-blue-600 to-purple-600"
                              : "bg-gray-300 dark:bg-slate-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                              privacy.showFollowers
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Show Following */}
                      <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-300">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Show Following Count
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Display your following count on profile
                          </p>
                        </div>
                        <button
                          onClick={() => togglePrivacy("showFollowing")}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                            privacy.showFollowing
                              ? "bg-gradient-to-r from-blue-600 to-purple-600"
                              : "bg-gray-300 dark:bg-slate-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                              privacy.showFollowing
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Profile Searchable */}
                      <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-300">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Profile Searchable
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Allow others to find your profile in search
                          </p>
                        </div>
                        <button
                          onClick={() => togglePrivacy("profileSearchable")}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                            privacy.profileSearchable
                              ? "bg-gradient-to-r from-blue-600 to-purple-600"
                              : "bg-gray-300 dark:bg-slate-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                              privacy.profileSearchable
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Preferences & Danger Zone */}
                <div className="space-y-8">
                  {/* Preferences */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl dark:hover:shadow-slate-900/50 transition-all duration-300 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
                          <Bell className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Preferences
                          </h2>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Customize your experience
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Dark Mode */}
                      <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${preferences.darkMode ? 'bg-blue-500/10' : 'bg-gray-100 dark:bg-slate-700'}`}>
                            {preferences.darkMode ? (
                              <Moon className="w-4 h-4 text-blue-500" />
                            ) : (
                              <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                              Dark Mode
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Use dark theme
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => togglePreference("darkMode")}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                            preferences.darkMode
                              ? "bg-gradient-to-r from-blue-600 to-purple-600"
                              : "bg-gray-300 dark:bg-slate-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                              preferences.darkMode
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Email Notifications */}
                      <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-300">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Email Notifications
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Receive email updates
                          </p>
                        </div>
                        <button
                          onClick={() => togglePreference("emailNotifications")}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                            preferences.emailNotifications
                              ? "bg-gradient-to-r from-blue-600 to-purple-600"
                              : "bg-gray-300 dark:bg-slate-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                              preferences.emailNotifications
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Weekly Digest */}
                      <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-300">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Weekly Digest
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Weekly blog performance summary
                          </p>
                        </div>
                        <button
                          onClick={() => togglePreference("weeklyDigest")}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                            preferences.weeklyDigest
                              ? "bg-gradient-to-r from-blue-600 to-purple-600"
                              : "bg-gray-300 dark:bg-slate-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                              preferences.weeklyDigest
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Profile Public */}
                      <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-300">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Public Profile
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Make profile visible to everyone
                          </p>
                        </div>
                        <button
                          onClick={() => togglePreference("profilePublic")}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                            preferences.profilePublic
                              ? "bg-gradient-to-r from-blue-600 to-purple-600"
                              : "bg-gray-300 dark:bg-slate-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                              preferences.profilePublic
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Allow Comments */}
                      <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-300">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Allow Comments
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Let readers comment on posts
                          </p>
                        </div>
                        <button
                          onClick={() => togglePreference("allowComments")}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                            preferences.allowComments
                              ? "bg-gradient-to-r from-blue-600 to-purple-600"
                              : "bg-gray-300 dark:bg-slate-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                              preferences.allowComments
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-gradient-to-br mb-28 from-red-50 to-red-100 dark:from-red-900/10 dark:to-red-900/5 rounded-2xl border border-red-200 dark:border-red-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="px-6 py-4 border-b border-red-200 dark:border-red-800 bg-gradient-to-r from-red-500/5 to-red-600/5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-red-900 dark:text-red-400">
                            Danger Zone
                          </h2>
                          <p className="text-sm text-red-700 dark:text-red-500">
                            Irreversible actions
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="space-y-4">
                        <p className="text-sm text-red-700 dark:text-red-500">
                          Once you delete your account, there is no going back. All your data will be permanently removed.
                        </p>
                        <button
                          onClick={handleDeleteAccount}
                          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl w-full justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)} />
                <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg">
                        <Lock className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          Change Password
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Update your password
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPasswordModal(false)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300"
                    >
                      <EyeOff className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowPasswordModal(false)}
                      className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 font-medium transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        alert("Password change API call here");
                        setShowPasswordModal(false);
                      }}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
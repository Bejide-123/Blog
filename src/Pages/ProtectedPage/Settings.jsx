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
} from "lucide-react";
import NavbarPrivate from "../../Components/Private/Navbarprivate";
import { useContext } from "react";
import { UserContext } from "../../Context/userContext";
import { PageLoader } from "../../Components/Private/Loader";

export default function SettingsPage() {
  // Account Settings from context
  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.username || "");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Preferences
  const [preferences, setPreferences] = useState(
    user?.preferences || {
      darkMode: false,
      emailNotifications: true,
      weeklyDigest: false,
      profilePublic: true,
      allowComments: true,
    }
  );

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    showFollowers: true,
    showFollowing: true,
    profileSearchable: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsPageLoading(false);
    }, 3000);
  });

  const togglePreference = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const togglePrivacy = (key) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://your-api-url/user/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          username,
          preferences,
          privacy,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Settings saved successfully!");
      } else {
        alert(data.message || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
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
          <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-16 md:pt-20 pb-20 md:pb-8">
            <div className="max-w-4xl mx-auto px-4 py-6">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  Settings
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage your account settings and preferences
                </p>
              </div>

              {/* Account Settings */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 mb-6 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                    Account Settings
                  </h2>
                </div>

                <div className="p-6 space-y-5">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Email Address
                    </label>
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Username
                    </label>
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                          @
                        </span>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full pl-8 pr-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Password
                    </label>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-gray-300 dark:border-slate-600 rounded-lg hover:border-blue-600 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-500 font-medium transition-colors"
                    >
                      <Lock className="w-4 h-4" />
                      Change Password
                    </button>
                  </div>

                  {/* Delete Account */}
                  <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                    <label className="block text-sm font-semibold text-red-600 dark:text-red-400 mb-2">
                      Danger Zone
                    </label>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 font-medium transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </button>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      This action cannot be undone. All your posts and data will
                      be permanently deleted.
                    </p>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 mb-6 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                    Preferences
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  {/* Dark Mode */}
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Dark Mode
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Use dark theme across the app
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        togglePreference("darkMode"), toggleDarkMode();
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.darkMode
                          ? "bg-blue-600"
                          : "bg-gray-300 dark:bg-slate-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.darkMode
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Email Notifications */}
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Email Notifications
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Receive email notifications for activity
                      </p>
                    </div>
                    <button
                      onClick={() => togglePreference("emailNotifications")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.emailNotifications
                          ? "bg-blue-600"
                          : "bg-gray-300 dark:bg-slate-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.emailNotifications
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Weekly Digest */}
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Weekly Digest
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Get a weekly summary of your blog performance
                      </p>
                    </div>
                    <button
                      onClick={() => togglePreference("weeklyDigest")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.weeklyDigest
                          ? "bg-blue-600"
                          : "bg-gray-300 dark:bg-slate-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.weeklyDigest
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Profile Public */}
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Public Profile
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Make your profile visible to everyone
                      </p>
                    </div>
                    <button
                      onClick={() => togglePreference("profilePublic")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.profilePublic
                          ? "bg-blue-600"
                          : "bg-gray-300 dark:bg-slate-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.profilePublic
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Allow Comments */}
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Allow Comments
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Let readers comment on your posts
                      </p>
                    </div>
                    <button
                      onClick={() => togglePreference("allowComments")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        preferences.allowComments
                          ? "bg-blue-600"
                          : "bg-gray-300 dark:bg-slate-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          preferences.allowComments
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 mb-6 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                    Privacy
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  {/* Show Followers */}
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Show Followers Count
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Display your followers count on your profile
                      </p>
                    </div>
                    <button
                      onClick={() => togglePrivacy("showFollowers")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        privacy.showFollowers
                          ? "bg-blue-600"
                          : "bg-gray-300 dark:bg-slate-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          privacy.showFollowers
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Show Following */}
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Show Following Count
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Display your following count on your profile
                      </p>
                    </div>
                    <button
                      onClick={() => togglePrivacy("showFollowing")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        privacy.showFollowing
                          ? "bg-blue-600"
                          : "bg-gray-300 dark:bg-slate-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          privacy.showFollowing
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Profile Searchable */}
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Profile Searchable
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Allow others to find your profile in search
                      </p>
                    </div>
                    <button
                      onClick={() => togglePrivacy("profileSearchable")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        privacy.profileSearchable
                          ? "bg-blue-600"
                          : "bg-gray-300 dark:bg-slate-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          privacy.profileSearchable
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? "Saving..." : "Save Settings"}
                </button>
              </div>

              {/* Password Change Modal */}
              {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                      Change Password
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter current password"
                          className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter new password"
                          className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          className="w-full px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setShowPasswordModal(false)}
                        className="flex-1 px-4 py-2.5 text-slate-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          alert("Password change API call here");
                          setShowPasswordModal(false);
                        }}
                        className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

import { useState, useEffect, useContext, useCallback } from "react";
import {
  Mail, User, Lock, Trash2, Save, Shield, Bell,
  Eye, EyeOff, Moon, Sun, Key, AlertCircle,
  CheckCircle2, XCircle, Loader2, ChevronRight,
  AlertTriangle, Info, X,
} from "lucide-react";
import NavbarPrivate from "../../Components/Private/Navbarprivate";
import { UserContext } from "../../Context/userContext";
import { PageLoader } from "../../Components/Private/Loader";
import { useTheme } from "../../Context/themeContext";
import { useToastContext } from "../../Components/Public/toast/useToast.jsx";
import {
  getUserPreferences,
  upsertUserPreferences,
  updateProfileInfo,
  updateEmail,
  changePassword,
  deleteUserAccount,
  getUserProfile,
  ensurePreferencesExist,
} from "../../Services/Settings";
import { useConfirm } from '../../Components/Public/ConfirmModal';

// ─── Toggle Row ───────────────────────────────────────────────────────────────
function ToggleRow({ label, description, value, onChange, theme, icon }) {
  const isLight = theme === "light";
  return (
    <div className={`flex items-center justify-between p-3.5 rounded-xl transition-colors duration-200
      ${isLight ? "hover:bg-gray-50" : "hover:bg-slate-700/40"}`}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {icon && (
          <div className={`p-1.5 rounded-lg flex-shrink-0 ${isLight ? "bg-gray-100" : "bg-slate-700/60"}`}>
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <p className={`text-sm font-semibold truncate ${isLight ? "text-gray-900" : "text-white"}`}>
            {label}
          </p>
          {description && (
            <p className={`text-xs mt-0.5 truncate ${isLight ? "text-gray-500" : "text-slate-400"}`}>
              {description}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative ml-4 inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-300
          ${value ? "bg-gradient-to-r from-blue-600 to-violet-600" : isLight ? "bg-gray-200" : "bg-slate-600"}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300
          ${value ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ title, description, icon, theme, children, danger = false }) {
  const isLight = theme === "light";
  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-300
      ${danger
        ? isLight ? "bg-red-50/60 border-red-200 shadow-sm hover:shadow-md"
                  : "bg-red-900/5 border-red-800/60 shadow-sm hover:shadow-md"
        : isLight ? "bg-white border-gray-200 shadow-sm hover:shadow-lg"
                  : "bg-slate-800 border-slate-700/70 shadow-sm hover:shadow-lg hover:shadow-black/20"
      }`}
    >
      <div className={`px-5 py-4 border-b
        ${danger
          ? isLight ? "border-red-200 bg-red-50" : "border-red-800/40 bg-red-900/10"
          : isLight ? "border-gray-100 bg-gray-50/60" : "border-slate-700/60 bg-slate-700/20"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl
            ${danger
              ? isLight ? "bg-red-100 text-red-500" : "bg-red-900/30 text-red-400"
              : isLight ? "bg-blue-50 text-blue-500" : "bg-blue-900/30 text-blue-400"
            }`}
          >
            {icon}
          </div>
          <div>
            <h2 className={`font-bold text-sm
              ${danger ? isLight ? "text-red-900" : "text-red-400"
                       : isLight ? "text-gray-900" : "text-white"}`}
            >
              {title}
            </h2>
            <p className={`text-xs mt-0.5
              ${danger ? isLight ? "text-red-600" : "text-red-500"
                       : isLight ? "text-gray-500" : "text-slate-400"}`}
            >
              {description}
            </p>
          </div>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─── Password Modal ───────────────────────────────────────────────────────────
function PasswordModal({ theme, userEmail, onClose, onToast }) {
  const isLight = theme === "light";
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordsMatch = next && confirm && next === confirm;
  const strongEnough = next.length >= 8;
  const canSubmit = current && passwordsMatch && strongEnough;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await changePassword(userEmail, current, next);
      onToast("Password updated successfully", "success");
      onClose();
    } catch (err) {
      onToast(err.message || "Failed to update password", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (extra = "") =>
    `w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-all
    ${isLight
      ? "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-blue-500 focus:border-transparent"
      : "bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:ring-blue-400 focus:border-transparent"
    } ${extra}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 ${isLight ? "bg-black/50" : "bg-black/70"} backdrop-blur-sm`}
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl border p-6
          ${isLight ? "bg-white border-gray-200" : "bg-slate-800 border-slate-700"}`}
        style={{ animation: "modalIn 0.3s cubic-bezier(0.34,1.3,0.64,1) forwards" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isLight ? "bg-blue-50 text-blue-500" : "bg-blue-900/30 text-blue-400"}`}>
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-bold text-base ${isLight ? "text-gray-900" : "text-white"}`}>
                Change Password
              </h3>
              <p className={`text-xs ${isLight ? "text-gray-500" : "text-slate-400"}`}>
                Min. 8 characters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${isLight ? "hover:bg-gray-100 text-gray-400" : "hover:bg-slate-700 text-slate-500"}`}
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Current */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="••••••••"
                className={inputClass("pr-10")}
              />
              <button
                onClick={() => setShowCurrent((p) => !p)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${isLight ? "text-gray-400" : "text-slate-500"}`}
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
              New Password
            </label>
            <div className="relative">
              <input
                type={showNext ? "text" : "password"}
                value={next}
                onChange={(e) => setNext(e.target.value)}
                placeholder="••••••••"
                className={inputClass("pr-10")}
              />
              <button
                onClick={() => setShowNext((p) => !p)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${isLight ? "text-gray-400" : "text-slate-500"}`}
              >
                {showNext ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {next && (
              <div className="flex items-center gap-2 mt-1.5">
                <div className={`h-1 flex-1 rounded-full ${next.length >= 8 ? "bg-emerald-500" : "bg-red-400"}`} />
                <span className={`text-[10px] font-medium ${next.length >= 8 ? "text-emerald-500" : "text-red-400"}`}>
                  {next.length >= 12 ? "Strong" : next.length >= 8 ? "Good" : "Too short"}
                </span>
              </div>
            )}
          </div>

          {/* Confirm */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className={inputClass(confirm && !passwordsMatch ? "border-red-400 focus:ring-red-400" : "")}
            />
            {confirm && !passwordsMatch && (
              <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors
              ${isLight ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-slate-700 text-gray-300 hover:bg-slate-600"}`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", boxShadow: "0 4px 16px rgba(99,102,241,0.3)" }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main SettingsPage ────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useContext(UserContext);
  const { toast } = useToastContext();
  const { confirm, ConfirmModal } = useConfirm();
  const isLight = theme === "light";

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isThemeSyncing, setIsThemeSyncing] = useState(true);

  // Email comes from Supabase auth, not profiles table
  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.username || "");

  const [preferences, setPreferences] = useState({
    darkMode: theme === "dark",
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

  // ── Sync theme with preference ──
  const syncThemeWithPreference = useCallback((darkModePref) => {
    if (darkModePref && theme !== "dark") {
      toggleTheme(); // Switch to dark mode
    } else if (!darkModePref && theme !== "light") {
      toggleTheme(); // Switch to light mode
    }
  }, [theme, toggleTheme]);

  // ── Load profile + preferences on mount ──
  useEffect(() => {
    const init = async () => {
      try {
        if (user?.id) {
          // Ensure a preferences row exists before trying to read it
          await ensurePreferencesExist(user.id);

          // Load username from profiles table
          const profile = await getUserProfile(user.id);
          if (profile) {
            setUsername(profile.username || "");
          }

          // Load preferences + privacy settings
          const prefs = await getUserPreferences(user.id);
          
          // Get dark mode preference from database
          const darkModePref = prefs.dark_mode ?? false;
          
          setPreferences({
            darkMode: darkModePref,
            emailNotifications: prefs.email_notifications ?? true,
            weeklyDigest: prefs.weekly_digest ?? false,
            profilePublic: prefs.profile_public ?? true,
            allowComments: prefs.allow_comments ?? true,
          });
          
          setPrivacy({
            showFollowers: prefs.show_followers ?? true,
            showFollowing: prefs.show_following ?? true,
            profileSearchable: prefs.profile_searchable ?? true,
          });
          
          // IMPORTANT: Sync theme with loaded preference
          syncThemeWithPreference(darkModePref);
          
          // Ensure localStorage is set for persistence
          localStorage.setItem('theme', darkModePref ? 'dark' : 'light');
          
          // Give theme time to update
          setTimeout(() => setIsThemeSyncing(false), 100);
        }
      } catch (err) {
        console.error("Error loading preferences:", err);
        toast("Failed to load preferences", "error");
        setIsThemeSyncing(false);
      } finally {
        setIsPageLoading(false);
      }
    };
    init();
  }, [user?.id, syncThemeWithPreference, toast]);

  const togglePreference = (key) => {
    const newValue = !preferences[key];
    
    setPreferences((prev) => ({ ...prev, [key]: newValue }));
    
    if (key === "darkMode") {
      // Sync theme immediately when toggling
      syncThemeWithPreference(newValue);
    }
  };

  const togglePrivacy = (key) => {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ── Save all settings ──
  const handleSaveSettings = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      // Update username in profiles table only if it changed
      if (username !== user?.username) {
        await updateProfileInfo(user.id, { username });
        // Reflect the change in the user object without a full reload
        user.username = username;
      }

      // Update email via Supabase Auth only if it changed
      if (email !== user?.email) {
        await updateEmail(email);
        toast("Confirmation email sent — check your inbox", "info");
      }

      // Save all preferences + privacy to user_preferences table
      await upsertUserPreferences(user.id, {
        dark_mode: preferences.darkMode,
        email_notifications: preferences.emailNotifications,
        weekly_digest: preferences.weeklyDigest,
        profile_public: preferences.profilePublic,
        allow_comments: preferences.allowComments,
        show_followers: privacy.showFollowers,
        show_following: privacy.showFollowing,
        profile_searchable: privacy.profileSearchable,
      });

      // Ensure localStorage is updated for immediate persistence
      localStorage.setItem('theme', preferences.darkMode ? 'dark' : 'light');

      toast("Settings saved successfully", "success");
    } catch (err) {
      console.error("Error saving settings:", err);
      toast(err.message || "Failed to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = await confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
      { variant: "danger", confirmText: "Delete Account" }
    );
    if (!confirmed) {
      toast("Account deletion cancelled", "warning");
      return;
    }
    if (!user?.id) return;

    const typed = window.prompt('Type "DELETE" to confirm:');
    if (typed !== "DELETE") {
      toast("Account deletion cancelled", "warning");
      return;
    }

    setIsDeletingAccount(true);
    try {
      await deleteUserAccount(user.id);
      toast("Account deleted. Goodbye!", "success");
      setTimeout(() => { window.location.href = "/"; }, 2000);
    } catch (err) {
      toast(err.message || "Failed to delete account", "error");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  if (isPageLoading || isThemeSyncing) return <PageLoader />;

  const inputClass = `w-full py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-all
    ${isLight
      ? "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-blue-500 focus:border-transparent"
      : "bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:ring-blue-400 focus:border-transparent"
    }`;

  return (
    <>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      <NavbarPrivate />

      <div className={`min-h-screen bg-gradient-to-b pt-16 md:pt-20
        ${isLight ? "from-gray-50 via-white to-white" : "from-slate-900 via-slate-900 to-slate-950"}`}
      >
        <div className="max-w-4xl mx-auto px-4 py-8 pb-28">

          {/* ── Page header ── */}
          <div className={`rounded-2xl border p-5 mb-8 shadow-sm
            ${isLight ? "bg-white/95 border-gray-200/60" : "bg-slate-800/90 border-slate-700/60"}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent
                  ${isLight ? "from-blue-600 to-violet-600" : "from-blue-400 to-violet-400"}`}
                >
                  Settings
                </h1>
                <p className={`text-sm mt-0.5 ${isLight ? "text-gray-500" : "text-slate-400"}`}>
                  Manage your account, privacy and preferences
                </p>
              </div>
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", boxShadow: "0 4px 16px rgba(99,102,241,0.25)" }}
              >
                {isSaving
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                  : <><Save className="w-4 h-4" /> Save Changes</>
                }
              </button>
            </div>
          </div>

          {/* ── Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left — Account + Privacy */}
            <div className="lg:col-span-2 space-y-6">

              <SectionCard
                title="Account Settings"
                description="Update your login information"
                icon={<User className="w-4 h-4" />}
                theme={theme}
              >
                <div className="space-y-5">

                  {/* Email — Supabase Auth, not profiles table */}
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Email Address
                      <span className={`ml-2 font-normal ${isLight ? "text-gray-400" : "text-slate-500"}`}>
                        (confirmation email will be sent on change)
                      </span>
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-gray-400" : "text-slate-500"}`} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className={`${inputClass} pl-10 pr-4`}
                      />
                    </div>
                  </div>

                  {/* Username — profiles table */}
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Username
                    </label>
                    <div className="relative">
                      <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium ${isLight ? "text-gray-400" : "text-slate-500"}`}>
                        @
                      </span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="username"
                        className={`${inputClass} pl-8 pr-4`}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Password
                    </label>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm font-medium transition-all
                        ${isLight
                          ? "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                          : "bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-blue-500" />
                        Change Password
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isLight ? "text-gray-400" : "text-slate-500"}`} />
                    </button>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                title="Privacy"
                description="Control what others can see"
                icon={<Shield className="w-4 h-4" />}
                theme={theme}
              >
                <div className="space-y-1">
                  <ToggleRow
                    label="Show Followers Count"
                    description="Display followers on your profile"
                    value={privacy.showFollowers}
                    onChange={() => togglePrivacy("showFollowers")}
                    theme={theme}
                  />
                  <ToggleRow
                    label="Show Following Count"
                    description="Display following on your profile"
                    value={privacy.showFollowing}
                    onChange={() => togglePrivacy("showFollowing")}
                    theme={theme}
                  />
                  <ToggleRow
                    label="Profile Searchable"
                    description="Let others find you via search"
                    value={privacy.profileSearchable}
                    onChange={() => togglePrivacy("profileSearchable")}
                    theme={theme}
                  />
                </div>
              </SectionCard>
            </div>

            {/* Right — Preferences + Danger */}
            <div className="space-y-6">

              <SectionCard
                title="Preferences"
                description="Customize your experience"
                icon={<Bell className="w-4 h-4" />}
                theme={theme}
              >
                <div className="space-y-1">
                  <ToggleRow
                    label="Dark Mode"
                    description="Switch to dark theme"
                    value={preferences.darkMode}
                    onChange={() => togglePreference("darkMode")}
                    theme={theme}
                    icon={preferences.darkMode
                      ? <Moon className="w-3.5 h-3.5 text-blue-400" />
                      : <Sun className={`w-3.5 h-3.5 ${isLight ? "text-amber-500" : "text-slate-400"}`} />
                    }
                  />
                  <ToggleRow
                    label="Email Notifications"
                    description="Receive email updates"
                    value={preferences.emailNotifications}
                    onChange={() => togglePreference("emailNotifications")}
                    theme={theme}
                  />
                  <ToggleRow
                    label="Weekly Digest"
                    description="Blog performance summary"
                    value={preferences.weeklyDigest}
                    onChange={() => togglePreference("weeklyDigest")}
                    theme={theme}
                  />
                  <ToggleRow
                    label="Public Profile"
                    description="Visible to everyone"
                    value={preferences.profilePublic}
                    onChange={() => togglePreference("profilePublic")}
                    theme={theme}
                  />
                  <ToggleRow
                    label="Allow Comments"
                    description="Readers can comment on posts"
                    value={preferences.allowComments}
                    onChange={() => togglePreference("allowComments")}
                    theme={theme}
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="Danger Zone"
                description="Irreversible actions"
                icon={<AlertCircle className="w-4 h-4" />}
                theme={theme}
                danger
              >
                <p className={`text-xs leading-relaxed mb-4 ${isLight ? "text-red-700" : "text-red-400/80"}`}>
                  Deleting your account permanently removes all your posts, comments, and data. There is no way to recover it.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}
                >
                  {isDeletingAccount
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting…</>
                    : <><Trash2 className="w-4 h-4" /> Delete Account</>
                  }
                </button>
              </SectionCard>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <PasswordModal
          theme={theme}
          userEmail={user?.email}
          onClose={() => setShowPasswordModal(false)}
          onToast={toast}
        />
      )}
      <ConfirmModal theme={theme} />
    </>
  );
}
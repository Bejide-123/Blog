import { useState, useEffect, useRef } from "react";
import {
  X,
  FileText,
  Clock,
  Trash2,
  Edit3,
  ChevronRight,
  BookOpen,
  Loader2,
  FolderOpen,
  Hash,
  MoreVertical,
  PenLine,
  Sparkles,
  RefreshCw,
  Search,
  PlusCircle,
} from "lucide-react";
import { useUser } from '../../Context/userContext';
import { getAllDraftsForUser, deleteDraft } from "../../Services/post";
import { useNavigate } from "react-router-dom";

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function readTime(wc) { return Math.max(1, Math.ceil(wc / 200)); }

function excerpt(content, max = 100) {
  if (!content) return "No content yet…";
  return content.length > max ? content.slice(0, max).trimEnd() + "…" : content;
}

const CARD_ACCENTS = [
  { from: "#6366f1", to: "#8b5cf6" },
  { from: "#0ea5e9", to: "#6366f1" },
  { from: "#8b5cf6", to: "#ec4899" },
  { from: "#14b8a6", to: "#6366f1" },
  { from: "#f59e0b", to: "#ef4444" },
];

// ─── Draft Card ───────────────────────────────────────────────────────────────
function DraftCard({ draft, theme, onEdit, onDelete, index }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hovered, setHovered] = useState(false);
  const menuRef = useRef(null);

  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
  const isLight = theme === "light";
  const title = draft.title?.trim() || "Untitled Draft";
  const isUntitled = !draft.title?.trim();

  useEffect(() => {
    const fn = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(draft.id);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleting(false);
      setMenuOpen(false);
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "both" }}
      className={`
        group relative rounded-2xl overflow-hidden
        transition-all duration-300 ease-out
        animate-[fadeSlideIn_0.35s_ease_both]
        ${hovered ? "scale-[1.015] -translate-y-0.5" : "scale-100 translate-y-0"}
        ${isLight
          ? "bg-white shadow-sm hover:shadow-xl border border-gray-100 hover:border-transparent"
          : "bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600/80"
        }
      `}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full transition-all duration-300"
        style={{
          background: hovered
            ? `linear-gradient(to bottom, ${accent.from}, ${accent.to})`
            : isLight ? "#e5e7eb" : "#334155",
        }}
      />

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 0% 50%, ${accent.from}12 0%, transparent 65%)` }}
      />

      <div className="pl-5 pr-4 pt-4 pb-3.5 relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex-1 min-w-0">
            {isUntitled && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider mb-1.5
                ${isLight ? "bg-amber-50 text-amber-500" : "bg-amber-900/20 text-amber-400"}`}>
                <PenLine className="w-2.5 h-2.5" />
                Untitled
              </span>
            )}
            <h3 className={`font-semibold text-sm leading-snug line-clamp-2
              ${isLight ? "text-gray-900" : "text-gray-100"}`}>
              {title}
            </h3>
          </div>

          <div className="relative flex-shrink-0 mt-0.5" ref={menuRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen((p) => !p); }}
              className={`p-1.5 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100
                ${isLight ? "hover:bg-gray-100 text-gray-400 hover:text-gray-700" : "hover:bg-slate-700 text-slate-500 hover:text-gray-300"}`}
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {menuOpen && (
              <div className={`absolute right-0 top-8 z-[60] w-44 rounded-xl overflow-hidden py-1 shadow-2xl ring-1
                ${isLight ? "bg-white ring-gray-100 shadow-gray-200/80" : "bg-slate-800 ring-slate-700 shadow-black/40"}`}>
                <button
                  onClick={() => { onEdit(draft); setMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium transition-colors
                    ${isLight ? "hover:bg-gray-50 text-gray-700" : "hover:bg-slate-700/60 text-gray-300"}`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Continue editing
                </button>
                <div className={`mx-3 my-1 h-px ${isLight ? "bg-gray-100" : "bg-slate-700"}`} />
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium transition-colors
                    ${isLight ? "hover:bg-red-50 text-red-500" : "hover:bg-red-900/20 text-red-400"}`}
                >
                  {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Delete draft
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Excerpt */}
        <p className={`text-xs leading-relaxed mb-3 line-clamp-2 ${isLight ? "text-gray-500" : "text-slate-400"}`}>
          {excerpt(draft.content)}
        </p>

        {/* Tags */}
        {draft.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {draft.tags.slice(0, 3).map((tag) => (
              <span key={tag}
                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11px] font-medium
                  ${isLight ? "bg-slate-100 text-slate-500" : "bg-slate-700/70 text-slate-400"}`}>
                <Hash className="w-2.5 h-2.5 opacity-60" />
                {tag}
              </span>
            ))}
            {draft.tags.length > 3 && (
              <span className={`text-[11px] px-1.5 py-0.5 rounded-md ${isLight ? "text-gray-400 bg-gray-50" : "text-slate-500 bg-slate-700/40"}`}>
                +{draft.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2.5 text-[11px] ${isLight ? "text-gray-400" : "text-slate-500"}`}>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo(draft.updated_at)}
            </span>
            <span className={`w-px h-3 ${isLight ? "bg-gray-200" : "bg-slate-700"}`} />
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {readTime(draft.word_count)} min
            </span>
          </div>

          <button
            onClick={() => onEdit(draft)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white shadow-md
              opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0
              transition-all duration-200"
            style={{ background: `linear-gradient(135deg, ${accent.from}, ${accent.to})` }}
          >
            Continue
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ theme, onClose }) {
  const isLight = theme === "light";
  const navigate = useNavigate();

  const handleCreateStory = () => {
    onClose?.();
    navigate("/create-post");
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className={`relative w-20 h-20 rounded-3xl flex items-center justify-center mb-5
        ${isLight ? "bg-gradient-to-br from-slate-100 to-slate-50" : "bg-gradient-to-br from-slate-700 to-slate-800"}`}>
        <FolderOpen className={`w-9 h-9 ${isLight ? "text-slate-400" : "text-slate-500"}`} />
        <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center
          ${isLight ? "bg-blue-100" : "bg-blue-900/40"}`}>
          <PenLine className={`w-2.5 h-2.5 ${isLight ? "text-blue-500" : "text-blue-400"}`} />
        </div>
      </div>
      <h3 className={`font-bold text-sm mb-2 ${isLight ? "text-gray-800" : "text-gray-200"}`}>
        Nothing saved yet
      </h3>
      <p className={`text-xs leading-relaxed max-w-[220px] ${isLight ? "text-gray-400" : "text-slate-500"}`}>
        Your drafts will live here. Start writing and hit "Save Draft" to keep your progress.
      </p>
      <button
        onClick={handleCreateStory}
        className={`mt-4 px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2
          ${isLight 
            ? "bg-blue-500 text-white hover:bg-blue-600 shadow-sm hover:shadow" 
            : "bg-blue-600 text-white hover:bg-blue-700"}`}
      >
        <PlusCircle className="w-3.5 h-3.5" />
        Create New Story
      </button>
    </div>
  );
}

// ─── Toast Notification ───────────────────────────────────────────────────────
function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[70] animate-[fadeSlideUp_0.3s_ease]`}>
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg text-sm font-medium
        ${type === "success" 
          ? "bg-green-500 text-white" 
          : "bg-red-500 text-white"}`}>
        {type === "success" ? "✓" : "⚠️"} {message}
      </div>
    </div>
  );
}

// ─── Main DraftsPanel ─────────────────────────────────────────────────────────
export default function DraftsPanel({ theme, onEditDraft }) {
  const { user } = useUser(); // Get user from context
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [filteredDrafts, setFilteredDrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [refreshSuccess, setRefreshSuccess] = useState(false);

  const isLight = theme === "light";

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const fetchDrafts = async (showRefreshAnimation = false) => {
    if (!user?.id) {
      console.log("No user ID available");
      return;
    }
    
    if (showRefreshAnimation) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const data = await getAllDraftsForUser(user.id);
      setDrafts(data || []);
      setFetched(true);
      
      if (showRefreshAnimation) {
        setRefreshSuccess(true);
        showToast("Drafts refreshed successfully", "success");
        setTimeout(() => setRefreshSuccess(false), 2000);
      }
    } catch (error) {
      console.error("Error fetching drafts:", error);
      if (showRefreshAnimation) {
        showToast("Failed to refresh drafts", "error");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filter drafts based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDrafts(drafts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = drafts.filter(draft => 
        draft.title?.toLowerCase().includes(query) ||
        draft.content?.toLowerCase().includes(query) ||
        draft.tags?.some(tag => tag.toLowerCase().includes(query))
      );
      setFilteredDrafts(filtered);
    }
  }, [searchQuery, drafts]);

  useEffect(() => {
    if (open && !fetched && user?.id) {
      fetchDrafts(false);
    }
  }, [open, fetched, user?.id]);

  // Keyboard shortcut: Cmd/Ctrl + K to open/close drafts panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      // Escape key to close
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Animate badge when drafts count changes
  useEffect(() => {
    if (drafts.length > 0) {
      const badge = document.querySelector('.draft-count-badge');
      if (badge) {
        badge.classList.add('animate-pulse');
        setTimeout(() => badge.classList.remove('animate-pulse'), 500);
      }
    }
  }, [drafts.length]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleDelete = async (id) => {
    try {
      const result = await deleteDraft(id);
      if (result) {
        setDrafts((prev) => prev.filter((d) => d.id !== id));
        showToast("Draft deleted successfully", "success");
      }
    } catch (error) {
      console.error("Error deleting draft:", error);
      showToast("Failed to delete draft", "error");
    }
  };

  const handleEdit = (draft) => {
    setOpen(false);
    onEditDraft?.(draft);
  };

  const handleRefresh = () => {
    fetchDrafts(true);
  };

  const handleCreateNew = () => {
    setOpen(false);
    navigate("/create-post");
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-pulse {
          animation: pulse 0.5s ease-in-out;
        }
      `}</style>

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* ── Trigger button ── */}
      <button
        onClick={() => setOpen(true)}
        className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
          ${isLight
            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
            : "bg-slate-800 text-gray-300 hover:bg-slate-700"
          }`}
        title="Press Ctrl+K to open"
      >
        <FileText className="w-4 h-4" />
        <span className="hidden sm:inline">Drafts</span>
        {fetched && drafts.length > 0 && (
          <span className="draft-count-badge absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-sm">
            {drafts.length > 9 ? "9+" : drafts.length}
          </span>
        )}
      </button>

      {/* ── Backdrop ── */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 transition-all duration-300
          ${open ? "bg-black/30 backdrop-blur-[2px] pointer-events-auto" : "bg-transparent pointer-events-none opacity-0"}`}
      />

      {/* ── Sidebar panel ── */}
      <div
        className={`fixed top-0 right-0 h-full z-50 flex flex-col
          w-full sm:w-[400px] md:w-[440px]
          transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isLight ? "bg-gray-50/95 backdrop-blur-xl" : "bg-slate-900/95 backdrop-blur-xl"}
          ${open ? "translate-x-0 shadow-[-12px_0_60px_rgba(0,0,0,0.15)]" : "translate-x-full"}
        `}
      >
        {/* Left border glow line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-violet-500/40 to-transparent" />

        {/* ── Panel header ── */}
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                {drafts.length > 0 && (
                  <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full bg-violet-500 text-white ring-2
                    ${isLight ? "ring-gray-50" : "ring-slate-900"}`}>
                    {drafts.length > 9 ? "9+" : drafts.length}
                  </span>
                )}
              </div>
              <div>
                <h2 className={`font-bold text-[15px] tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
                  Saved Drafts
                </h2>
                <p className={`text-[11px] ${isLight ? "text-gray-400" : "text-slate-500"}`}>
                  {loading ? "Loading…" : fetched
                    ? `${drafts.length} ${drafts.length === 1 ? "story" : "stories"} in progress`
                    : "Your writing, saved"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200
                  ${isLight 
                    ? "hover:bg-gray-200 text-gray-500 hover:text-gray-700" 
                    : "hover:bg-slate-700/80 text-slate-500 hover:text-gray-300"}
                  ${refreshing ? "cursor-not-allowed opacity-50" : ""}`}
                title="Refresh drafts"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              </button>

              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                className={`w-8 h-8 flex items-center justify-center rounded-xl transition-colors
                  ${isLight ? "hover:bg-gray-200 text-gray-400 hover:text-gray-700" : "hover:bg-slate-700/80 text-slate-500 hover:text-gray-300"}`}
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-5 pb-3">
            <div className={`relative flex items-center rounded-xl border transition-all
              ${isLight 
                ? "bg-white border-gray-200 focus-within:border-blue-400" 
                : "bg-slate-800 border-slate-700 focus-within:border-blue-500"}`}>
              <Search className={`absolute left-3 w-3.5 h-3.5 ${isLight ? "text-gray-400" : "text-slate-500"}`} />
              <input
                type="text"
                placeholder="Search drafts by title, content, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 text-xs bg-transparent rounded-xl focus:outline-none
                  ${isLight ? "text-gray-700 placeholder:text-gray-400" : "text-gray-300 placeholder:text-slate-500"}`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className={`absolute right-3 p-0.5 rounded-md transition-colors
                    ${isLight ? "hover:bg-gray-100 text-gray-400" : "hover:bg-slate-700 text-slate-500"}`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          
          <div className={`mx-5 h-px ${isLight ? "bg-gray-200" : "bg-slate-700/60"}`} />
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {(loading || refreshing) && drafts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
              <p className={`text-xs font-medium ${isLight ? "text-gray-400" : "text-slate-500"}`}>
                Fetching your drafts…
              </p>
            </div>
          ) : filteredDrafts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              {searchQuery ? (
                <>
                  <Search className={`w-12 h-12 mb-4 ${isLight ? "text-gray-300" : "text-slate-600"}`} />
                  <h3 className={`font-semibold text-sm mb-2 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    No matching drafts
                  </h3>
                  <p className={`text-xs ${isLight ? "text-gray-400" : "text-slate-500"}`}>
                    No drafts found for "{searchQuery}"
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className={`mt-3 text-xs font-medium ${isLight ? "text-blue-500 hover:text-blue-600" : "text-blue-400 hover:text-blue-300"}`}
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <EmptyState theme={theme} onClose={() => setOpen(false)} />
              )}
            </div>
          ) : (
            <div className="px-4 pt-4 pb-6 space-y-3">
              <div className="flex items-center justify-between px-1 mb-1">
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-3 h-3 ${isLight ? "text-violet-500" : "text-violet-400"}`} />
                  <span className={`text-[11px] font-semibold uppercase tracking-widest ${isLight ? "text-gray-400" : "text-slate-500"}`}>
                    In Progress
                  </span>
                  {searchQuery && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${isLight ? "bg-gray-100 text-gray-500" : "bg-slate-700 text-slate-400"}`}>
                      {filteredDrafts.length} result{filteredDrafts.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                {refreshing && (
                  <div className="flex items-center gap-1">
                    <Loader2 className={`w-3 h-3 animate-spin ${isLight ? "text-gray-400" : "text-slate-500"}`} />
                    <span className={`text-[10px] ${isLight ? "text-gray-400" : "text-slate-500"}`}>
                      Refreshing...
                    </span>
                  </div>
                )}
              </div>
              {filteredDrafts.map((draft, i) => (
                <DraftCard
                  key={draft.id}
                  draft={draft}
                  theme={theme}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {!loading && drafts.length > 0 && (
          <div className={`flex-shrink-0 px-5 py-3.5 border-t
            ${isLight ? "border-gray-100 bg-white/60" : "border-slate-800 bg-slate-900/60"}`}>
            <div className="flex items-center justify-between">
              <p className={`text-[11px] ${isLight ? "text-gray-400" : "text-slate-600"}`}>
                Auto-saved while you write
              </p>
              <button
                onClick={handleCreateNew}
                className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors
                  ${isLight ? "text-blue-500 hover:text-blue-600" : "text-blue-400 hover:text-blue-300"}`}
              >
                <PlusCircle className="w-3 h-3" />
                New story
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
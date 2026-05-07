import { useState, useEffect, useRef, useContext } from "react";
import {
  Search, Send, ArrowLeft, MoreVertical,
  ImagePlus, Smile, Check, CheckCheck, Edit2,
  MessageSquarePlus, X, Loader2, Mic,
  Play, Pause, StopCircle, ChevronDown,
  Phone, Video, Info, Trash2, Copy, Pencil,
  Menu,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavbarPrivate from "../../Components/Private/Navbarprivate";
import { UserContext } from "../../Context/userContext";
import { useTheme } from "../../Context/themeContext";
import { getUserFollowers, getUserFollowing } from "../../Services/user";
import { supabase } from "../../lib/supabase";

// ─── Constants ────────────────────────────────────────────────────────────────
const EMOJI_GROUPS = {
  "😊": ["😊","😂","🤣","❤️","😍","🥰","😘","😭","😩","🤔","😅","🙏","💯","🔥","✨","🎉","👏","💪","🙌","❤️‍🔥"],
  "👍": ["👍","👎","👋","🤝","✌️","🤞","🤙","💅","🫶","🫠","🥹","😮","😱","🤯","🥳","🤩","😎","🤓","🫡","🥴"],
  "🌍": ["🌍","🌸","🌺","🌻","🍕","🍔","☕","🎵","🎮","⚽","🏆","💎","🚀","🌙","⭐","🌈","🦋","🐶","🐱","🦁"],
};
const QUICK_REACTIONS = ["❤️","😂","😮","😢","👍","🔥"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const av = (u) => u?.avatar_url || u?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u?.username || u?.id || "u"}`;
const fmtDur = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
const fmtTime = (d) => {
  const D = new Date(d), N = new Date(), h = (N - D) / 3.6e6;
  return h < 1 ? `${Math.floor((N - D) / 6e4)}m` : h < 24 ? `${Math.floor(h)}h` : D.toLocaleDateString();
};

// ─── Status icon ──────────────────────────────────────────────────────────────
function Tick({ status }) {
  if (status === "read") return <CheckCheck className="w-3 h-3 text-blue-300" />;
  if (status === "delivered") return <CheckCheck className="w-3 h-3 text-white/30" />;
  return <Check className="w-3 h-3 text-white/30" />;
}

// ─── Voice waveform ───────────────────────────────────────────────────────────
const BARS = [3,5,8,6,10,7,4,9,6,5,8,10,7,4,6,9,5,8,3,6,10,7,4,8,5,9,6,4];

function VoiceBubble({ duration, isMine, isLight }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  return (
    <div className="flex items-center gap-2.5 min-w-[170px] max-w-[220px]">
      <button
        onClick={() => setPlaying(p => !p)}
        className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full transition-all
          ${isMine ? "bg-white/20 hover:bg-white/35" : isLight ? "bg-blue-100 hover:bg-blue-200 text-blue-600" : "bg-slate-600 hover:bg-slate-500 text-blue-400"}`}
      >
        {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>
      <div className="flex items-center gap-[2px] flex-1">
        {BARS.map((h, i) => (
          <div key={i} className="rounded-full flex-shrink-0"
            style={{
              width: 2, height: h * 2,
              background: isMine
                ? progress > (i / BARS.length) * 100 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.28)"
                : progress > (i / BARS.length) * 100
                  ? isLight ? "#3b82f6" : "#60a5fa"
                  : isLight ? "#cbd5e1" : "#475569",
            }}
          />
        ))}
      </div>
      <span className={`text-[10px] font-medium tabular-nums flex-shrink-0
        ${isMine ? "text-white/60" : isLight ? "text-gray-500" : "text-slate-400"}`}>
        {fmtDur(duration || 0)}
      </span>
    </div>
  );
}

// ─── Message action menu ──────────────────────────────────────────────────────
function ActionMenu({ isMine, isLight, onReact, onCopy, onEdit, onDelete, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [onClose]);

  return (
    <div ref={ref}
      className={`absolute z-50 rounded-2xl border shadow-2xl overflow-hidden
        ${isMine ? "right-0" : "left-0"} bottom-full mb-2
        ${isLight ? "bg-white border-gray-200/80 shadow-gray-200/60" : "bg-slate-800 border-slate-700 shadow-black/40"}`}
      style={{ minWidth: 168 }}
    >
      {/* Reactions */}
      <div className={`flex items-center gap-0.5 px-2.5 py-2 border-b
        ${isLight ? "border-gray-100" : "border-slate-700/60"}`}>
        {QUICK_REACTIONS.map(em => (
          <button key={em} onClick={() => { onReact(em); onClose(); }}
            className={`text-lg w-8 h-8 flex items-center justify-center rounded-xl transition-all hover:scale-125
              ${isLight ? "hover:bg-gray-50" : "hover:bg-slate-700"}`}>
            {em}
          </button>
        ))}
      </div>
      {/* Actions */}
      <div className="py-1">
        {[
          { label: "Copy text", icon: Copy, action: onCopy, always: true },
          { label: "Edit", icon: Pencil, action: onEdit, always: false },
        ].filter(a => a.always || isMine).map(({ label, icon: Icon, action }) => (
          <button key={label} onClick={() => { action(); onClose(); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors
              ${isLight ? "hover:bg-gray-50 text-gray-700" : "hover:bg-slate-700/60 text-gray-300"}`}>
            <Icon className="w-3.5 h-3.5 opacity-50" />
            {label}
          </button>
        ))}
        <div className={`mx-3 my-1 h-px ${isLight ? "bg-gray-100" : "bg-slate-700/60"}`} />
        <button onClick={() => { onDelete(); onClose(); }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors
            ${isLight ? "hover:bg-red-50 text-red-500" : "hover:bg-red-900/20 text-red-400"}`}>
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function Bubble({ msg, isLight, prevMine, currentUserId, currentUser, otherUser, onDelete, onEdit }) {
  const isMine = msg.sender_id === currentUserId;
  const sameGroup = prevMine === isMine;
  const [showMenu, setShowMenu] = useState(false);
  const [reactions, setReactions] = useState(msg.reactions || []);

  const src = isMine ? av(currentUser) : av(otherUser);

  const handleReact = (em) => {
    setReactions(prev => {
      const has = prev.find(r => r.emoji === em && r.mine);
      return has ? prev.filter(r => !(r.emoji === em && r.mine)) : [...prev, { emoji: em, mine: true }];
    });
  };

  return (
    <div className={`flex items-end gap-2 group/bubble
      ${isMine ? "flex-row-reverse" : "flex-row"}
      ${sameGroup ? "mt-0.5" : "mt-3 sm:mt-5"}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 transition-opacity ${sameGroup ? "opacity-0" : "opacity-100"}`}>
        <img src={src} alt=""
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover ring-2"
          style={{ ringColor: isLight ? "#e5e7eb" : "rgba(255,255,255,0.08)" }}
        />
      </div>

      {/* Content */}
      <div className={`relative flex flex-col max-w-[75%] sm:max-w-[72%] ${isMine ? "items-end" : "items-start"}`}>

        {/* ⋮ trigger */}
        <div className={`absolute top-1/2 -translate-y-1/2 z-10
          opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-150
          ${isMine ? "-left-7" : "-right-7"}`}>
          <button onClick={(e) => { e.stopPropagation(); setShowMenu(p => !p); }}
            className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors
              ${isLight ? "bg-gray-100 hover:bg-gray-200 text-gray-500" : "bg-slate-700 hover:bg-slate-600 text-slate-400"}`}>
            <MoreVertical className="w-3 h-3" />
          </button>
        </div>

        {/* Menu */}
        {showMenu && (
          <ActionMenu isMine={isMine} isLight={isLight}
            onReact={handleReact}
            onCopy={() => msg.content && navigator.clipboard.writeText(msg.content)}
            onEdit={() => onEdit?.(msg)}
            onDelete={() => onDelete?.(msg.id)}
            onClose={() => setShowMenu(false)}
          />
        )}

        {/* Bubble */}
        <div
          className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm leading-relaxed relative
            ${isMine
              ? "text-white rounded-2xl rounded-br-sm"
              : isLight
                ? "bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100/80 shadow-sm"
                : "bg-slate-700/80 text-gray-100 rounded-2xl rounded-bl-sm border border-slate-600/30"
            }`}
          style={isMine ? { background: "linear-gradient(135deg,#2563eb,#5b21b6)" } : {}}
        >
          {/* Image */}
          {msg.type === "image" && msg.image_url && (
            <div className="-mx-4 -mt-2.5 mb-2 overflow-hidden rounded-t-2xl">
              <img src={msg.image_url} alt="shared" className="w-full max-w-[240px] object-cover" style={{ maxHeight: 180 }} />
            </div>
          )}

          {/* Voice */}
          {msg.type === "voice"
            ? <VoiceBubble duration={msg.voice_duration} isMine={isMine} isLight={isLight} />
            : msg.content && (
              <p className="break-words whitespace-pre-wrap">
                {msg.content}
                {msg.edited && (
                  <span className={`ml-1.5 text-[10px] italic ${isMine ? "text-white/40" : isLight ? "text-gray-400" : "text-slate-500"}`}>
                    edited
                  </span>
                )}
              </p>
            )
          }

          {/* Meta */}
          <div className={`flex items-center gap-1 mt-1.5 ${isMine ? "justify-end" : "justify-start"}`}>
            <span className={`text-[10px] tabular-nums
              ${isMine ? "text-white/45" : isLight ? "text-gray-400" : "text-slate-500"}`}>
              {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            {isMine && <Tick status={msg.status} />}
          </div>
        </div>

        {/* Reactions */}
        {reactions.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
            {reactions.map((r, i) => (
              <button key={i} onClick={() => handleReact(r.emoji)}
                className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs border transition-all
                  ${r.mine
                    ? isLight ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-blue-900/30 border-blue-700 text-blue-300"
                    : isLight ? "bg-gray-50 border-gray-200 text-gray-600" : "bg-slate-700 border-slate-600 text-gray-300"
                  }`}>
                {r.emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Date divider ─────────────────────────────────────────────────────────────
function DateDivider({ label, isLight }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 my-4 sm:my-6">
      <div className={`flex-1 h-px ${isLight ? "bg-gray-100" : "bg-slate-700/50"}`} />
      <span className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.1em] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full
        ${isLight ? "bg-gray-100 text-gray-400" : "bg-slate-700/50 text-slate-500"}`}>
        {label}
      </span>
      <div className={`flex-1 h-px ${isLight ? "bg-gray-100" : "bg-slate-700/50"}`} />
    </div>
  );
}

// ─── Emoji picker ─────────────────────────────────────────────────────────────
function EmojiPicker({ onSelect, onClose, isLight }) {
  const [tab, setTab] = useState("😊");
  const ref = useRef(null);
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [onClose]);
  return (
    <div ref={ref}
      className={`absolute bottom-full mb-3 left-0 z-50 rounded-2xl border shadow-2xl overflow-hidden
        ${isLight ? "bg-white border-gray-200" : "bg-slate-800 border-slate-700"}`}
      style={{ width: 296 }}
    >
      <div className={`flex border-b ${isLight ? "border-gray-100" : "border-slate-700/60"}`}>
        {Object.keys(EMOJI_GROUPS).map(g => (
          <button key={g} onClick={() => setTab(g)}
            className={`flex-1 py-2.5 text-lg transition-colors
              ${tab === g ? isLight ? "bg-blue-50" : "bg-blue-900/20" : isLight ? "hover:bg-gray-50" : "hover:bg-slate-700/40"}`}>
            {g}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-8 gap-0 p-2 max-h-44 overflow-y-auto">
        {EMOJI_GROUPS[tab].map(em => (
          <button key={em} onClick={() => onSelect(em)}
            className={`text-xl h-9 flex items-center justify-center rounded-xl transition-all hover:scale-110
              ${isLight ? "hover:bg-gray-100" : "hover:bg-slate-700"}`}>
            {em}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Recording bar ────────────────────────────────────────────────────────────
function RecordBar({ elapsed, onStop, onCancel, isLight }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border
      ${isLight ? "bg-red-50 border-red-100" : "bg-red-950/40 border-red-900/40"}`}>
      <span className="relative flex-shrink-0">
        <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75 animate-ping" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
      </span>
      <span className={`text-sm font-semibold flex-1 tabular-nums ${isLight ? "text-red-700" : "text-red-400"}`}>
        {fmtDur(elapsed)}
      </span>
      <button onClick={onCancel}
        className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-medium
          ${isLight ? "text-gray-500 hover:bg-gray-100" : "text-slate-400 hover:bg-slate-700"}`}>
        Cancel
      </button>
      <button onClick={onStop}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-colors">
        <StopCircle className="w-3.5 h-3.5" />
        Send
      </button>
    </div>
  );
}

// ─── Conversation item ────────────────────────────────────────────────────────
function ConvItem({ conv, active, onClick, theme }) {
  const isLight = theme === "light";
  const rColors = {
    mutual:    isLight ? "bg-emerald-100 text-emerald-700" : "bg-emerald-900/30 text-emerald-400",
    follower:  isLight ? "bg-gray-100 text-gray-500" : "bg-slate-700 text-slate-400",
    following: isLight ? "bg-blue-100 text-blue-700" : "bg-blue-900/30 text-blue-400",
  };
  const rLabel = { mutual: "Mutual", follower: "Follows you", following: "Following" };

  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 sm:py-3.5 transition-all duration-150 text-left relative
        ${active
          ? isLight ? "bg-blue-50/80 border-r-2 border-blue-500" : "bg-blue-900/15 border-r-2 border-blue-500"
          : isLight ? "hover:bg-gray-50" : "hover:bg-slate-700/25"
        }`}
    >
      <div className="relative flex-shrink-0">
        <img src={av(conv.user)} alt={conv.user.full_name}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-cover ring-2 ${isLight ? "ring-gray-200" : "ring-slate-700"}`}
        />
        {conv.user.online && (
          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ${isLight ? "ring-white" : "ring-slate-800"}`} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={`font-semibold text-xs sm:text-sm truncate flex-1 ${isLight ? "text-gray-900" : "text-white"}`}>
            {conv.user.full_name}
          </span>
          {conv.user.relation && (
            <span className={`text-[8px] sm:text-[9px] font-semibold px-1 sm:px-1.5 py-0.5 rounded-md flex-shrink-0 ${rColors[conv.user.relation]}`}>
              {rLabel[conv.user.relation]}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className={`text-xs truncate flex-1
            ${conv.last_message?.unread > 0
              ? isLight ? "text-gray-900 font-semibold" : "text-white font-semibold"
              : isLight ? "text-gray-400" : "text-slate-500"}`}>
            {conv.last_message?.mine && (
              <span className={`mr-1 font-normal ${isLight ? "text-gray-400" : "text-slate-500"}`}>You:</span>
            )}
            {conv.last_message?.text || <span className="italic">Start a conversation</span>}
          </p>
          <div className="flex flex-col items-end flex-shrink-0 gap-1">
            <span className={`text-[9px] sm:text-[10px] tabular-nums
              ${conv.last_message?.unread > 0 ? "text-blue-500 font-semibold" : isLight ? "text-gray-400" : "text-slate-500"}`}>
              {conv.last_message?.time}
            </span>
            {conv.last_message?.unread > 0 && (
              <span className="w-4 h-4 min-w-[16px] px-0.5 rounded-full bg-blue-600 text-white text-[8px] font-bold flex items-center justify-center">
                {conv.last_message.unread > 9 ? "9+" : conv.last_message.unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Empty chat ───────────────────────────────────────────────────────────────
function EmptyState({ theme }) {
  const isLight = theme === "light";
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 sm:gap-5 p-6 sm:p-8 text-center select-none">
      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center
        ${isLight ? "bg-gradient-to-br from-blue-50 to-violet-50" : "bg-gradient-to-br from-blue-900/20 to-violet-900/20"}`}>
        <MessageSquarePlus className={`w-8 h-8 sm:w-9 sm:h-9 ${isLight ? "text-blue-500" : "text-blue-400"}`} />
      </div>
      <div>
        <h3 className={`font-bold text-sm sm:text-base mb-1 ${isLight ? "text-gray-900" : "text-white"}`}>
          Your Messages
        </h3>
        <p className={`text-xs sm:text-sm max-w-[240px] leading-relaxed ${isLight ? "text-gray-400" : "text-slate-500"}`}>
          Select a conversation or follow a writer to start chatting.
        </p>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MessagesPage() {
  const { theme } = useTheme();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isLight = theme === "light";

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [sending, setSending] = useState(false);
  // mobile: "list" | "chat"
  const [mobileView, setMobileView] = useState("list");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState(null);
  const [editingMsg, setEditingMsg] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recElapsed, setRecElapsed] = useState(0);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const endRef = useRef(null);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const recTimerRef = useRef(null);

  const activeConv = conversations.find(c => c.id === activeId);
  const totalUnread = conversations.reduce((s, c) => s + (c.last_message?.unread || 0), 0);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      setRecElapsed(0);
      recTimerRef.current = setInterval(() => setRecElapsed(p => p + 1), 1000);
    } else {
      clearInterval(recTimerRef.current);
    }
    return () => clearInterval(recTimerRef.current);
  }, [isRecording]);

  const scrollToBottom = () => endRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 140);
  };

  const fetchFollowers = async () => {
    try { setFollowers(await getUserFollowers(user?.id) || []); } catch(e) { console.error(e); }
  };
  const fetchFollowing = async () => {
    try { setFollowing(await getUserFollowing(user?.id) || []); } catch(e) { console.error(e); }
  };

  const buildConversations = async () => {
    setLoading(true);
    const all = new Map();
    following.forEach(u => all.set(u.id, { ...u, source: "following" }));
    followers.forEach(u => {
      if (!all.has(u.id)) all.set(u.id, { ...u, source: "follower" });
      else { const ex = all.get(u.id); ex.source = "mutual"; }
    });
    const users = Array.from(all.values());
    if (!users.length) { setConversations([]); setLoading(false); return; }

    const convs = await Promise.all(users.map(async tu => {
      const roomId = [user?.id, tu.id].sort().join("_");
      const { data: lm } = await supabase.from("messages").select("*").eq("room_id", roomId).order("created_at", { ascending: false }).limit(1);
      const { count: unread } = await supabase.from("messages").select("*", { count: "exact", head: true }).eq("room_id", roomId).eq("receiver_id", user?.id).eq("is_read", false);
      const msg = lm?.[0];
      return {
        id: tu.id,
        user: { id: tu.id, full_name: tu.full_name, username: tu.username, avatar_url: tu.avatar_url, online: false, relation: tu.source },
        last_message: msg ? { text: msg.content, time: fmtTime(msg.created_at), unread: unread || 0, mine: msg.sender_id === user?.id } : null,
      };
    }));
    convs.sort((a, b) => a.last_message ? -1 : 1);
    setConversations(convs);
    setLoading(false);
  };

  const loadMessages = async (otherId) => {
    const roomId = [user?.id, otherId].sort().join("_");
    const { data } = await supabase.from("messages").select("*").eq("room_id", roomId).order("created_at", { ascending: true });
    setMessages((data || []).map(m => ({ ...m, status: m.is_read ? "read" : "delivered" })));
    await supabase.from("messages").update({ is_read: true }).eq("room_id", roomId).eq("receiver_id", user?.id).eq("is_read", false);
    setConversations(prev => prev.map(c => c.id === otherId ? { ...c, last_message: c.last_message ? { ...c.last_message, unread: 0 } : null } : c));
  };

  const subscribeToMessages = (otherId) => {
    if (channel) channel.unsubscribe();
    const roomId = [user?.id, otherId].sort().join("_");
    const ch = supabase.channel(`chat:${roomId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` }, p => {
        setMessages(prev => [...prev, { ...p.new, status: "delivered" }]);
        setConversations(prev => prev.map(c => c.id === otherId ? { ...c, last_message: { text: p.new.content, time: "now", unread: p.new.receiver_id === user?.id ? (c.last_message?.unread || 0) + 1 : 0, mine: p.new.sender_id === user?.id } } : c));
        setTimeout(scrollToBottom, 80);
      }).subscribe();
    setChannel(ch);
  };

  const handleSend = async () => {
    if (!input.trim() || !activeId) return;
    if (editingMsg) {
      const { error } = await supabase.from("messages").update({ content: input.trim(), edited: true }).eq("id", editingMsg.id);
      if (!error) setMessages(prev => prev.map(m => m.id === editingMsg.id ? { ...m, content: input.trim(), edited: true } : m));
      setEditingMsg(null); setInput("");
      return;
    }
    setSending(true);
    const roomId = [user?.id, activeId].sort().join("_");
    const { data, error } = await supabase.from("messages").insert({ content: input.trim(), sender_id: user?.id, receiver_id: activeId, room_id: roomId, is_read: false }).select().single();
    if (!error && data) {
      setMessages(prev => [...prev, { ...data, status: "delivered" }]);
      setConversations(prev => prev.map(c => c.id === activeId ? { ...c, last_message: { text: input.trim(), time: "now", unread: 0, mine: true } } : c));
      setInput("");
      setTimeout(scrollToBottom, 80);
    }
    setSending(false);
  };

  const handleDeleteMessage = async (id) => {
    await supabase.from("messages").delete().eq("id", id);
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const handleEditMessage = (msg) => {
    setEditingMsg(msg);
    setInput(msg.content);
    inputRef.current?.focus();
  };

  const handleSelectConv = async (id) => {
    setActiveId(id); setInput(""); setShowEmoji(false);
    setImagePreview(null); setIsRecording(false); setEditingMsg(null);
    await loadMessages(id);
    subscribeToMessages(id);
    setMobileView("chat");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    if (e.key === "Escape" && editingMsg) { setEditingMsg(null); setInput(""); }
  };

  useEffect(() => { if (user?.id) { fetchFollowers(); fetchFollowing(); } }, [user?.id]);
  useEffect(() => { if (user?.id) buildConversations(); }, [followers, following]);
  useEffect(() => { return () => { if (channel) channel.unsubscribe(); }; }, [channel]);

  const filtered = conversations.filter(c =>
    c.user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.user.username?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && !conversations.length) {
    return (
      <>
        <NavbarPrivate />
        <div className={`min-h-screen pt-20 flex items-center justify-center ${isLight ? "bg-gray-50" : "bg-slate-900"}`}>
          <div className="flex flex-col items-center gap-3">
            <Loader2 className={`w-8 h-8 animate-spin ${isLight ? "text-blue-600" : "text-blue-400"}`} />
            <p className={`text-sm ${isLight ? "text-gray-500" : "text-slate-400"}`}>Loading messages…</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
        .msg-in { animation: fadeUp 0.16s ease forwards; }
        @keyframes ping { 75%,100% { transform:scale(2); opacity:0; } }
        .animate-ping { animation: ping 1s cubic-bezier(0,0,0.2,1) infinite; }

        /* Hide scrollbars completely */
        .msgs-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .msgs-scroll::-webkit-scrollbar { display: none; width: 0; }
        
        .convs-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .convs-scroll::-webkit-scrollbar { display: none; width: 0; }
      `}</style>

      <NavbarPrivate />

      <div className={`fixed inset-0 pt-16 md:pt-20 flex flex-col ${isLight ? "bg-gray-100" : "bg-slate-950"}`}>
        <div className="flex-1 flex flex-col p-0 sm:p-3 md:p-4 lg:p-6 max-w-7xl mx-auto w-full min-h-0">
          <div className={`flex flex-1 overflow-hidden min-h-0
            sm:rounded-2xl sm:shadow-2xl sm:border
            ${isLight ? "sm:border-gray-200/60 bg-white" : "sm:border-slate-700/40 bg-slate-900"}`}
          >

            {/* ── Sidebar ── */}
            {/* On mobile: full screen when mobileView==="list", hidden otherwise */}
            {/* On sm+: always visible at fixed width */}
            <div className={`
              flex flex-col border-r overflow-hidden
              ${isLight ? "border-gray-100 bg-white" : "border-slate-700/50 bg-slate-900"}
              ${mobileView === "list" ? "flex w-full" : "hidden"}
              sm:flex sm:w-72 md:w-80 lg:w-96
            `}>
              {/* Sidebar header */}
              <div className={`px-3 sm:px-5 pt-3 sm:pt-4 pb-2.5 sm:pb-3 border-b flex-shrink-0
                ${isLight ? "border-gray-100" : "border-slate-700/50"}`}>
                <div className="flex items-center justify-between mb-2.5 sm:mb-3.5">
                  <div className="flex items-center gap-2">
                    <h1 className={`font-bold text-lg sm:text-xl tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
                      Messages
                    </h1>
                    {totalUnread > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold">
                        {totalUnread}
                      </span>
                    )}
                  </div>
                  <button className={`w-8 h-8 flex items-center justify-center rounded-lg sm:rounded-xl transition-colors
                    ${isLight ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"}`}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Search */}
                <div className={`flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-lg sm:rounded-xl
                  ${isLight ? "bg-gray-100" : "bg-slate-800"}`}>
                  <Search className={`w-3.5 h-3.5 flex-shrink-0 ${isLight ? "text-gray-400" : "text-slate-500"}`} />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search…"
                    className={`flex-1 bg-transparent text-xs focus:outline-none
                      ${isLight ? "text-gray-800 placeholder:text-gray-400" : "text-gray-200 placeholder:text-slate-500"}`}
                  />
                  {search && (
                    <button onClick={() => setSearch("")}>
                      <X className={`w-3 h-3 ${isLight ? "text-gray-400" : "text-slate-500"}`} />
                    </button>
                  )}
                </div>
              </div>

              {/* Conversation list */}
              <div className="flex-1 overflow-y-auto convs-scroll">
                {filtered.length === 0 ? (
                  <div className={`flex flex-col items-center justify-center h-full gap-3 py-12 px-6 text-center
                    ${isLight ? "text-gray-400" : "text-slate-500"}`}>
                    <MessageSquarePlus className="w-10 h-10 opacity-25" />
                    <div>
                      <p className="font-medium text-sm">No conversations</p>
                      <p className="text-xs mt-0.5">Follow writers to start messaging</p>
                    </div>
                  </div>
                ) : filtered.map(conv => (
                  <ConvItem key={conv.id} conv={conv} active={conv.id === activeId}
                    onClick={() => handleSelectConv(conv.id)} theme={theme} />
                ))}
              </div>
            </div>

            {/* ── Chat pane ── */}
            <div className={`flex-1 flex flex-col overflow-hidden min-w-0 h-full
              ${mobileView === "chat" ? "flex" : "hidden sm:flex"}
            `}>
              {!activeConv ? (
                <EmptyState theme={theme} />
              ) : (
                <>
                  {/* Chat header */}
                  <div className={`flex items-center justify-between px-3 sm:px-4 py-3 border-b flex-shrink-0
                    ${isLight ? "bg-white border-gray-100" : "bg-slate-900 border-slate-700/50"}`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      {/* Back button — mobile only */}
                      <button onClick={() => setMobileView("list")}
                        className={`sm:hidden flex-shrink-0 p-1.5 -ml-1.5 rounded-xl transition-colors
                          ${isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-slate-800 text-gray-400"}`}>
                        <ArrowLeft className="w-5 h-5" />
                      </button>

                      <div className="relative flex-shrink-0">
                        <img src={av(activeConv.user)} alt={activeConv.user.full_name}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-2xl object-cover ring-2 ${isLight ? "ring-gray-200" : "ring-slate-700"}`}
                        />
                        {activeConv.user.online && (
                          <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ${isLight ? "ring-white" : "ring-slate-900"}`} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className={`font-bold text-sm sm:text-base cursor-pointer hover:underline leading-tight truncate
                          ${isLight ? "text-gray-900" : "text-white"}`}
                          onClick={() => navigate(`/profile/${activeConv.user.id}`)}>
                          {activeConv.user.full_name}
                        </p>
                        <p className={`text-xs truncate ${isLight ? "text-gray-400" : "text-slate-500"}`}>
                          {activeConv.user.online
                            ? <span className="text-emerald-500 font-medium">Active now</span>
                            : `@${activeConv.user.username}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      {[
                        { Icon: Phone, label: "Call" },
                        { Icon: Video, label: "Video" },
                        { Icon: Info, label: "Info" },
                      ].map(({ Icon, label }) => (
                        <button key={label} title={label}
                          className={`w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg sm:rounded-xl transition-colors
                            ${isLight ? "hover:bg-gray-100 text-gray-500" : "hover:bg-slate-800 text-slate-400"}`}>
                          <Icon className="w-4 h-4" />
                        </button>
                      ))}
                      <button className={`w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg sm:rounded-xl transition-colors
                        ${isLight ? "hover:bg-gray-100 text-gray-500" : "hover:bg-slate-800 text-slate-400"}`}>
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div ref={containerRef} onScroll={handleScroll}
                    className={`flex-1 overflow-y-auto msgs-scroll px-3 sm:px-6 py-3 sm:py-4 pb-28 md:pb-8 lg:pb-4
                      ${isLight ? "bg-gray-50/60" : "bg-slate-950/60"}`}
                  >
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full gap-4">
                        <img src={av(activeConv.user)} className={`w-16 h-16 rounded-3xl ring-4 ${isLight ? "ring-gray-100" : "ring-slate-800"}`} alt="" />
                        <div className="text-center">
                          <p className={`font-semibold text-sm ${isLight ? "text-gray-800" : "text-white"}`}>
                            {activeConv.user.full_name}
                          </p>
                          <p className={`text-xs mt-1 ${isLight ? "text-gray-400" : "text-slate-500"}`}>
                            Say hello 👋
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <DateDivider label="Today" isLight={isLight} />
                        {messages.map((msg, i) => (
                          <div key={msg.id} className="msg-in">
                            <Bubble
                              msg={msg}
                              isLight={isLight}
                              prevMine={i > 0 ? messages[i - 1].sender_id === user?.id : null}
                              currentUserId={user?.id}
                              currentUser={user}
                              otherUser={activeConv.user}
                              onDelete={handleDeleteMessage}
                              onEdit={handleEditMessage}
                            />
                          </div>
                        ))}
                      </>
                    )}
                    <div ref={endRef} />
                  </div>

                  {/* Scroll button */}
                  {showScrollBtn && (
                    <button onClick={scrollToBottom}
                      className={`absolute bottom-28 right-5 w-9 h-9 flex items-center justify-center rounded-full shadow-lg border transition-all
                        ${isLight ? "bg-white border-gray-200 text-gray-600 hover:bg-gray-50" : "bg-slate-800 border-slate-600 text-gray-300 hover:bg-slate-700"}`}>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  )}

                  {/* Image preview */}
                  {imagePreview && (
                    <div className={`px-4 py-2.5 border-t flex items-center gap-3 flex-shrink-0
                      ${isLight ? "bg-blue-50 border-gray-100" : "bg-blue-950/40 border-slate-700/50"}`}>
                      <div className="relative">
                        <img src={imagePreview.url} alt="" className="h-12 w-12 object-cover rounded-xl" />
                        <button onClick={() => setImagePreview(null)}
                          className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-gray-900/80 rounded-full flex items-center justify-center">
                          <X className="w-2.5 h-2.5 text-white" />
                        </button>
                      </div>
                      <p className={`text-xs flex-1 ${isLight ? "text-blue-700" : "text-blue-400"}`}>
                        Image ready to send
                      </p>
                      <button onClick={handleSend}
                        className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white"
                        style={{ background: "linear-gradient(135deg,#2563eb,#5b21b6)" }}>
                        Send
                      </button>
                    </div>
                  )}

                  {/* Edit banner */}
                  {editingMsg && (
                    <div className={`px-4 py-2 border-t flex items-center gap-3 flex-shrink-0
                      ${isLight ? "bg-amber-50 border-amber-100" : "bg-amber-950/30 border-amber-900/40"}`}>
                      <Pencil className={`w-3.5 h-3.5 flex-shrink-0 ${isLight ? "text-amber-600" : "text-amber-400"}`} />
                      <p className={`text-xs flex-1 truncate ${isLight ? "text-amber-700" : "text-amber-400"}`}>
                        Editing: <span className="font-medium">{editingMsg.content}</span>
                      </p>
                      <button onClick={() => { setEditingMsg(null); setInput(""); }}>
                        <X className={`w-4 h-4 ${isLight ? "text-gray-400 hover:text-gray-600" : "text-slate-500 hover:text-gray-300"}`} />
                      </button>
                    </div>
                  )}

                  {/* Input */}
                  <div className={`px-2.5 sm:px-4 py-2.5 sm:py-3 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] sm:pb-3 border-t flex-shrink-0
                    ${isLight ? "bg-white border-gray-100" : "bg-slate-900 border-slate-700/50"}`}>
                    {isRecording ? (
                      <RecordBar elapsed={recElapsed} onStop={() => setIsRecording(false)} onCancel={() => setIsRecording(false)} isLight={isLight} />
                    ) : (
                      <div className="relative">
                        {showEmoji && (
                          <EmojiPicker
                            onSelect={em => { setInput(p => p + em); inputRef.current?.focus(); }}
                            onClose={() => setShowEmoji(false)}
                            isLight={isLight}
                          />
                        )}

                        <div className={`flex items-end gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-2 rounded-2xl border transition-all
                          ${isLight
                            ? "bg-gray-50 border-gray-200 focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-sm"
                            : "bg-slate-800 border-slate-700 focus-within:border-blue-500/60"
                          }`}
                        >
                          {/* Image */}
                          <button onClick={() => fileRef.current?.click()}
                            className={`flex-shrink-0 w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg sm:rounded-xl transition-colors
                              ${isLight ? "text-gray-400 hover:text-blue-500 hover:bg-blue-50" : "text-slate-500 hover:text-blue-400 hover:bg-slate-700"}`}>
                            <ImagePlus className="w-4 h-4" />
                          </button>
                          <input ref={fileRef} type="file" accept="image/*" className="hidden"
                            onChange={e => {
                              const f = e.target.files?.[0];
                              if (f) setImagePreview({ file: f, url: URL.createObjectURL(f) });
                            }}
                          />

                          {/* Emoji */}
                          <button onClick={() => setShowEmoji(p => !p)}
                            className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg sm:rounded-xl transition-colors
                              ${showEmoji
                                ? isLight ? "text-blue-600 bg-blue-50" : "text-blue-400 bg-blue-900/30"
                                : isLight ? "text-gray-400 hover:text-blue-500 hover:bg-blue-50" : "text-slate-500 hover:text-blue-400 hover:bg-slate-700"
                              }`}>
                            <Smile className="w-4 h-4" />
                          </button>

                          {/* Textarea */}
                          <textarea
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={editingMsg ? "Edit message…" : `Message ${activeConv.user.full_name}…`}
                            rows={1}
                            className={`flex-1 bg-transparent text-sm resize-none pt-1.5 pb-1.5 focus:outline-none max-h-28 min-h-[28px]
                              ${isLight ? "text-gray-800 placeholder:text-gray-400" : "text-gray-200 placeholder:text-slate-500"}`}
                            style={{ lineHeight: "1.55" }}
                            onInput={e => {
                              e.target.style.height = "auto";
                              e.target.style.height = Math.min(e.target.scrollHeight, 112) + "px";
                            }}
                          />

                          {/* Mic */}
                          <button onClick={() => { setIsRecording(true); setShowEmoji(false); }}
                            className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg sm:rounded-xl transition-colors
                              ${isLight ? "text-gray-400 hover:text-red-500 hover:bg-red-50" : "text-slate-500 hover:text-red-400 hover:bg-red-900/20"}`}>
                            <Mic className="w-4 h-4" />
                          </button>

                          {/* Send */}
                          <button onClick={handleSend} disabled={!input.trim() || sending}
                            className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg sm:rounded-xl transition-all
                              ${input.trim()
                                ? "text-white shadow-md hover:opacity-90 active:scale-95"
                                : isLight ? "text-gray-300 bg-gray-100" : "text-slate-600 bg-slate-800"
                              }`}
                            style={input.trim() ? { background: "linear-gradient(135deg,#2563eb,#5b21b6)" } : {}}>
                            {sending
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : <Send className="w-3.5 h-3.5" />
                            }
                          </button>
                        </div>

                        <p className={`text-center text-[10px] mt-1.5 select-none
                          ${isLight ? "text-gray-300" : "text-slate-600"}`}>
                          {editingMsg ? "Enter to save · Esc to cancel" : "Enter to send · Shift+Enter for new line"}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
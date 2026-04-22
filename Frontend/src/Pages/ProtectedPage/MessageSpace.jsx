import { useState, useEffect, useRef, useContext } from "react";
import {
  Search, Send, ArrowLeft, MoreVertical,
  ImagePlus, Smile, Check, CheckCheck, Edit2,
  MessageSquarePlus, X, Loader2, Mic,
  Play, Pause, StopCircle,
  ChevronDown, Phone, Video, Info,
  Trash2, Copy, Pencil,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavbarPrivate from "../../Components/Private/Navbarprivate";
import { UserContext } from "../../Context/userContext";
import { useTheme } from "../../Context/themeContext";
import { getUserFollowers, getUserFollowing } from "../../Services/user";
import { supabase } from "../../lib/supabase";

// ─── Emoji data ───────────────────────────────────────────────────────────────
const EMOJI_GROUPS = {
  "😊": ["😊","😂","🤣","❤️","😍","🥰","😘","😭","😩","🤔","😅","🙏","💯","🔥","✨","🎉","👏","💪","🙌","❤️‍🔥"],
  "👍": ["👍","👎","👋","🤝","✌️","🤞","🤙","💅","🫶","🫠","🥹","😮","😱","🤯","🥳","🤩","😎","🤓","🫡","🥴"],
  "🌍": ["🌍","🌸","🌺","🌻","🍕","🍔","☕","🎵","🎮","⚽","🏆","💎","🚀","🌙","⭐","🌈","🦋","🐶","🐱","🦁"],
};

// Quick reactions shown on hover
const QUICK_REACTIONS = ["❤️", "😂", "😮", "😢", "👍", "🔥"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function avatar(user) {
  return user?.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || user?.id || "user"}`;
}

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─── Status Icon ──────────────────────────────────────────────────────────────
function StatusIcon({ status }) {
  if (status === "read") return <CheckCheck className="w-3.5 h-3.5 text-blue-400" />;
  if (status === "delivered") return <CheckCheck className="w-3.5 h-3.5 text-white/40" />;
  return <Check className="w-3.5 h-3.5 text-white/40" />;
}

// ─── Voice Note Bubble ────────────────────────────────────────────────────────
function VoiceNoteBubble({ duration, isMine, isLight }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const HEIGHTS = [3,5,8,6,10,7,4,9,6,5,8,10,7,4,6,9,5,8,3,6,10,7,4,8,5,9,6,4];

  return (
    <div className="flex items-center gap-2.5 min-w-[180px]">
      <button
        onClick={() => setPlaying((p) => !p)}
        className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full transition-all
          ${isMine ? "bg-white/20 hover:bg-white/30" : isLight ? "bg-blue-100 hover:bg-blue-200 text-blue-600" : "bg-slate-600 hover:bg-slate-500 text-blue-400"}`}
      >
        {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>
      <div className="flex items-center gap-[2px] flex-1">
        {HEIGHTS.map((h, i) => {
          const filled = progress > (i / HEIGHTS.length) * 100;
          return (
            <div key={i} className="rounded-full flex-shrink-0 transition-colors"
              style={{
                width: 2, height: h * 2,
                background: isMine
                  ? filled ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)"
                  : filled ? (isLight ? "#2563eb" : "#60a5fa") : (isLight ? "#cbd5e1" : "#475569"),
              }}
            />
          );
        })}
      </div>
      <span className={`text-[10px] font-medium flex-shrink-0 ${isMine ? "text-white/70" : isLight ? "text-gray-500" : "text-slate-400"}`}>
        {formatDuration(duration || 0)}
      </span>
    </div>
  );
}

// ─── Message Action Menu ──────────────────────────────────────────────────────
function MessageActions({ isMine, isLight, onReact, onCopy, onEdit, onDelete, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={`absolute z-50 flex flex-col rounded-2xl border shadow-2xl overflow-hidden
        ${isMine ? "right-0" : "left-0"}
        bottom-full mb-2
        ${isLight ? "bg-white border-gray-200" : "bg-slate-800 border-slate-700"}`}
      style={{ minWidth: 160 }}
    >
      {/* Quick reactions row */}
      <div className={`flex items-center gap-1 px-3 py-2.5 border-b
        ${isLight ? "border-gray-100" : "border-slate-700/60"}`}
      >
        {QUICK_REACTIONS.map((em) => (
          <button
            key={em}
            onClick={() => { onReact(em); onClose(); }}
            className={`text-lg w-8 h-8 flex items-center justify-center rounded-xl transition-all hover:scale-125
              ${isLight ? "hover:bg-gray-100" : "hover:bg-slate-700"}`}
          >
            {em}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="py-1">
        <button
          onClick={() => { onCopy(); onClose(); }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
            ${isLight ? "hover:bg-gray-50 text-gray-700" : "hover:bg-slate-700/60 text-gray-300"}`}
        >
          <Copy className="w-3.5 h-3.5 opacity-60" />
          Copy text
        </button>

        {isMine && (
          <button
            onClick={() => { onEdit(); onClose(); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
              ${isLight ? "hover:bg-gray-50 text-gray-700" : "hover:bg-slate-700/60 text-gray-300"}`}
          >
            <Pencil className="w-3.5 h-3.5 opacity-60" />
            Edit
          </button>
        )}

        <div className={`mx-3 my-1 h-px ${isLight ? "bg-gray-100" : "bg-slate-700"}`} />

        <button
          onClick={() => { onDelete(); onClose(); }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
            ${isLight ? "hover:bg-red-50 text-red-500" : "hover:bg-red-900/20 text-red-400"}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, isLight, prevMine, currentUserId, otherUser, onDelete, onEdit }) {
  const isMine = msg.sender_id === currentUserId;
  const isVoice = msg.type === "voice";
  const isImage = msg.type === "image";
  const sameGroup = prevMine === isMine;
  const [showActions, setShowActions] = useState(false);
  const [reactions, setReactions] = useState(msg.reactions || []);
  const { user } = useContext(UserContext);

  // The avatar to show: mine = current user, theirs = otherUser
  const msgAvatar = isMine
    ? ( user?.avatar_url || null) 
    : avatar(otherUser);

  const handleReact = (em) => {
    setReactions((prev) => {
      const exists = prev.find((r) => r.emoji === em && r.mine);
      if (exists) return prev.filter((r) => !(r.emoji === em && r.mine));
      return [...prev, { emoji: em, mine: true }];
    });
    // TODO: persist reaction to Supabase
  };

  const handleCopy = () => {
    if (msg.content) navigator.clipboard.writeText(msg.content);
  };

  const handleDelete = () => {
    onDelete?.(msg.id);
  };

  const handleEdit = () => {
    onEdit?.(msg);
  };

  return (
    <div
      className={`flex items-end gap-2.5 group/msg
        ${isMine ? "justify-end" : "justify-start"}
        ${sameGroup ? "mt-0.5" : "mt-4"}`}
    >
      {/* Avatar — other user side */}
      {!isMine && (
        <div className={`flex-shrink-0 self-end ${sameGroup ? "opacity-0" : ""}`}>
          <img
            src={msgAvatar}
            alt={otherUser?.full_name || "User"}
            className="w-7 h-7 rounded-full object-cover"
            style={{ border: isLight ? "1.5px solid #e5e7eb" : "1.5px solid rgba(255,255,255,0.1)" }}
          />
        </div>
      )}

      {/* Bubble + actions wrapper */}
      <div className={`relative flex flex-col max-w-[70%] ${isMine ? "items-end" : "items-start"}`}>

        {/* Hover action trigger — appears on group hover */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 z-10
            opacity-0 group-hover/msg:opacity-100 transition-opacity duration-150
            ${isMine ? "-left-8" : "-right-8"}`}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setShowActions((p) => !p); }}
            className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors
              ${isLight ? "bg-gray-100 hover:bg-gray-200 text-gray-500" : "bg-slate-700 hover:bg-slate-600 text-slate-400"}`}
          >
            <MoreVertical className="w-3 h-3" />
          </button>
        </div>

        {/* Action menu */}
        {showActions && (
          <MessageActions
            isMine={isMine}
            isLight={isLight}
            onReact={handleReact}
            onCopy={handleCopy}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClose={() => setShowActions(false)}
          />
        )}

        {/* Bubble */}
        <div
          className={`relative px-4 py-2.5 text-sm leading-relaxed
            ${isMine
              ? "text-white rounded-2xl rounded-br-sm"
              : isLight
                ? "bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100 shadow-sm"
                : "bg-slate-700/80 text-gray-100 rounded-2xl rounded-bl-sm"
            }`}
          style={isMine ? { background: "linear-gradient(135deg, #2563eb 0%, #6d28d9 100%)" } : {}}
        >
          {/* Image */}
          {isImage && msg.image_url && (
            <div className="-mx-4 -mt-2.5 mb-1 overflow-hidden rounded-t-2xl">
              <img src={msg.image_url} alt="shared" className="w-full max-w-[260px] object-cover" style={{ maxHeight: 200 }} />
            </div>
          )}

          {/* Voice */}
          {isVoice ? (
            <VoiceNoteBubble duration={msg.voice_duration} isMine={isMine} isLight={isLight} />
          ) : (
            msg.content && (
              <p className="break-words whitespace-pre-wrap">
                {msg.content}
                {msg.edited && (
                  <span className={`ml-1.5 text-[10px] ${isMine ? "text-white/40" : isLight ? "text-gray-400" : "text-slate-500"}`}>
                    edited
                  </span>
                )}
              </p>
            )
          )}

          {/* Time + status */}
          <div className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
            <span className={`text-[10px] ${isMine ? "text-white/50" : isLight ? "text-gray-400" : "text-slate-500"}`}>
              {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            {isMine && <StatusIcon status={msg.status} />}
          </div>
        </div>

        {/* Reaction chips */}
        {reactions.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
            {reactions.map((r, i) => (
              <button
                key={i}
                onClick={() => handleReact(r.emoji)}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs transition-all
                  ${r.mine
                    ? isLight ? "bg-blue-100 border border-blue-300" : "bg-blue-900/40 border border-blue-700"
                    : isLight ? "bg-gray-100 border border-gray-200" : "bg-slate-700 border border-slate-600"
                  }`}
              >
                <span>{r.emoji}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Avatar — mine side */}
      {isMine && (
        <div className={`flex-shrink-0 self-end ${sameGroup ? "opacity-0" : ""}`}>
          <img
            src={msgAvatar}
            alt="You"
            className="w-7 h-7 rounded-full object-cover"
            style={{ border: isLight ? "1.5px solid #e5e7eb" : "1.5px solid rgba(255,255,255,0.1)" }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Date Divider ─────────────────────────────────────────────────────────────
function DateDivider({ label, isLight }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className={`flex-1 h-px ${isLight ? "bg-gray-100" : "bg-slate-700/60"}`} />
      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2
        ${isLight ? "text-gray-400" : "text-slate-500"}`}>
        {label}
      </span>
      <div className={`flex-1 h-px ${isLight ? "bg-gray-100" : "bg-slate-700/60"}`} />
    </div>
  );
}

// ─── Emoji Picker ─────────────────────────────────────────────────────────────
function EmojiPicker({ onSelect, onClose, isLight }) {
  const [activeGroup, setActiveGroup] = useState("😊");
  const ref = useRef(null);

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={`absolute bottom-full mb-2 left-0 z-50 rounded-2xl border shadow-2xl overflow-hidden
        ${isLight ? "bg-white border-gray-200" : "bg-slate-800 border-slate-700"}`}
      style={{ width: 300 }}
    >
      <div className={`flex border-b ${isLight ? "border-gray-100" : "border-slate-700"}`}>
        {Object.keys(EMOJI_GROUPS).map((g) => (
          <button key={g} onClick={() => setActiveGroup(g)}
            className={`flex-1 py-2.5 text-lg transition-colors
              ${activeGroup === g ? isLight ? "bg-blue-50" : "bg-blue-900/20" : isLight ? "hover:bg-gray-50" : "hover:bg-slate-700/40"}`}>
            {g}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-8 gap-0.5 p-2 max-h-44 overflow-y-auto">
        {EMOJI_GROUPS[activeGroup].map((em) => (
          <button key={em} onClick={() => onSelect(em)}
            className={`text-xl h-9 flex items-center justify-center rounded-lg transition-colors
              ${isLight ? "hover:bg-gray-100" : "hover:bg-slate-700"}`}>
            {em}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Recording Bar ────────────────────────────────────────────────────────────
function RecordingBar({ elapsed, onStop, onCancel, isLight }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border
      ${isLight ? "bg-red-50 border-red-200" : "bg-red-900/20 border-red-800/40"}`}>
      <span className="relative flex-shrink-0">
        <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75 animate-ping" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
      </span>
      <span className={`text-sm font-semibold flex-1 ${isLight ? "text-red-700" : "text-red-400"}`}>
        Recording {formatDuration(elapsed)}
      </span>
      <button onClick={onCancel}
        className={`text-xs px-3 py-1 rounded-lg transition-colors
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

// ─── Conversation Item ────────────────────────────────────────────────────────
function ConversationItem({ conv, active, onClick, theme }) {
  const isLight = theme === "light";
  const relationColors = {
    mutual:    isLight ? "bg-emerald-100 text-emerald-600" : "bg-emerald-900/30 text-emerald-400",
    follower:  isLight ? "bg-gray-100 text-gray-500" : "bg-slate-700 text-slate-400",
    following: isLight ? "bg-blue-100 text-blue-600" : "bg-blue-900/30 text-blue-400",
  };
  const relationLabel = { mutual: "Mutual", follower: "Follows you", following: "Following" };

  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all duration-150 text-left relative
        ${active
          ? isLight ? "bg-blue-50 border-r-[3px] border-blue-500" : "bg-blue-900/20 border-r-[3px] border-blue-500"
          : isLight ? "hover:bg-gray-50/80" : "hover:bg-slate-700/30"
        }`}
    >
      <div className="relative flex-shrink-0">
        <img src={avatar(conv.user)} alt={conv.user.full_name}
          className="w-12 h-12 rounded-2xl object-cover"
          style={{ border: isLight ? "2px solid #e5e7eb" : "2px solid rgba(255,255,255,0.08)" }}
        />
        {conv.user.online && (
          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 ${isLight ? "border-white" : "border-slate-800"}`} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={`font-semibold text-sm truncate flex-1 ${isLight ? "text-gray-900" : "text-white"}`}>
            {conv.user.full_name}
          </span>
          {conv.user.relation && (
            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0 ${relationColors[conv.user.relation]}`}>
              {relationLabel[conv.user.relation]}
            </span>
          )}
          <span className={`text-[10px] flex-shrink-0 ${conv.last_message?.unread > 0 ? "text-blue-500 font-semibold" : isLight ? "text-gray-400" : "text-slate-500"}`}>
            {conv.last_message?.time}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <p className={`text-xs truncate flex-1 ${conv.last_message?.unread > 0 ? isLight ? "text-gray-900 font-medium" : "text-white font-medium" : isLight ? "text-gray-500" : "text-slate-400"}`}>
            {conv.last_message?.mine && <span className={`mr-1 ${isLight ? "text-gray-400" : "text-slate-500"}`}>You:</span>}
            {conv.last_message?.text || "No messages yet"}
          </p>
          {conv.last_message?.unread > 0 && (
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
              {conv.last_message.unread > 9 ? "9+" : conv.last_message.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Empty Chat ───────────────────────────────────────────────────────────────
function EmptyChat({ theme }) {
  const isLight = theme === "light";
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
      <div className="w-24 h-24 rounded-3xl flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(109,40,217,0.12))" }}>
        <MessageSquarePlus className={`w-11 h-11 ${isLight ? "text-blue-500" : "text-blue-400"}`} />
      </div>
      <div>
        <h3 className={`font-bold text-lg mb-1.5 ${isLight ? "text-gray-900" : "text-white"}`}>Your Messages</h3>
        <p className={`text-sm max-w-[260px] leading-relaxed ${isLight ? "text-gray-500" : "text-slate-400"}`}>
          Pick a conversation to start chatting, or connect with writers you follow.
        </p>
      </div>
    </div>
  );
}

// ─── Main MessagesPage ────────────────────────────────────────────────────────
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
  const [showSidebar, setShowSidebar] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState(null);
  const [editingMsg, setEditingMsg] = useState(null); // { id, content }

  const [showEmoji, setShowEmoji] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingElapsed, setRecordingElapsed] = useState(0);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const recordingTimerRef = useRef(null);

  const activeConv = conversations.find((c) => c.id === activeId);
  const totalUnread = conversations.reduce((sum, c) => sum + (c.last_message?.unread || 0), 0);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingElapsed(0);
      recordingTimerRef.current = setInterval(() => setRecordingElapsed((p) => p + 1), 1000);
    } else {
      clearInterval(recordingTimerRef.current);
    }
    return () => clearInterval(recordingTimerRef.current);
  }, [isRecording]);

  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    setShowScrollDown(el.scrollHeight - el.scrollTop - el.clientHeight > 120);
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { scrollToBottom(); }, [messages]);

  const fetchFollowers = async () => {
    try { setFollowers(await getUserFollowers(user?.id) || []); } 
    catch (error) {
      console.error("Error fetching following:", error);
    }
  };
  const fetchFollowing = async () => {
    try { setFollowing(await getUserFollowing(user?.id) || []); } 
    catch (error) {
      console.error("Error fetching following:", error);
    }
  };

  const buildConversations = async () => {
    setLoading(true);
    const allUsers = new Map();
    following.forEach((u) => allUsers.set(u.id, { ...u, source: "following" }));
    followers.forEach((u) => {
      if (!allUsers.has(u.id)) allUsers.set(u.id, { ...u, source: "follower" });
      else { const ex = allUsers.get(u.id); ex.source = "mutual"; }
    });
    const uniqueUsers = Array.from(allUsers.values());
    if (!uniqueUsers.length) { setConversations([]); setLoading(false); return; }

    const convs = await Promise.all(uniqueUsers.map(async (tu) => {
      const roomId = [user?.id, tu.id].sort().join("_");
      const { data: lastMsg } = await supabase.from("messages").select("*").eq("room_id", roomId).order("created_at", { ascending: false }).limit(1);
      const { count: unread } = await supabase.from("messages").select("*", { count: "exact", head: true }).eq("room_id", roomId).eq("receiver_id", user?.id).eq("is_read", false);
      const lm = lastMsg?.[0];
      return {
        id: tu.id,
        user: { id: tu.id, full_name: tu.full_name, username: tu.username, avatar_url: tu.avatar_url, online: false, relation: tu.source },
        last_message: lm ? {
          text: lm.content,
          time: (() => { const d = new Date(lm.created_at), n = new Date(), h = (n - d) / 3.6e6; return h < 1 ? `${Math.floor((n - d) / 6e4)}m` : h < 24 ? `${Math.floor(h)}h` : d.toLocaleDateString(); })(),
          unread: unread || 0,
          mine: lm.sender_id === user?.id,
        } : null,
      };
    }));

    convs.sort((a, b) => (a.last_message ? -1 : 1));
    setConversations(convs);
    setLoading(false);
  };

  const loadMessages = async (otherId) => {
    const roomId = [user?.id, otherId].sort().join("_");
    const { data } = await supabase.from("messages").select("*").eq("room_id", roomId).order("created_at", { ascending: true });
    setMessages((data || []).map((m) => ({ ...m, status: m.is_read ? "read" : "delivered" })));
    await supabase.from("messages").update({ is_read: true }).eq("room_id", roomId).eq("receiver_id", user?.id).eq("is_read", false);
    setConversations((prev) => prev.map((c) => c.id === otherId ? { ...c, last_message: c.last_message ? { ...c.last_message, unread: 0 } : null } : c));
  };

  const subscribeToMessages = (otherId) => {
    if (channel) channel.unsubscribe();
    const roomId = [user?.id, otherId].sort().join("_");
    const ch = supabase.channel(`chat:${roomId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` }, (p) => {
        setMessages((prev) => [...prev, { ...p.new, status: "delivered" }]);
        setConversations((prev) => prev.map((c) => c.id === otherId ? { ...c, last_message: { text: p.new.content, time: "now", unread: p.new.receiver_id === user?.id ? (c.last_message?.unread || 0) + 1 : 0, mine: p.new.sender_id === user?.id } } : c));
        setTimeout(scrollToBottom, 100);
      })
      .subscribe();
    setChannel(ch);
  };

  const handleSend = async () => {
    if (!input.trim() || !activeId) return;

    // Edit mode
    if (editingMsg) {
      const { error } = await supabase.from("messages").update({ content: input.trim(), edited: true }).eq("id", editingMsg.id);
      if (!error) {
        setMessages((prev) => prev.map((m) => m.id === editingMsg.id ? { ...m, content: input.trim(), edited: true } : m));
      }
      setEditingMsg(null);
      setInput("");
      return;
    }

    setSending(true);
    const roomId = [user?.id, activeId].sort().join("_");
    const { data, error } = await supabase.from("messages").insert({ content: input.trim(), sender_id: user?.id, receiver_id: activeId, room_id: roomId, is_read: false }).select().single();
    if (!error && data) {
      setMessages((prev) => [...prev, { ...data, status: "delivered" }]);
      setConversations((prev) => prev.map((c) => c.id === activeId ? { ...c, last_message: { text: input.trim(), time: "now", unread: 0, mine: true } } : c));
      setInput("");
      setTimeout(scrollToBottom, 100);
    }
    setSending(false);
  };

  const handleDeleteMessage = async (msgId) => {
    await supabase.from("messages").delete().eq("id", msgId);
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
  };

  const handleEditMessage = (msg) => {
    setEditingMsg(msg);
    setInput(msg.content);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    if (e.key === "Escape" && editingMsg) { setEditingMsg(null); setInput(""); }
  };

  const handleEmojiSelect = (em) => { setInput((p) => p + em); inputRef.current?.focus(); };
  const handleImagePicked = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview({ file, url: URL.createObjectURL(file) });
  };
  const handleMicClick = () => { setIsRecording(true); setShowEmoji(false); };
  const handleStopRecording = () => { setIsRecording(false); };
  const handleCancelRecording = () => { setIsRecording(false); };

  const handleSelectConv = async (id) => {
    setActiveId(id); setInput(""); setShowEmoji(false);
    setImagePreview(null); setIsRecording(false); setEditingMsg(null);
    await loadMessages(id);
    subscribeToMessages(id);
    if (window.innerWidth < 768) setShowSidebar(false);
  };

  useEffect(() => { if (user?.id) { fetchFollowers(); fetchFollowing(); } }, [user?.id]);
  useEffect(() => { if (user?.id) buildConversations(); }, [followers, following]);
  useEffect(() => { return () => { if (channel) channel.unsubscribe(); }; }, [channel]);

  const filtered = conversations.filter((c) =>
    c.user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.user.username?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && !conversations.length) {
    return (
      <>
        <NavbarPrivate />
        <div className={`min-h-screen pt-20 flex items-center justify-center ${isLight ? "bg-gray-50" : "bg-slate-900"}`}>
          <Loader2 className={`w-8 h-8 animate-spin ${isLight ? "text-blue-600" : "text-blue-400"}`} />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .msg-enter { animation: fadeUp 0.18s ease forwards; }
        @keyframes ping { 75%,100% { transform:scale(2); opacity:0; } }
        .animate-ping { animation: ping 1s cubic-bezier(0,0,0.2,1) infinite; }
      `}</style>

      <NavbarPrivate />

      <div className={`min-h-screen pt-20 md:pt-24 flex flex-col items-center justify-center px-3 md:px-6 lg:px-8 pb-4
        ${isLight ? "bg-gray-50" : "bg-slate-900"}`}
      >
        <div className={`w-full max-w-7xl rounded-2xl overflow-hidden shadow-2xl flex
          ${isLight ? "bg-white border border-gray-200" : "bg-slate-800 border border-slate-700"}`}
          style={{ height: "calc(100vh - 8rem)" }}
        >
          {/* ── Sidebar ── */}
          <div className={`flex flex-col flex-shrink-0 border-r overflow-hidden
            ${isLight ? "border-gray-100 bg-white" : "border-slate-700/60 bg-slate-800"}
            ${showSidebar ? "w-full md:w-80 lg:w-96" : "hidden md:flex md:w-80 lg:w-96"}`}
          >
            <div className={`px-5 pt-5 pb-3.5 border-b ${isLight ? "border-gray-100" : "border-slate-700/60"}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className={`font-bold text-xl ${isLight ? "text-gray-900" : "text-white"}`}>Messages</h1>
                  {totalUnread > 0 && <p className={`text-xs mt-0.5 ${isLight ? "text-blue-600" : "text-blue-400"}`}>{totalUnread} unread</p>}
                </div>
                <button className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors
                  ${isLight ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"}`}>
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl ${isLight ? "bg-gray-100" : "bg-slate-700/60"}`}>
                <Search className={`w-3.5 h-3.5 flex-shrink-0 ${isLight ? "text-gray-400" : "text-slate-500"}`} />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations…"
                  className={`flex-1 bg-transparent text-xs focus:outline-none ${isLight ? "text-gray-800 placeholder:text-gray-400" : "text-gray-200 placeholder:text-slate-500"}`}
                />
                {search && <button onClick={() => setSearch("")}><X className={`w-3 h-3 ${isLight ? "text-gray-400" : "text-slate-500"}`} /></button>}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className={`text-center py-16 px-6 text-sm ${isLight ? "text-gray-400" : "text-slate-500"}`}>
                  <MessageSquarePlus className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No conversations yet</p>
                  <p className="text-xs mt-1">Follow writers to start messaging</p>
                </div>
              ) : filtered.map((conv) => (
                <ConversationItem key={conv.id} conv={conv} active={conv.id === activeId} onClick={() => handleSelectConv(conv.id)} theme={theme} />
              ))}
            </div>
          </div>

          {/* ── Chat pane ── */}
          <div className={`flex-1 flex flex-col overflow-hidden min-w-0 ${!showSidebar || activeId ? "flex" : "hidden md:flex"}`}>
            {!activeConv ? (
              <EmptyChat theme={theme} />
            ) : (
              <>
                {/* Header */}
                <div className={`flex items-center justify-between px-4 py-3 border-b flex-shrink-0
                  ${isLight ? "bg-white border-gray-100" : "bg-slate-800 border-slate-700/60"}`}
                >
                  <div className="flex items-center gap-3">
                    <button onClick={() => setShowSidebar(true)}
                      className={`md:hidden p-1.5 rounded-xl transition-colors ${isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-slate-700 text-gray-400"}`}>
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="relative">
                      <img src={avatar(activeConv.user)} alt={activeConv.user.full_name}
                        className="w-10 h-10 rounded-2xl object-cover"
                        style={{ border: isLight ? "2px solid #e5e7eb" : "2px solid rgba(255,255,255,0.08)" }}
                      />
                      {activeConv.user.online && (
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 ${isLight ? "border-white" : "border-slate-800"}`} />
                      )}
                    </div>
                    <div>
                      <p className={`font-bold text-sm cursor-pointer hover:underline ${isLight ? "text-gray-900" : "text-white"}`}
                        onClick={() => navigate(`/profile/${activeConv.user.id}`)}>
                        {activeConv.user.full_name}
                      </p>
                      <p className={`text-xs ${isLight ? "text-gray-500" : "text-slate-400"}`}>
                        {activeConv.user.online ? <span className="text-emerald-500 font-medium">Active now</span> : `@${activeConv.user.username}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[Phone, Video, Info].map((Icon, i) => (
                      <button key={i} className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors
                        ${isLight ? "hover:bg-gray-100 text-gray-500" : "hover:bg-slate-700 text-slate-400"}`}>
                        <Icon className="w-4 h-4" />
                      </button>
                    ))}
                    <button className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors
                      ${isLight ? "hover:bg-gray-100 text-gray-500" : "hover:bg-slate-700 text-slate-400"}`}>
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div ref={messagesContainerRef} onScroll={handleScroll}
                  className={`flex-1 overflow-y-auto px-5 py-4 ${isLight ? "bg-gray-50/40" : "bg-slate-900/30"}`}
                >
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                      <img src={avatar(activeConv.user)} className="w-16 h-16 rounded-3xl" alt="" />
                      <p className={`font-semibold text-sm ${isLight ? "text-gray-800" : "text-white"}`}>{activeConv.user.full_name}</p>
                      <p className={`text-xs max-w-[200px] ${isLight ? "text-gray-400" : "text-slate-500"}`}>No messages yet. Say hello 👋</p>
                    </div>
                  ) : (
                    <>
                      <DateDivider label="Today" isLight={isLight} />
                      {messages.map((msg, i) => (
                        <div key={msg.id} className="msg-enter">
                          <MessageBubble
                            msg={msg}
                            isLight={isLight}
                            prevMine={i > 0 ? messages[i - 1].sender_id === user?.id : null}
                            currentUserId={user?.id}
                            otherUser={activeConv.user}
                            onDelete={handleDeleteMessage}
                            onEdit={handleEditMessage}
                          />
                        </div>
                      ))}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Scroll down button */}
                {showScrollDown && (
                  <button onClick={scrollToBottom}
                    className={`absolute bottom-24 right-6 w-9 h-9 flex items-center justify-center rounded-full shadow-lg transition-all
                      ${isLight ? "bg-white border border-gray-200 text-gray-600" : "bg-slate-700 border border-slate-600 text-gray-300"}`}>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}

                {/* Image preview */}
                {imagePreview && (
                  <div className={`px-4 py-2 border-t flex items-center gap-3 flex-shrink-0
                    ${isLight ? "bg-blue-50 border-gray-100" : "bg-blue-900/20 border-slate-700/60"}`}>
                    <div className="relative">
                      <img src={imagePreview.url} alt="" className="h-14 w-14 object-cover rounded-xl" />
                      <button onClick={() => setImagePreview(null)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center">
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                    <p className={`text-xs ${isLight ? "text-blue-700" : "text-blue-400"}`}>Image ready to send</p>
                    <button onClick={handleSend} className="ml-auto px-4 py-1.5 rounded-lg text-xs font-semibold text-white"
                      style={{ background: "linear-gradient(135deg, #2563eb, #6d28d9)" }}>Send</button>
                  </div>
                )}

                {/* Edit mode banner */}
                {editingMsg && (
                  <div className={`px-4 py-2 border-t flex items-center gap-3 flex-shrink-0
                    ${isLight ? "bg-amber-50 border-amber-100" : "bg-amber-900/20 border-amber-800/40"}`}>
                    <Pencil className={`w-3.5 h-3.5 flex-shrink-0 ${isLight ? "text-amber-600" : "text-amber-400"}`} />
                    <p className={`text-xs flex-1 truncate ${isLight ? "text-amber-700" : "text-amber-400"}`}>
                      Editing: <span className="font-medium">{editingMsg.content}</span>
                    </p>
                    <button onClick={() => { setEditingMsg(null); setInput(""); }}
                      className={`text-xs ${isLight ? "text-gray-500 hover:text-gray-700" : "text-slate-400 hover:text-gray-300"}`}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Input bar */}
                <div className={`px-4 py-3 border-t flex-shrink-0 ${isLight ? "bg-white border-gray-100" : "bg-slate-800 border-slate-700/60"}`}>
                  {isRecording ? (
                    <RecordingBar elapsed={recordingElapsed} onStop={handleStopRecording} onCancel={handleCancelRecording} isLight={isLight} />
                  ) : (
                    <div className="relative">
                      {showEmoji && <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmoji(false)} isLight={isLight} />}

                      <div className={`flex items-end gap-2 px-3 py-2.5 rounded-2xl border transition-all
                        ${isLight ? "bg-gray-50 border-gray-200 focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-sm" : "bg-slate-700/50 border-slate-600 focus-within:border-blue-500"}`}>
                        <button onClick={() => fileInputRef.current?.click()}
                          className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl transition-colors mb-0.5
                            ${isLight ? "text-gray-400 hover:text-blue-500 hover:bg-blue-50" : "text-slate-500 hover:text-blue-400 hover:bg-slate-700"}`}>
                          <ImagePlus className="w-4 h-4" />
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImagePicked} />

                        <button onClick={() => setShowEmoji((p) => !p)}
                          className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl transition-colors mb-0.5
                            ${showEmoji ? isLight ? "text-blue-600 bg-blue-50" : "text-blue-400 bg-blue-900/30" : isLight ? "text-gray-400 hover:text-blue-500 hover:bg-blue-50" : "text-slate-500 hover:text-blue-400 hover:bg-slate-700"}`}>
                          <Smile className="w-4 h-4" />
                        </button>

                        <textarea
                          ref={inputRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={editingMsg ? "Edit your message…" : `Message ${activeConv.user.full_name}…`}
                          rows={1}
                          className={`flex-1 bg-transparent text-sm resize-none pt-2 pb-2 focus:outline-none max-h-28
                            ${isLight ? "text-gray-800 placeholder:text-gray-400" : "text-gray-200 placeholder:text-slate-500"}`}
                          style={{ lineHeight: "1.6" }}
                          onInput={(e) => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 112) + "px"; }}
                        />

                        <button onClick={handleMicClick}
                          className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl transition-colors mb-0.5
                            ${isLight ? "text-gray-400 hover:text-red-500 hover:bg-red-50" : "text-slate-500 hover:text-red-400 hover:bg-red-900/20"}`}>
                          <Mic className="w-4 h-4" />
                        </button>

                        <button onClick={handleSend} disabled={!input.trim() || sending}
                          className={`flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl transition-all mb-0.5
                            ${input.trim() ? "text-white shadow-md hover:opacity-90 active:scale-95" : isLight ? "text-gray-300 bg-gray-100" : "text-slate-600 bg-slate-700/50"}`}
                          style={input.trim() ? { background: "linear-gradient(135deg, #2563eb, #6d28d9)" } : {}}>
                          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className={`text-center text-[10px] mt-1.5 ${isLight ? "text-gray-300" : "text-slate-600"}`}>
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
    </>
  );
}
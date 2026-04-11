import { useState, useEffect, useRef, useContext } from "react";
import {
  Search, Send, ArrowLeft, MoreVertical,
  Circle, ImagePlus, Smile, Phone, Video,
  ChevronDown, Check, CheckCheck, Edit2,
  MessageSquarePlus, X, Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarPrivate from "../../Components/Private/Navbarprivate";
import { UserContext } from "../../Context/userContext";
import { useTheme } from "../../Context/themeContext";

// ─── Mock data (replace with Supabase real-time queries) ─────────────────────
const MOCK_CONVERSATIONS = [
  {
    id: "1",
    user: { id: "u2", full_name: "Alex Turner", username: "alexturner", avatar_url: null, online: true },
    last_message: { text: "That React article you wrote was 🔥 really helped me understand RSC", time: "2m ago", unread: 2, mine: false },
  },
  {
    id: "2",
    user: { id: "u3", full_name: "Maria Garcia", username: "mariagarcia", avatar_url: null, online: true },
    last_message: { text: "Hey, would love to collab on something AI-related", time: "1h ago", unread: 0, mine: false },
  },
  {
    id: "3",
    user: { id: "u4", full_name: "James Wilson", username: "jameswilson", avatar_url: null, online: false },
    last_message: { text: "Thanks for the follow! Great content 🙌", time: "3h ago", unread: 0, mine: true },
  },
  {
    id: "4",
    user: { id: "u5", full_name: "Sophie Chen", username: "sophiechen", avatar_url: null, online: false },
    last_message: { text: "Sent you a draft for review", time: "Yesterday", unread: 1, mine: false },
  },
  {
    id: "5",
    user: { id: "u6", full_name: "David Park", username: "davidpark", avatar_url: null, online: true },
    last_message: { text: "Did you see the new Supabase realtime update?", time: "Yesterday", unread: 0, mine: false },
  },
];

const MOCK_MESSAGES = {
  "1": [
    { id: "m1", text: "Hey! Just read your latest article on RSC", time: "10:20 AM", mine: false, status: "read" },
    { id: "m2", text: "Thank you! Took a while to put together honestly", time: "10:22 AM", mine: true, status: "read" },
    { id: "m3", text: "It really shows. The depth was incredible", time: "10:23 AM", mine: false, status: "read" },
    { id: "m4", text: "I've been trying to migrate our codebase to RSC but running into some issues with server actions", time: "10:25 AM", mine: false, status: "read" },
    { id: "m5", text: "What kind of issues? Happy to help debug", time: "10:26 AM", mine: true, status: "read" },
    { id: "m6", text: "Mostly around the data fetching patterns. When I try to pass server data to a client component it breaks", time: "10:28 AM", mine: false, status: "read" },
    { id: "m7", text: "Ah yeah that's a common one — you need to serialize the data properly before passing it as props", time: "10:30 AM", mine: true, status: "read" },
    { id: "m8", text: "That React article you wrote was 🔥 really helped me understand RSC", time: "10:31 AM", mine: false, status: "delivered" },
  ],
  "2": [
    { id: "m1", text: "Hey! Big fan of your AI research posts", time: "9:00 AM", mine: false, status: "read" },
    { id: "m2", text: "Thank you so much that means a lot!", time: "9:05 AM", mine: true, status: "read" },
    { id: "m3", text: "Hey, would love to collab on something AI-related", time: "9:10 AM", mine: false, status: "read" },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function avatar(user) {
  return user?.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || user?.id || "user"}`;
}

function initials(name) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

// ─── Message Status Icon ──────────────────────────────────────────────────────
function StatusIcon({ status, isLight }) {
  if (status === "read") return <CheckCheck className={`w-3.5 h-3.5 text-blue-400`} />;
  if (status === "delivered") return <CheckCheck className={`w-3.5 h-3.5 ${isLight ? "text-gray-400" : "text-slate-500"}`} />;
  return <Check className={`w-3.5 h-3.5 ${isLight ? "text-gray-400" : "text-slate-500"}`} />;
}

// ─── Conversation List Item ───────────────────────────────────────────────────
function ConversationItem({ conv, active, onClick, theme }) {
  const isLight = theme === "light";
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all duration-200 text-left
        ${active
          ? isLight ? "bg-blue-50/80 border-r-2 border-blue-500" : "bg-blue-900/20 border-r-2 border-blue-500"
          : isLight ? "hover:bg-gray-50" : "hover:bg-slate-700/30"
        }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={avatar(conv.user)}
          alt={conv.user.full_name}
          className="w-11 h-11 rounded-2xl object-cover"
          style={{ border: isLight ? "2px solid #e5e7eb" : "2px solid rgba(255,255,255,0.08)" }}
        />
        {conv.user.online && (
          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2
            ${isLight ? "border-white" : "border-slate-800"}`}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`font-semibold text-sm truncate
            ${isLight ? "text-gray-900" : "text-white"}`}>
            {conv.user.full_name}
          </span>
          <span className={`text-[10px] flex-shrink-0 ml-2
            ${conv.last_message.unread > 0
              ? isLight ? "text-blue-600 font-semibold" : "text-blue-400 font-semibold"
              : isLight ? "text-gray-400" : "text-slate-500"
            }`}>
            {conv.last_message.time}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className={`text-xs truncate flex-1
            ${conv.last_message.unread > 0
              ? isLight ? "text-gray-800 font-medium" : "text-gray-200 font-medium"
              : isLight ? "text-gray-500" : "text-slate-400"
            }`}>
            {conv.last_message.mine && (
              <span className={`mr-1 ${isLight ? "text-gray-400" : "text-slate-500"}`}>You:</span>
            )}
            {conv.last_message.text}
          </p>
          {conv.last_message.unread > 0 && (
            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold">
              {conv.last_message.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, isLight, prevMine }) {
  const isMine = msg.mine;
  const showTail = prevMine !== isMine; // show rounded tail on first in a group

  return (
    <div
      className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}
        ${prevMine === isMine ? "mt-0.5" : "mt-3"}`}
      style={{ animationDelay: "0ms" }}
    >
      <div
        className={`max-w-[72%] px-4 py-2.5 text-sm leading-relaxed
          ${isMine
            ? "text-white rounded-2xl rounded-br-md"
            : isLight
              ? "bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100"
              : "bg-slate-700 text-gray-100 rounded-2xl rounded-bl-md"
          }`}
        style={isMine ? { background: "linear-gradient(135deg, #2563eb, #7c3aed)" } : {}}
      >
        {msg.text}
        <div className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
          <span className={`text-[10px] ${isMine ? "text-white/60" : isLight ? "text-gray-400" : "text-slate-500"}`}>
            {msg.time}
          </span>
          {isMine && <StatusIcon status={msg.status} isLight={isLight} />}
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyChat({ theme }) {
  const isLight = theme === "light";
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #2563eb20, #7c3aed20)" }}
      >
        <MessageSquarePlus className={`w-9 h-9 ${isLight ? "text-blue-500" : "text-blue-400"}`} />
      </div>
      <div>
        <h3 className={`font-bold text-base mb-1 ${isLight ? "text-gray-900" : "text-white"}`}>
          Your Messages
        </h3>
        <p className={`text-sm max-w-[240px] leading-relaxed ${isLight ? "text-gray-500" : "text-slate-400"}`}>
          Select a conversation to start reading, or send a new message to a writer you follow.
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
  const isLight = theme === "light";

  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [sending, setSending] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true); // mobile toggle

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeConv = conversations.find((c) => c.id === activeId);

  // Filter conversations by search
  const filtered = conversations.filter((c) =>
    c.user.full_name.toLowerCase().includes(search.toLowerCase()) ||
    c.user.username.toLowerCase().includes(search.toLowerCase())
  );

  // Load messages when conversation changes
  useEffect(() => {
    if (activeId) {
      setMessages(MOCK_MESSAGES[activeId] || []);
      // Mark as read
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? { ...c, last_message: { ...c.last_message, unread: 0 } }
            : c
        )
      );
    }
  }, [activeId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectConv = (id) => {
    setActiveId(id);
    setInput("");
    // On mobile, hide sidebar when conversation is selected
    if (window.innerWidth < 768) setShowSidebar(false);
  };

  const handleSend = async () => {
    if (!input.trim() || !activeId) return;
    setSending(true);

    const newMsg = {
      id: `m${Date.now()}`,
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      mine: true,
      status: "sent",
    };

    setMessages((prev) => [...prev, newMsg]);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, last_message: { text: newMsg.text, time: "now", unread: 0, mine: true } }
          : c
      )
    );
    setInput("");

    // Simulate delivery
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMsg.id ? { ...m, status: "delivered" } : m))
      );
      setSending(false);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const totalUnread = conversations.reduce((sum, c) => sum + (c.last_message.unread || 0), 0);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .msg-enter { animation: fadeUp 0.2s ease forwards; }
      `}</style>

      <NavbarPrivate />

      <div className={`h-screen pt-16 md:pt-20 flex flex-col
        ${isLight ? "bg-gray-50" : "bg-slate-900"}`}
      >
        {/* Full width container - removed max-w-6xl */}
        <div className={`flex-1 w-full flex overflow-hidden
          ${isLight ? "bg-white" : "bg-slate-800"}
        `}>
          {/* No max-height constraint on desktop */}
          <div className="flex w-full h-full">

            {/* ── Sidebar ── */}
            <div
              className={`
                flex flex-col flex-shrink-0 border-r overflow-hidden
                ${isLight ? "border-gray-200 bg-white" : "border-slate-700 bg-slate-800"}
                ${showSidebar ? "w-full md:w-80 lg:w-96" : "hidden md:flex md:w-80 lg:w-96"}
              `}
            >
              {/* Sidebar header */}
              <div className={`px-4 pt-5 pb-3 border-b
                ${isLight ? "border-gray-100" : "border-slate-700/60"}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                      Messages
                    </h1>
                    {totalUnread > 0 && (
                      <p className={`text-xs ${isLight ? "text-gray-500" : "text-slate-400"}`}>
                        {totalUnread} unread
                      </p>
                    )}
                  </div>
                  <button
                    className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors
                      ${isLight ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"}`}
                    title="New message"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Search */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl
                  ${isLight ? "bg-gray-100" : "bg-slate-700/60"}`}
                >
                  <Search className={`w-3.5 h-3.5 flex-shrink-0 ${isLight ? "text-gray-400" : "text-slate-500"}`} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search messages…"
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
              <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className={`text-center py-12 text-sm ${isLight ? "text-gray-400" : "text-slate-500"}`}>
                    No conversations found
                  </div>
                ) : (
                  filtered.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conv={conv}
                      active={conv.id === activeId}
                      onClick={() => handleSelectConv(conv.id)}
                      theme={theme}
                    />
                  ))
                )}
              </div>
            </div>

            {/* ── Chat area ── */}
            <div
              className={`flex-1 flex flex-col overflow-hidden
                ${!showSidebar || activeId ? "flex" : "hidden md:flex"}
              `}
            >
              {!activeConv ? (
                <EmptyChat theme={theme} />
              ) : (
                <>
                  {/* Chat header */}
                  <div className={`flex items-center justify-between px-4 py-3.5 border-b flex-shrink-0
                    ${isLight ? "bg-white border-gray-100" : "bg-slate-800 border-slate-700/60"}`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Back button — mobile */}
                      <button
                        onClick={() => setShowSidebar(true)}
                        className={`md:hidden p-1.5 rounded-xl transition-colors
                          ${isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-slate-700 text-gray-400"}`}
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>

                      <div className="relative">
                        <img
                          src={avatar(activeConv.user)}
                          alt={activeConv.user.full_name}
                          className="w-10 h-10 rounded-2xl object-cover"
                          style={{ border: isLight ? "2px solid #e5e7eb" : "2px solid rgba(255,255,255,0.08)" }}
                        />
                        {activeConv.user.online && (
                          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2
                            ${isLight ? "border-white" : "border-slate-800"}`}
                          />
                        )}
                      </div>

                      <div>
                        <p
                          className={`font-bold text-sm cursor-pointer hover:underline ${isLight ? "text-gray-900" : "text-white"}`}
                          onClick={() => navigate(`/profile/${activeConv.user.id}`)}
                        >
                          {activeConv.user.full_name}
                        </p>
                        <p className={`text-xs ${isLight ? "text-gray-500" : "text-slate-400"}`}>
                          {activeConv.user.online
                            ? <span className="text-emerald-500 font-medium">Active now</span>
                            : `@${activeConv.user.username}`
                          }
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors
                        ${isLight ? "hover:bg-gray-100 text-gray-500" : "hover:bg-slate-700 text-slate-400"}`}>
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors
                        ${isLight ? "hover:bg-gray-100 text-gray-500" : "hover:bg-slate-700 text-slate-400"}`}>
                        <Video className="w-4 h-4" />
                      </button>
                      <button className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors
                        ${isLight ? "hover:bg-gray-100 text-gray-500" : "hover:bg-slate-700 text-slate-400"}`}>
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div
                    className={`flex-1 overflow-y-auto px-4 py-4 space-y-0.5
                      ${isLight ? "bg-gray-50/50" : "bg-slate-900/40"}`}
                  >
                    {/* Date divider */}
                    <div className="flex items-center gap-3 my-4">
                      <div className={`flex-1 h-px ${isLight ? "bg-gray-200" : "bg-slate-700"}`} />
                      <span className={`text-[10px] font-medium px-2 ${isLight ? "text-gray-400" : "text-slate-500"}`}>
                        Today
                      </span>
                      <div className={`flex-1 h-px ${isLight ? "bg-gray-200" : "bg-slate-700"}`} />
                    </div>

                    {messages.map((msg, i) => (
                      <div key={msg.id} className="msg-enter">
                        <MessageBubble
                          msg={msg}
                          isLight={isLight}
                          prevMine={i > 0 ? messages[i - 1].mine : null}
                        />
                      </div>
                    ))}

                    {/* Typing indicator - uncomment and use state to enable */}
                    {null && (
                      <div className="flex items-end gap-2 mt-3">
                        <div className={`px-4 py-3 rounded-2xl rounded-bl-md
                          ${isLight ? "bg-white border border-gray-100 shadow-sm" : "bg-slate-700"}`}
                        >
                          <div className="flex items-center gap-1">
                            {[0, 1, 2].map((i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${isLight ? "bg-gray-400" : "bg-slate-400"}`}
                                style={{ animation: `bounce 1s ${i * 0.2}s infinite` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input bar */}
                  <div className={`px-4 py-3 border-t flex-shrink-0
                    ${isLight ? "bg-white border-gray-100" : "bg-slate-800 border-slate-700/60"}`}
                  >
                    <div className={`flex items-end gap-3 px-4 py-2.5 rounded-2xl border transition-all
                      ${isLight
                        ? "bg-gray-50 border-gray-200 focus-within:border-blue-400 focus-within:bg-white"
                        : "bg-slate-700/60 border-slate-600 focus-within:border-blue-500"
                      }`}
                    >
                      <button className={`flex-shrink-0 mb-0.5 transition-colors
                        ${isLight ? "text-gray-400 hover:text-blue-500" : "text-slate-500 hover:text-blue-400"}`}>
                        <ImagePlus className="w-5 h-5" />
                      </button>

                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Message ${activeConv.user.full_name}…`}
                        rows={1}
                        className={`flex-1 bg-transparent text-sm resize-none focus:outline-none max-h-32
                          ${isLight ? "text-gray-800 placeholder:text-gray-400" : "text-gray-200 placeholder:text-slate-500"}`}
                        style={{ lineHeight: "1.5" }}
                        onInput={(e) => {
                          e.target.style.height = "auto";
                          e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
                        }}
                      />

                      <button className={`flex-shrink-0 mb-0.5 transition-colors
                        ${isLight ? "text-gray-400 hover:text-blue-500" : "text-slate-500 hover:text-blue-400"}`}>
                        <Smile className="w-5 h-5" />
                      </button>

                      <button
                        onClick={handleSend}
                        disabled={!input.trim() || sending}
                        className={`flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl transition-all
                          ${input.trim()
                            ? "text-white shadow-md hover:opacity-90 active:scale-95"
                            : isLight ? "text-gray-300 bg-gray-100" : "text-slate-600 bg-slate-700"
                          }`}
                        style={input.trim()
                          ? { background: "linear-gradient(135deg, #2563eb, #7c3aed)" }
                          : {}
                        }
                      >
                        {sending
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Send className="w-4 h-4" />
                        }
                      </button>
                    </div>

                    <p className={`text-center text-[10px] mt-1.5 ${isLight ? "text-gray-300" : "text-slate-600"}`}>
                      Press Enter to send · Shift+Enter for new line
                    </p>
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
import { useEffect, useRef, useState } from "react";
import {
  X, ZoomIn, ZoomOut, Download, Heart,
  MessageCircle, Bookmark, Clock, ArrowUpRight, Hash,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * PostImageModal — centered full-screen post image viewer
 *
 * Props:
 *   isOpen     {boolean}
 *   onClose    {function}
 *   image      {string}    featured image URL
 *   post       {object}    { id, title, content, createdat, read_time,
 *                            likescount, comments_count, tags,
 *                            author: { full_name, username, avatar_url } }
 *   theme      {string}    "light" | "dark"
 *   isLiked    {boolean}
 *   isSaved    {boolean}
 */
export default function PostImageModal({
  isOpen,
  onClose,
  image,
  post,
  theme = "dark",
  isLiked = false,
  isSaved = false,
}) {
  const navigate = useNavigate();
  const [zoomed, setZoomed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef(null);
  const isLight = theme === "light";

  useEffect(() => {
    if (isOpen) {
      setLoaded(false);
      setZoomed(false);
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      const t = setTimeout(() => { document.body.style.overflow = ""; }, 350);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const fn = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") setZoomed(true);
      if (e.key === "-") setZoomed(false);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(image);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = post?.title || "image";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(image, "_blank");
    }
  };

  const handleOpenPost = () => {
    onClose();
    navigate(`/post/${post?.id}`);
  };

  const formatDate = (d) => {
    if (!d) return "";
    const diff = (Date.now() - new Date(d)) / 1000;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const excerpt = (text, max = 130) => {
    if (!text) return "";
    return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
  };

  if (!isOpen && !visible) return null;

  const author = post?.author || {};
  const avatar = author.avatar_url ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.username || "user"}`;

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.93) translateY(18px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .modal-shimmer {
          background: linear-gradient(90deg, #0d1117 25%, #1e293b 50%, #0d1117 75%);
          background-size: 200% 100%;
          animation: shimmer 1.6s ease-in-out infinite;
        }
      `}</style>

      {/* ── Backdrop ── */}
      <div
        ref={overlayRef}
        onClick={handleBackdropClick}
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{
          background: "rgba(0,0,0,0.82)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          animation: visible ? "overlayIn 0.25s ease forwards" : "none",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
      >
        {/* ── Modal container ── */}
        <div
          className="relative mx-auto flex flex-col"
          style={{
            width: "min(92vw, 520px)",
            maxHeight: "90vh",
            borderRadius: "1.75rem",
            boxShadow: "0 50px 120px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.08)",
            background: isLight ? "#ffffff" : "#0d1117",
            animation: visible ? "modalIn 0.35s cubic-bezier(0.34,1.3,0.64,1) forwards" : "none",
            overflow: "hidden",
          }}
        >
          {/* ── Close button (top right, floating) ── */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 z-30 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
            title="Close (Esc)"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* ── Image area ── */}
          <div
            className="relative w-full flex items-center justify-center overflow-hidden flex-shrink-0"
            style={{
              background: "#050810",
              minHeight: 240,
              maxHeight: "55vh",
              cursor: zoomed ? "zoom-out" : "zoom-in",
            }}
            onClick={() => setZoomed((z) => !z)}
          >
            {/* Shimmer while loading */}
            {!loaded && (
              <div className="modal-shimmer absolute inset-0 z-10" />
            )}

            <img
              src={image}
              alt={post?.title || "Post image"}
              onLoad={() => setLoaded(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
                opacity: loaded ? 1 : 0,
                transition: "opacity 0.3s ease, object-fit 0s",
                maxHeight: "55vh",
              }}
            />

            {/* Image overlay gradient — fades into the info panel */}
            <div
              className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
              style={{
                background: isLight
                  ? "linear-gradient(to bottom, transparent, rgba(255,255,255,0.6))"
                  : "linear-gradient(to bottom, transparent, rgba(13,17,23,0.8))",
              }}
            />

            {/* Image controls (bottom-left) */}
            <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5">
              <button
                onClick={(e) => { e.stopPropagation(); setZoomed((z) => !z); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-white text-xs font-medium transition-all hover:scale-105"
                style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
              >
                {zoomed ? <ZoomOut className="w-3 h-3" /> : <ZoomIn className="w-3 h-3" />}
                <span>{zoomed ? "Fit" : "Zoom"}</span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-white text-xs font-medium transition-all hover:scale-105"
                style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
                title="Download image"
              >
                <Download className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* ── Info panel ── */}
          <div
            className="flex flex-col overflow-y-auto"
            style={{ maxHeight: "40vh" }}
          >
            <div className="px-5 pt-4 pb-5 space-y-4">

              {/* Author row */}
              <div className="flex items-center gap-3">
                <img
                  src={avatar}
                  alt={author.full_name || "Author"}
                  className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                  style={{
                    border: isLight ? "2px solid #e5e7eb" : "2px solid rgba(255,255,255,0.1)",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm leading-tight truncate ${isLight ? "text-gray-900" : "text-white"}`}>
                    {author.full_name || "Anonymous"}
                  </p>
                  <p className={`text-xs truncate ${isLight ? "text-gray-400" : "text-slate-500"}`}>
                    @{author.username || "anonymous"}
                    {post?.createdat ? ` · ${formatDate(post.createdat)}` : ""}
                  </p>
                </div>
                {/* Read time pill */}
                {post?.read_time && (
                  <span
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium flex-shrink-0
                      ${isLight ? "bg-gray-100 text-gray-500" : "bg-slate-800 text-slate-400"}`}
                  >
                    <Clock className="w-3 h-3" />
                    {post.read_time} min
                  </span>
                )}
              </div>

              {/* Thin divider */}
              <div className={`h-px ${isLight ? "bg-gray-100" : "bg-white/[0.06]"}`} />

              {/* Title + excerpt */}
              <div>
                {post?.title && (
                  <h2 className={`font-bold text-[15px] leading-snug mb-1.5 ${isLight ? "text-gray-900" : "text-white"}`}>
                    {post.title}
                  </h2>
                )}
                {post?.content && (
                  <p className={`text-xs leading-relaxed ${isLight ? "text-gray-500" : "text-slate-400"}`}>
                    {excerpt(post.content)}
                  </p>
                )}
              </div>

              {/* Stats + tags row */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                {/* Stats */}
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1 text-xs font-medium
                    ${isLiked
                      ? "text-red-500"
                      : isLight ? "text-gray-400" : "text-slate-500"}`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
                    {post?.likescount || 0}
                  </span>
                  <span className={`flex items-center gap-1 text-xs font-medium ${isLight ? "text-gray-400" : "text-slate-500"}`}>
                    <MessageCircle className="w-3.5 h-3.5" />
                    {post?.comments_count || 0}
                  </span>
                  {isSaved && (
                    <span className={`flex items-center gap-1 text-xs font-medium ${isLight ? "text-amber-500" : "text-amber-400"}`}>
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                      Saved
                    </span>
                  )}
                </div>

                {/* Tags */}
                {post?.tags?.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-semibold
                          ${isLight ? "bg-blue-50 text-blue-600" : "bg-blue-900/30 text-blue-400"}`}
                      >
                        <Hash className="w-2.5 h-2.5 opacity-70" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA button */}
              <button
                onClick={handleOpenPost}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                  boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
                }}
              >
                Read full story
                <ArrowUpRight className="w-4 h-4" />
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
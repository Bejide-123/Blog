import { useEffect, useRef, useState } from "react";
import { X, ZoomIn, ZoomOut, Download } from "lucide-react";

/**
 * ImageModal — reusable full-screen image viewer
 *
 * Props:
 *   src        {string}   — image URL (required)
 *   alt        {string}   — alt text (optional)
 *   name       {string}   — display name shown below image (optional)
 *   username   {string}   — @username shown below image (optional)
 *   isOpen     {boolean}  — controls visibility (required)
 *   onClose    {function} — called when modal should close (required)
 */
export default function ImageModal({ src, alt = "Image", name, username, isOpen, onClose }) {
  const [zoomed, setZoomed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);        // drives CSS enter/exit
  const overlayRef = useRef(null);

  // Sync open → visible with a tiny delay so CSS transition plays
  useEffect(() => {
    if (isOpen) {
      setLoaded(false);
      setZoomed(false);
      // push to next frame so the element is mounted before we animate
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      const t = setTimeout(() => {
        document.body.style.overflow = "";
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Keyboard: Escape to close, + / - to zoom
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

  // Click backdrop to close
  const handleBackdropClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = alt || "image";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(src, "_blank");
    }
  };

  if (!isOpen && !visible) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: visible ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(12px)" : "blur(0px)",
        transition: "background 0.3s ease, backdrop-filter 0.3s ease",
      }}
    >
      {/* Panel */}
      <div
        className="relative flex flex-col items-center max-w-[92vw] max-h-[92vh]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.92) translateY(16px)",
          transition: "opacity 0.3s cubic-bezier(0.34,1.56,0.64,1), transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* ── Top controls ── */}
        <div className="flex items-center justify-between w-full mb-3 px-1">
          {/* Name / username */}
          <div className="flex flex-col">
            {name && (
              <span className="text-white font-semibold text-sm leading-tight">
                {name}
              </span>
            )}
            {username && (
              <span className="text-white/50 text-xs">@{username}</span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 ml-4">
            {/* Zoom toggle */}
            <button
              onClick={() => setZoomed((z) => !z)}
              title={zoomed ? "Zoom out (−)" : "Zoom in (+)"}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {zoomed
                ? <ZoomOut className="w-4 h-4" />
                : <ZoomIn className="w-4 h-4" />
              }
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              title="Download"
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              title="Close (Esc)"
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/10 hover:bg-red-500/70 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Image ── */}
        <div
          className="relative overflow-hidden"
          style={{
            borderRadius: "1.25rem",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          {/* Shimmer while loading */}
          {!loaded && (
            <div
              className="absolute inset-0 z-10 rounded-[1.25rem]"
              style={{
                background: "linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.4s infinite",
                minWidth: 240,
                minHeight: 240,
              }}
            />
          )}

          <img
            src={src}
            alt={alt}
            onLoad={() => setLoaded(true)}
            onClick={() => setZoomed((z) => !z)}
            style={{
              maxWidth: zoomed ? "min(90vw, 1000px)" : "min(70vw, 640px)",
              maxHeight: zoomed ? "85vh" : "70vh",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              display: "block",
              cursor: zoomed ? "zoom-out" : "zoom-in",
              transition: "max-width 0.35s cubic-bezier(0.34,1.2,0.64,1), max-height 0.35s cubic-bezier(0.34,1.2,0.64,1)",
              opacity: loaded ? 1 : 0,
              borderRadius: "1.25rem",
            }}
          />
        </div>

        {/* ── Zoom hint ── */}
        <p
          className="mt-3 text-white/30 text-xs"
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.3s ease 0.2s",
          }}
        >
          {zoomed ? "Click image or press − to zoom out" : "Click image or press + to zoom in"}
        </p>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}


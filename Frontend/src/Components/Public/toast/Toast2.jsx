import {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
} from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

// ─── Config per type ──────────────────────────────────────────────────────────
const CONFIGS = {
  success: {
    label: "Success",
    Icon: CheckCircle2,
    bg: "linear-gradient(135deg, #059669, #047857)",
    bar: "rgba(255,255,255,0.45)",
  },
  error: {
    label: "Error",
    Icon: XCircle,
    bg: "linear-gradient(135deg, #dc2626, #b91c1c)",
    bar: "rgba(255,255,255,0.45)",
  },
  warning: {
    label: "Warning",
    Icon: AlertTriangle,
    bg: "linear-gradient(135deg, #d97706, #b45309)",
    bar: "rgba(255,255,255,0.45)",
  },
  info: {
    label: "Info",
    Icon: Info,
    bg: "linear-gradient(135deg, #2563eb, #4f46e5)",
    bar: "rgba(255,255,255,0.45)",
  },
};

// ─── Single Toast Item ────────────────────────────────────────────────────────
function ToastItem({ id, message, type = "success", duration = 4000, onDismiss }) {
  const [phase, setPhase] = useState("entering"); // entering | visible | leaving
  const [barWidth, setBarWidth] = useState(100);

  const timerRef    = useRef(null);
  const rafRef      = useRef(null);
  const remainingRef = useRef(duration);
  const startRef    = useRef(null);
  const pausedRef   = useRef(false);

  const cfg = CONFIGS[type] || CONFIGS.success;
  const { Icon } = cfg;

  const dismiss = useCallback(() => {
    if (phase === "leaving") return;
    setPhase("leaving");
    cancelAnimationFrame(rafRef.current);
    clearTimeout(timerRef.current);
    setTimeout(() => onDismiss(id), 300);
  }, [id, onDismiss, phase]);

  // Animate progress bar
  const tick = useCallback((ts) => {
    if (!startRef.current) startRef.current = ts;
    const elapsed = ts - startRef.current;
    const pct = Math.max(0, 100 - (elapsed / remainingRef.current) * 100);
    setBarWidth(pct);
    if (elapsed < remainingRef.current) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      dismiss();
    }
  }, [dismiss]);

  const startTimer = useCallback(() => {
    startRef.current = null;
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const pauseTimer = () => {
    if (pausedRef.current) return;
    pausedRef.current = true;
    cancelAnimationFrame(rafRef.current);
    if (startRef.current) {
      remainingRef.current -= performance.now() - startRef.current;
      startRef.current = null;
    }
  };

  const resumeTimer = () => {
    if (!pausedRef.current) return;
    pausedRef.current = false;
    startTimer();
  };

  useEffect(() => {
    requestAnimationFrame(() => setPhase("visible"));
    startTimer();
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timerRef.current);
    };
  }, [startTimer]);

  const phaseStyle = {
    entering: { opacity: 0, transform: "translateY(12px) scale(0.94)" },
    visible:  { opacity: 1, transform: "translateY(0) scale(1)" },
    leaving:  { opacity: 0, transform: "translateY(6px) scale(0.96)" },
  }[phase];

  const transition = phase === "visible"
    ? "opacity 0.32s cubic-bezier(0.34,1.3,0.64,1), transform 0.32s cubic-bezier(0.34,1.3,0.64,1)"
    : "opacity 0.22s ease, transform 0.22s ease";

  return (
    <div
      role="alert"
      aria-live="assertive"
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      onClick={dismiss}
      style={{
        ...phaseStyle,
        transition,
        background: cfg.bg,
        borderRadius: 14,
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        cursor: "pointer",
        userSelect: "none",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 24px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Icon pill */}
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 9,
        background: "rgba(255,255,255,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        <Icon size={16} color="white" strokeWidth={2.2} />
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0, padding: "13px 0" }}>
        <p style={{
          margin: 0,
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.72)",
          lineHeight: 1,
          marginBottom: 3,
        }}>
          {cfg.label}
        </p>
        <p style={{
          margin: 0,
          fontSize: 13.5,
          fontWeight: 500,
          color: "white",
          lineHeight: 1.4,
        }}>
          {message}
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); dismiss(); }}
        style={{
          flexShrink: 0,
          width: 26,
          height: 26,
          borderRadius: 7,
          background: "rgba(255,255,255,0.15)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.3)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
      >
        <X size={13} color="white" />
      </button>

      {/* Progress bar */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        height: 3,
        width: `${barWidth}%`,
        background: cfg.bar,
        borderRadius: "0 0 0 14px",
        transition: "none",
      }} />
    </div>
  );
}

// ─── Toast Container ──────────────────────────────────────────────────────────
export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "max(24px, env(safe-area-inset-bottom, 0px) + 16px)",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        pointerEvents: "none",
        width: "800px", // For debugging
        maxWidth: "800px", // For debugging
      }}
    >
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: "auto" }}>
          <ToastItem {...t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}

// ─── useToast hook ────────────────────────────────────────────────────────────
/**
 * Usage inside a single component:
 *
 *   const { toast, ToastContainer } = useToast();
 *
 *   toast("Saved!")                           // success
 *   toast("Something broke", "error")
 *   toast("Heads up", "warning")
 *   toast("FYI", "info")
 *   toast("Custom duration", "info", 6000)    // ms
 *
 *   return (
 *     <>
 *       ...
 *       <ToastContainer />
 *     </>
 *   );
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message, type = "success", duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const Container = useCallback(
    () => <ToastContainer toasts={toasts} onDismiss={dismiss} />,
    [toasts, dismiss]
  );

  return { toast, ToastContainer: Container };
}

// ─── Context provider (app-wide) ──────────────────────────────────────────────
/**
 * Wrap your app once:
 *
 *   import { ToastProvider } from "../../Components/Toast";
 *   <ToastProvider><App /></ToastProvider>
 *
 * Then anywhere inside:
 *
 *   import { useToastContext } from "../../Components/Toast";
 *   const { toast } = useToastContext();
 *   toast("Draft deleted", "success");
 */
const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const { toast, ToastContainer } = useToast();
  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <ToastContainer />
    </ToastCtx.Provider>
  );
}

export function useToastContext() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToastContext must be used inside <ToastProvider>");
  return ctx;
}

export default ToastItem;
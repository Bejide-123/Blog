import { useState, useEffect, useCallback, createContext, useContext } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

// ─── Single Toast item ────────────────────────────────────────────────────────
function ToastItem({ id, message, type = "success", duration = 3500, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true));

    // Auto-dismiss
    const t = setTimeout(() => dismiss(), duration);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => onDismiss(id), 300);
  };

  const configs = {
    success: {
      icon: <CheckCircle2 className="w-4 h-4 flex-shrink-0" />,
      bg: "from-emerald-500 to-green-500",
      shadow: "shadow-emerald-500/25",
    },
    error: {
      icon: <XCircle className="w-4 h-4 flex-shrink-0" />,
      bg: "from-red-500 to-rose-500",
      shadow: "shadow-red-500/25",
    },
    warning: {
      icon: <AlertTriangle className="w-4 h-4 flex-shrink-0" />,
      bg: "from-amber-500 to-orange-500",
      shadow: "shadow-amber-500/25",
    },
    info: {
      icon: <Info className="w-4 h-4 flex-shrink-0" />,
      bg: "from-blue-500 to-indigo-500",
      shadow: "shadow-blue-500/25",
    },
  };

  const { icon, bg, shadow } = configs[type] || configs.success;

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-2xl text-white text-sm font-medium
        shadow-xl ${shadow} bg-gradient-to-r ${bg}
        min-w-[240px] max-w-[360px] cursor-pointer select-none
        transition-all duration-300
        ${visible && !leaving
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-3 scale-95"
        }
      `}
      onClick={dismiss}
      role="alert"
    >
      {icon}
      <span className="flex-1 leading-snug">{message}</span>
      <button
        onClick={(e) => { e.stopPropagation(); dismiss(); }}
        className="ml-1 p-0.5 rounded-lg hover:bg-white/20 transition-colors flex-shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Toast Container ──────────────────────────────────────────────────────────
// Renders all active toasts, stacked above each other
function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2.5 pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem
            {...t}
            onDismiss={onDismiss}
          />
        </div>
      ))}
    </div>
  );
}

// ─── useToast hook ────────────────────────────────────────────────────────────
/**
 * The simplest way to use toasts — call this hook in any component.
 * Returns { toast, ToastContainer }
 *
 * Usage:
 *   const { toast, ToastContainer } = useToast();
 *
 *   toast("Saved!")                          // success by default
 *   toast("Something went wrong", "error")
 *   toast("Watch out", "warning")
 *   toast("FYI: ...", "info")
 *   toast("Long message", "success", 6000)   // custom duration in ms
 *
 *   // In JSX, render anywhere inside the component:
 *   <ToastContainer />
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message, type = "success", duration = 3500) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const Container = useCallback(
    () => <ToastContainer toasts={toasts} onDismiss={dismiss} />,
    [toasts, dismiss]
  );

  return { toast, ToastContainer: Container };
}

// ─── Context-based provider (optional, for app-wide toasts) ──────────────────
/**
 * Optional: wrap your app (or a subtree) with <ToastProvider> and then
 * call useToastContext() anywhere inside — no need to pass props down.
 *
 * In App.jsx / main layout:
 *   <ToastProvider>
 *     <App />
 *   </ToastProvider>
 *
 * In any child component:
 *   const { toast } = useToastContext();
 *   toast("Done!", "success");
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

// ─── Default export: the raw ToastItem if you want full control ───────────────
export default useToast;

// import { ToastProvider } from "../../Components/Toast";

// <ToastProvider>
//   <App />
// </ToastProvider>

// import { useToastContext } from "../../Components/Toast";

// const { toast } = useToastContext();
// toast("Draft deleted", "success");
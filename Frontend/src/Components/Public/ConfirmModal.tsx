/* eslint-disable react/style-prop-object */
import { useState, useEffect, useCallback, useRef } from "react";
import { AlertTriangle, Trash2, Shield, X, Loader2, Info, HelpCircle } from "lucide-react";

// ─── Variant config ───────────────────────────────────────────────────────────
const VARIANTS = {
  danger: {
    icon: Trash2,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    darkIconBg: "bg-red-900/30",
    darkIconColor: "text-red-400",
    btnBg: "linear-gradient(135deg, #dc2626, #b91c1c)",
    btnShadow: "0 4px 16px rgba(220,38,38,0.35)",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    darkIconBg: "bg-amber-900/30",
    darkIconColor: "text-amber-400",
    btnBg: "linear-gradient(135deg, #d97706, #b45309)",
    btnShadow: "0 4px 16px rgba(217,119,6,0.35)",
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    darkIconBg: "bg-blue-900/30",
    darkIconColor: "text-blue-400",
    btnBg: "linear-gradient(135deg, #2563eb, #4f46e5)",
    btnShadow: "0 4px 16px rgba(37,99,235,0.35)",
  },
  success: {
    icon: HelpCircle,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    darkIconBg: "bg-emerald-900/30",
    darkIconColor: "text-emerald-400",
    btnBg: "linear-gradient(135deg, #059669, #047857)",
    btnShadow: "0 4px 16px rgba(5,150,105,0.35)",
  },
  neutral: {
    icon: Shield,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    darkIconBg: "bg-gray-700/30",
    darkIconColor: "text-gray-400",
    btnBg: "linear-gradient(135deg, #6b7280, #4b5563)",
    btnShadow: "0 4px 16px rgba(107,114,128,0.35)",
  },
};

// ─── ConfirmModal component ───────────────────────────────────────────────────
export function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  theme = "light",
  loading = false,
  size = "md",
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
}) {
  const [visible, setVisible] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const cancelBtnRef = useRef(null);
  const isLight = theme === "light";
  const cfg = VARIANTS[variant] || VARIANTS.danger;
  const Icon = cfg.icon;
  const isLoading = loading || internalLoading;

  // Size classes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  // Animate in/out
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      const timer = setTimeout(() => { document.body.style.overflow = ""; }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Focus cancel button on open (accessibility)
  useEffect(() => {
    if (visible) {
      setTimeout(() => cancelBtnRef.current?.focus(), 50);
    }
  }, [visible]);

  // Escape key to cancel
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const fn = (e) => { 
      if (e.key === "Escape" && !isLoading) onCancel?.(); 
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isOpen, isLoading, onCancel, closeOnEscape]);

  const handleConfirm = async () => {
    if (isLoading) return;
    setInternalLoading(true);
    try {
      await onConfirm?.();
    } finally {
      setInternalLoading(false);
    }
  };

  const handleBackdrop = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget && !isLoading) {
      onCancel?.();
    }
  };

  if (!isOpen && !visible) return null;

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      style={{
        background: visible ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(4px)" : "blur(0px)",
        transition: "background 0.25s ease, backdrop-filter 0.25s ease",
      }}
    >
      {/* Panel */}
      <div
        className={`relative w-full ${sizeClasses[size]} rounded-2xl border shadow-2xl overflow-hidden
          ${isLight ? "bg-white border-gray-200" : "bg-slate-800 border-slate-700"}`}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.93) translateY(16px)",
          transition: "opacity 0.3s cubic-bezier(0.34,1.3,0.64,1), transform 0.3s cubic-bezier(0.34,1.3,0.64,1)",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        {/* Top accent line */}
        <div
          className="h-1 w-full"
          style={{ background: cfg.btnBg }}
        />

        <div className="p-6">
          {/* Close button */}
          {showCloseButton && (
            <button
              onClick={() => !isLoading && onCancel?.()}
              disabled={isLoading}
              className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl transition-colors
                ${isLight ? "hover:bg-gray-100 text-gray-400" : "hover:bg-slate-700 text-slate-500"}
                disabled:opacity-40 disabled:cursor-not-allowed`}
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Icon + Title */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0
              ${isLight ? cfg.iconBg : cfg.darkIconBg}`}
            >
              <Icon className={`w-5 h-5 ${isLight ? cfg.iconColor : cfg.darkIconColor}`} />
            </div>
            <div className="pt-0.5 flex-1 min-w-0">
              <h2
                id="confirm-title"
                className={`font-bold text-lg leading-snug ${isLight ? "text-gray-900" : "text-white"}`}
              >
                {title}
              </h2>
            </div>
          </div>

          {/* Message */}
          <div
            id="confirm-message"
            className={`text-sm leading-relaxed mb-6 pl-16
              ${isLight ? "text-gray-600" : "text-slate-400"}`}
          >
            {typeof message === 'string' ? <p>{message}</p> : message}
          </div>

          {/* Divider */}
          <div className={`h-px mb-5 ${isLight ? "bg-gray-100" : "bg-slate-700/60"}`} />

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              ref={cancelBtnRef}
              onClick={() => !isLoading && onCancel?.()}
              disabled={isLoading}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all
                disabled:opacity-40 disabled:cursor-not-allowed
                ${isLight
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                }`}
            >
              {cancelText}
            </button>

            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2 active:scale-[0.98]"
              style={{
                background: cfg.btnBg,
                boxShadow: cfg.btnShadow,
              }}
            >
              {isLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Working…</>
                : confirmText
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── useConfirm hook ──────────────────────────────────────────────────────────
export function useConfirm() {
  const [state, setState] = useState({
    open: false,
    title: "Are you sure?",
    message: "This action cannot be undone.",
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "danger",
    size: "md",
    showCloseButton: true,
    closeOnBackdrop: true,
    closeOnEscape: true,
  });
  const resolveRef = useRef(null);

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({
        open: true,
        title: options.title ?? "Are you sure?",
        message: options.message ?? "This action cannot be undone.",
        confirmText: options.confirmText ?? "Confirm",
        cancelText: options.cancelText ?? "Cancel",
        variant: options.variant ?? "danger",
        size: options.size ?? "md",
        showCloseButton: options.showCloseButton ?? true,
        closeOnBackdrop: options.closeOnBackdrop ?? true,
        closeOnEscape: options.closeOnEscape ?? true,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    resolveRef.current?.(true);
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const handleCancel = useCallback(() => {
    resolveRef.current?.(false);
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const Modal = useCallback(
    ({ theme }) => (
      <ConfirmModal
        isOpen={state.open}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title={state.title}
        message={state.message}
        confirmText={state.confirmText}
        cancelText={state.cancelText}
        variant={state.variant}
        size={state.size}
        showCloseButton={state.showCloseButton}
        closeOnBackdrop={state.closeOnBackdrop}
        closeOnEscape={state.closeOnEscape}
        theme={theme}
      />
    ),
    [state, handleConfirm, handleCancel]
  );

  return { confirm, ConfirmModal: Modal };
}

// ─── Quick preset hooks for common use cases ──────────────────────────────────
export function useDeleteConfirm() {
  const { confirm, ConfirmModal } = useConfirm();
  
  const deleteConfirm = useCallback((itemName = "this item") => {
    return confirm({
      title: `Delete ${itemName}?`,
      message: `This will permanently delete ${itemName}. This action cannot be undone.`,
      confirmText: "Delete",
      variant: "danger",
    });
  }, [confirm]);
  
  return { deleteConfirm, ConfirmModal };
}

export function useLogoutConfirm() {
  const { confirm, ConfirmModal } = useConfirm();
  
  const logoutConfirm = useCallback(() => {
    return confirm({
      title: "Log out?",
      message: "You will need to sign in again to access your account.",
      confirmText: "Log Out",
      variant: "warning",
    });
  }, [confirm]);
  
  return { logoutConfirm, ConfirmModal };
}

export default ConfirmModal;
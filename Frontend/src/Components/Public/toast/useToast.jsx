
import { useState, useCallback, useContext, createContext } from "react";
import { ToastContainer } from "./Toast2.jsx";

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
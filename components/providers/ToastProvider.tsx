"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const DURATION_MS = 4500;

const config: Record<ToastType, { icon: React.ReactNode; bar: string; border: string }> = {
  success: {
    icon: <CheckCircle2 size={17} className="text-emerald-500 shrink-0" />,
    bar: "bg-emerald-400",
    border: "border-l-emerald-400",
  },
  error: {
    icon: <XCircle size={17} className="text-red-500 shrink-0" />,
    bar: "bg-red-400",
    border: "border-l-red-400",
  },
  info: {
    icon: <Info size={17} className="text-blue-500 shrink-0" />,
    bar: "bg-blue-400",
    border: "border-l-blue-400",
  },
};

function ToastItem({ t, onDismiss }: { t: ToastItem; onDismiss: (id: string) => void }) {
  const [progress, setProgress] = useState(100);
  const c = config[t.type];

  useEffect(() => {
    const start = Date.now();
    let frameId: number;

    const tick = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / DURATION_MS) * 100);
      setProgress(remaining);
      if (remaining > 0) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, x: 24 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-auto relative overflow-hidden flex items-center gap-3 rounded-xl pl-4 pr-3 py-3.5 shadow-lg border border-gray-100 border-l-4 ${c.border} bg-white text-sm font-medium text-gray-900`}
    >
      {c.icon}
      <span className="flex-1 leading-snug">{t.message}</span>
      <button
        onClick={() => onDismiss(t.id)}
        className="ml-1 shrink-0 text-gray-300 hover:text-gray-500 transition-colors"
      >
        <X size={14} />
      </button>

      {/* Progress bar */}
      <span
        className={`absolute bottom-0 left-0 h-[2px] ${c.bar} transition-none`}
        style={{ width: `${progress}%` }}
      />
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, DURATION_MS + 200);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2.5 pointer-events-none w-full max-w-sm">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastItem key={t.id} t={t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

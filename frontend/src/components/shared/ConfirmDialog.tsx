import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: "text-red-400",
      bg: "bg-red-500/20",
      border: "border-red-500/30",
      button: "bg-red-500 hover:bg-red-600",
    },
    warning: {
      icon: "text-yellow-400",
      bg: "bg-yellow-500/20",
      border: "border-yellow-500/30",
      button: "bg-yellow-500 hover:bg-yellow-600",
    },
    info: {
      icon: "text-blue-400",
      bg: "bg-blue-500/20",
      border: "border-blue-500/30",
      button: "bg-blue-500 hover:bg-blue-600",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-dark/90 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-dark-100 border border-primary-500/30 rounded-2xl shadow-neon-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div
              className={`p-3 ${styles.bg} border ${styles.border} rounded-xl`}
            >
              <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-display text-slate-100 mb-2">
                {title}
              </h3>
              <p className="text-slate-400 font-body text-sm">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-dark-200 border border-primary-500/30 text-slate-300 rounded-xl font-medium hover:bg-dark-300 transition-colors cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-4 py-3 ${styles.button} text-white rounded-xl font-medium transition-colors cursor-pointer`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { AlertCircle, XCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  type?: "error" | "warning";
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  type = "error",
  onDismiss,
}) => {
  const Icon = type === "error" ? XCircle : AlertCircle;
  const bgColor = type === "error" ? "bg-red-500/10" : "bg-yellow-500/10";
  const borderColor =
    type === "error" ? "border-red-500/30" : "border-yellow-500/30";
  const textColor = type === "error" ? "text-red-400" : "text-yellow-400";

  return (
    <div
      className={`${bgColor} ${borderColor} border rounded-xl p-4 flex items-start gap-3`}
    >
      <Icon className={`w-5 h-5 ${textColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className={`${textColor} font-body text-sm`}>{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`${textColor} hover:opacity-70 transition-opacity cursor-pointer`}
          aria-label="Dismiss"
        >
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

import React from 'react';

type Props = {
  title?: string,
  message: string,
  onDismiss?: () => void,
  className?: string,
  type?: "error" | "success"
}

const Alert: React.FC<Props> = ({
  title,
  message,
  onDismiss,
  className,
  type = "error"
}) => {
  return (
    <div className={`p-4 rounded-lg ${type === "error" ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"} ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className={`font-semibold ${type === "error" ? "text-red-800" : "text-green-800"}`}>{title ?? "Er is een fout opgetreden"}</h3>
          <p className={`mt-1 text-sm ${type === "error" ? "text-red-700" : "text-green-700"}`}>{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`font-semibold ${type === "error" ? "text-red-500 hover:text-red-700" : "text-green-500 hover:green-red-700"}`}
          >
            <span className="sr-only">Sluiten</span>
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
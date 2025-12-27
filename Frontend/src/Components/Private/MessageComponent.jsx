import { useTheme } from "../../Context/themeContext";
import { AlertCircle, CheckCircle, XCircle, Info } from "lucide-react";

const messageStyles = {
  success: {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-800 dark:text-green-300",
    border: "border-green-400 dark:border-green-600",
  },
  error: {
    icon: <XCircle className="w-5 h-5 text-red-500" />,
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-800 dark:text-red-300",
    border: "border-red-400 dark:border-red-600",
  },
  warning: {
    icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    text: "text-yellow-800 dark:text-yellow-300",
    border: "border-yellow-400 dark:border-yellow-600",
  },
  info: {
    icon: <Info className="w-5 h-5 text-blue-500" />,
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-800 dark:text-blue-300",
    border: "border-blue-400 dark:border-blue-600",
  },
};

export default function Message({ type = "info", message = "" }) {
  const { theme } = useTheme();
  const styles = messageStyles[type];

  if (!message) return null;

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border-l-4 ${
        theme === "light" ? styles.bg.split(" ")[0] : styles.bg.split(" ")[1]
      } ${
        theme === "light"
          ? styles.border.split(" ")[0]
          : styles.border.split(" ")[1]
      }`}
      role="alert"
    >
      {styles.icon}
      <p
        className={`text-sm font-medium ${
          theme === "light" ? styles.text.split(" ")[0] : styles.text.split(" ")[1]
        }`}
      >
        {message}
      </p>
    </div>
  );
}

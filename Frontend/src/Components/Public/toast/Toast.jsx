import React from 'react';
import { Toaster } from 'react-hot-toast';

const Toast = () => {
  const [theme, setTheme] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  React.useEffect(() => {
    const handleStorageChange = () => {
      const newTheme = localStorage.getItem('theme') || 'light';
      setTheme(newTheme);
    };

    window.addEventListener('storage', handleStorageChange);
    
    const handleThemeChange = (e) => {
      setTheme(e.detail || 'light');
    };
    window.addEventListener('themeChange', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  const isDark = theme === 'dark';

  // Inject custom styles for progress bar
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Progress bar container */
      .toast-with-progress {
        position: relative;
        overflow: hidden;
      }

      /* Progress bar */
      .toast-with-progress::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: rgba(255, 255, 255, 0.4);
        animation: toast-progress 4s linear forwards;
      }

      .toast-with-progress.toast-success::after {
        animation: toast-progress 3.5s linear forwards;
      }

      .toast-with-progress.toast-error::after {
        animation: toast-progress 4.5s linear forwards;
      }

      @keyframes toast-progress {
        from {
          width: 100%;
        }
        to {
          width: 0%;
        }
      }

      /* Mobile responsive adjustments */
      @media (max-width: 640px) {
        .Toaster {
          left: 8px !important;
          right: 8px !important;
          top: 12px !important;
        }
        
        .toast-with-progress {
          border-radius: 12px !important;
          font-size: 13px !important;
          padding: 12px 14px !important;
          padding-bottom: 15px !important;
          max-width: 100% !important;
          min-width: unset !important;
          width: 100% !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Toaster 
      position="top-right"
      gutter={8}
      containerStyle={{
        top: 16,
        right: 16,
        left: 16,
      }}
      containerClassName="Toaster"
      toastOptions={{
        duration: 4000,
        className: 'toast-with-progress',
        style: {
          background: isDark ? '#1e293b' : '#ffffff',
          color: isDark ? '#f1f5f9' : '#1f2937',
          borderRadius: '12px',
          border: isDark ? '1px solid #334155' : '1px solid #e5e7eb',
          boxShadow: isDark
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          padding: '14px 16px',
          paddingBottom: '17px',
          maxWidth: '100%',
          width: '100%',
          fontSize: '13px',
          fontWeight: '500',
        },
        success: {
          duration: 3500,
          className: 'toast-with-progress toast-success',
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.3), 0 10px 10px -5px rgba(16, 185, 129, 0.2)',
            paddingBottom: '17px',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#10b981',
          },
        },
        error: {
          duration: 4500,
          className: 'toast-with-progress toast-error',
          style: {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.3), 0 10px 10px -5px rgba(239, 68, 68, 0.2)',
            paddingBottom: '17px',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#ef4444',
          },
        },
        loading: {
          duration: Infinity,
          style: {
            background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.3), 0 10px 10px -5px rgba(147, 51, 234, 0.2)',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#3b82f6',
          },
        },
      }}
    />
  );
};

export default Toast;
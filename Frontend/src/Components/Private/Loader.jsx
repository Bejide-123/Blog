import { Loader2 } from 'lucide-react';
import { useTheme } from '../../Context/themeContext';

export default function Loader({ size = 'medium', text = '' }) {
  const { theme } = useTheme();
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className="flex flex-row items-center justify-center gap-3">
      <Loader2 
        className={`${sizeClasses[size]} ${theme === 'light' ? 'text-blue-600' : 'text-blue-500'} animate-spin`}
      />
      {text && (
        <p className={`${textSizes[size]} ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
}

// Full Page Loader variant
export function PageLoader({ text = 'Loading...' }) {
  const { theme } = useTheme();
  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-900'} flex flex-row items-center justify-center`}>
      <Loader size="large" text={text} />
    </div>
  );
}

// Button Loader variant (inline)
export function ButtonLoader() {
  return (
    <Loader2 className="w-4 h-4 animate-spin flex items-center justify-center" />
  );
}

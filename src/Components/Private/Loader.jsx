import { Loader2 } from 'lucide-react';

export default function Loader({ size = 'medium', text = '' }) {
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
        className={`${sizeClasses[size]} text-blue-600 dark:text-blue-500 animate-spin`}
      />
      {text && (
        <p className={`${textSizes[size]} text-slate-600 dark:text-slate-400 font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
}

// Full Page Loader variant
export function PageLoader({ text = 'Loading...' }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-row items-center justify-center">
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

// Demo Usage
// function LoaderDemo() {
//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-8 space-y-8">
      
//       {/* Small Loader */}
//       <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
//         <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Small Loader</h3>
//         <Loader size="small" text="Loading..." />
//       </div>

//       {/* Medium Loader */}
//       <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
//         <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Medium Loader</h3>
//         <Loader size="medium" text="Fetching posts..." />
//       </div>

//       {/* Large Loader */}
//       <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
//         <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Large Loader</h3>
//         <Loader size="large" text="Please wait..." />
//       </div>

//       {/* Button with Loader */}
//       <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
//         <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Button Loader</h3>
//         <button 
//           disabled 
//           className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg opacity-70 cursor-not-allowed"
//         >
//           <ButtonLoader />
//           Saving...
//         </button>
//       </div>

//       {/* Page Loader Example */}
//       <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
//         <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Page Loader (Full Screen)</h3>
//         <div className="h-64 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg flex items-center justify-center">
//           <Loader size="large" text="Loading page..." />
//         </div>
//       </div>
//     </div>
//   );
// }

// export { LoaderDemo };
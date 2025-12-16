export default function StatsSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 animate-pulse"
        >
          {/* Icon Skeleton */}
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gray-300 dark:bg-slate-700 rounded-lg" />
            <div className="w-16 h-5 bg-gray-300 dark:bg-slate-700 rounded-full" />
          </div>

          {/* Number Skeleton */}
          <div className="h-8 bg-gray-300 dark:bg-slate-700 rounded w-20 mb-2" />

          {/* Label Skeleton */}
          <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-24" />
        </div>
      ))}
    </div>
  );
}

// Dashboard specific skeleton with sections
export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats Cards Skeleton */}
      <StatsSkeleton count={4} />

      {/* Top Post & Activity Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Post Skeleton */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gray-300 dark:bg-slate-700 rounded" />
            <div className="h-5 bg-gray-300 dark:bg-slate-700 rounded w-48" />
          </div>
          <div className="bg-gray-100 dark:bg-slate-900 rounded-lg p-4">
            <div className="h-6 bg-gray-300 dark:bg-slate-700 rounded w-3/4 mb-3" />
            <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-full mb-2" />
            <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-5/6 mb-4" />
            <div className="flex gap-6">
              <div className="h-8 w-24 bg-gray-300 dark:bg-slate-700 rounded" />
              <div className="h-8 w-24 bg-gray-300 dark:bg-slate-700 rounded" />
            </div>
          </div>
        </div>

        {/* Activity Skeleton */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-gray-300 dark:bg-slate-700 rounded" />
            <div className="h-5 bg-gray-300 dark:bg-slate-700 rounded w-32" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 pb-4 border-b border-gray-200 dark:border-slate-700 last:border-0">
                <div className="w-8 h-8 bg-gray-300 dark:bg-slate-700 rounded-full" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-300 dark:bg-slate-700 rounded w-24 mb-2" />
                  <div className="h-3 bg-gray-300 dark:bg-slate-700 rounded w-full mb-1" />
                  <div className="h-2 bg-gray-300 dark:bg-slate-700 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden animate-pulse">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <div className="h-6 bg-gray-300 dark:bg-slate-700 rounded w-40" />
        </div>
        <div className="p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-slate-700 last:border-0">
              <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-1/2" />
              <div className="flex gap-4">
                <div className="h-4 w-12 bg-gray-300 dark:bg-slate-700 rounded" />
                <div className="h-4 w-12 bg-gray-300 dark:bg-slate-700 rounded" />
                <div className="h-4 w-20 bg-gray-300 dark:bg-slate-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Profile Stats Skeleton
export function ProfileStatsSkeleton() {
  return (
    <div className="flex gap-6 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col">
          <div className="h-6 w-12 bg-gray-300 dark:bg-slate-700 rounded mb-1" />
          <div className="h-4 w-16 bg-gray-300 dark:bg-slate-700 rounded" />
        </div>
      ))}
    </div>
  );
}

// Demo Usage
// function StatsSkeletonDemo() {
//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-20 pb-8">
//       <div className="max-w-7xl mx-auto px-4 py-6">
//         <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
//           Stats Skeleton Demo
//         </h1>

//         {/* Basic Stats Skeleton */}
//         <div className="mb-12">
//           <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
//             Stats Cards
//           </h2>
//           <StatsSkeleton count={4} />
//         </div>

//         {/* Full Dashboard Skeleton */}
//         <div className="mb-12">
//           <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
//             Full Dashboard Layout
//           </h2>
//           <DashboardSkeleton />
//         </div>

//         {/* Profile Stats Skeleton */}
//         <div>
//           <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
//             Profile Stats
//           </h2>
//           <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
//             <ProfileStatsSkeleton />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export { StatsSkeletonDemo };
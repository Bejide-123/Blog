import { useTheme } from "../../Context/themeContext";

export default function StatsSkeleton({ count = 4 }) {
  const { theme } = useTheme();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${
            theme === "light"
              ? "bg-white border-gray-200"
              : "bg-slate-800 border-slate-700"
          } rounded-xl shadow-sm border p-6 animate-pulse`}
        >
          {/* Icon Skeleton */}
          <div className="flex items-center justify-between mb-3">
            <div
              className={`w-12 h-12 ${
                theme === "light" ? "bg-gray-300" : "bg-slate-700"
              } rounded-lg`}
            />
            <div
              className={`w-16 h-5 ${
                theme === "light" ? "bg-gray-300" : "bg-slate-700"
              } rounded-full`}
            />
          </div>

          {/* Number Skeleton */}
          <div
            className={`h-8 ${
              theme === "light" ? "bg-gray-300" : "bg-slate-700"
            } rounded w-20 mb-2`}
          />

          {/* Label Skeleton */}
          <div
            className={`h-4 ${
              theme === "light" ? "bg-gray-300" : "bg-slate-700"
            } rounded w-24`}
          />
        </div>
      ))}
    </div>
  );
}

// Dashboard specific skeleton with sections
export function DashboardSkeleton() {
  const { theme } = useTheme();
  return (
    <div className="space-y-8">
      {/* Stats Cards Skeleton */}
      <StatsSkeleton count={4} />

      {/* Top Post & Activity Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Post Skeleton */}
        <div
          className={`lg:col-span-2 ${
            theme === "light"
              ? "bg-white border-gray-200"
              : "bg-slate-800 border-slate-700"
          } rounded-xl shadow-sm border p-6 animate-pulse`}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className={`w-6 h-6 ${
                theme === "light" ? "bg-gray-300" : "bg-slate-700"
              } rounded`}
            />
            <div
              className={`h-5 ${
                theme === "light" ? "bg-gray-300" : "bg-slate-700"
              } rounded w-48`}
            />
          </div>
          <div
            className={`${
              theme === "light" ? "bg-gray-100" : "bg-slate-900"
            } rounded-lg p-4`}
          >
            <div
              className={`h-6 ${
                theme === "light" ? "bg-gray-300" : "bg-slate-700"
              } rounded w-3/4 mb-3`}
            />
            <div
              className={`h-4 ${
                theme === "light" ? "bg-gray-300" : "bg-slate-700"
              } rounded w-full mb-2`}
            />
            <div
              className={`h-4 ${
                theme === "light" ? "bg-gray-300" : "bg-slate-700"
              } rounded w-5/6 mb-4`}
            />
            <div className="flex gap-6">
              <div
                className={`h-8 w-24 ${
                  theme === "light" ? "bg-gray-300" : "bg-slate-700"
                } rounded`}
              />
              <div
                className={`h-8 w-24 ${
                  theme === "light" ? "bg-gray-300" : "bg-slate-700"
                } rounded`}
              />
            </div>
          </div>
        </div>

        {/* Activity Skeleton */}
        <div
          className={`${
            theme === "light"
              ? "bg-white border-gray-200"
              : "bg-slate-800 border-slate-700"
          } rounded-xl shadow-sm border p-6 animate-pulse`}
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className={`w-5 h-5 ${
                theme === "light" ? "bg-gray-300" : "bg-slate-700"
              } rounded`}
            />
            <div
              className={`h-5 ${
                theme === "light" ? "bg-gray-300" : "bg-slate-700"
              } rounded w-32`}
            />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`flex gap-3 pb-4 border-b ${
                  theme === "light" ? "border-gray-200" : "border-slate-700"
                } last:border-0`}
              >
                <div
                  className={`w-8 h-8 ${
                    theme === "light" ? "bg-gray-300" : "bg-slate-700"
                  } rounded-full`}
                />
                <div className="flex-1">
                  <div
                    className={`h-3 ${
                      theme === "light" ? "bg-gray-300" : "bg-slate-700"
                    } rounded w-24 mb-2`}
                  />
                  <div
                    className={`h-3 ${
                      theme === "light" ? "bg-gray-300" : "bg-slate-700"
                    } rounded w-full mb-1`}
                  />
                  <div
                    className={`h-2 ${
                      theme === "light" ? "bg-gray-300" : "bg-slate-700"
                    } rounded w-16`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div
        className={`${
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-slate-800 border-slate-700"
        } rounded-xl shadow-sm border overflow-hidden animate-pulse`}
      >
        <div
          className={`px-6 py-4 border-b ${
            theme === "light" ? "border-gray-200" : "border-slate-700"
          }`}
        >
          <div
            className={`h-6 ${
              theme === "light" ? "bg-gray-300" : "bg-slate-700"
            } rounded w-40`}
          />
        </div>
        <div className="p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`flex items-center justify-between py-3 border-b ${
                theme === "light" ? "border-gray-200" : "border-slate-700"
              } last:border-0`}
            >
              <div
                className={`h-4 ${
                  theme === "light" ? "bg-gray-300" : "bg-slate-700"
                } rounded w-1/2`}
              />
              <div className="flex gap-4">
                <div
                  className={`h-4 w-12 ${
                    theme === "light" ? "bg-gray-300" : "bg-slate-700"
                  } rounded`}
                />
                <div
                  className={`h-4 w-12 ${
                    theme === "light" ? "bg-gray-300" : "bg-slate-700"
                  } rounded`}
                />
                <div
                  className={`h-4 w-20 ${
                    theme === "light" ? "bg-gray-300" : "bg-slate-700"
                  } rounded`}
                />
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
  const { theme } = useTheme();
  return (
    <div className="flex gap-6 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col">
          <div
            className={`h-6 w-12 ${
              theme === "light" ? "bg-gray-300" : "bg-slate-700"
            } rounded mb-1`}
          />
          <div
            className={`h-4 w-16 ${
              theme === "light" ? "bg-gray-300" : "bg-slate-700"
            } rounded`}
          />
        </div>
      ))}
    </div>
  );
}

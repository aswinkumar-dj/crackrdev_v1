export const unstable_instant = true;

function SkeletonBlock({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gradient-to-r from-[#e7f3f3] via-white to-[#e7f3f3] bg-[length:200%_100%] ${className}`}
    />
  );
}

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#f4fbfb]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="space-y-3">
            <SkeletonBlock className="h-10 w-44" />
            <SkeletonBlock className="h-5 w-72 max-w-full rounded-full" />
          </div>
          <SkeletonBlock className="h-11 w-28 rounded-xl" />
        </div>

        <div className="rounded-[28px] border border-[#d7e8e8] bg-[#102032] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.14)]">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="space-y-3">
              <SkeletonBlock className="h-4 w-28 rounded-full bg-[#1d3a59]" />
              <SkeletonBlock className="h-8 w-80 max-w-full bg-[#19304c]" />
              <SkeletonBlock className="h-4 w-40 bg-[#19304c]" />
              <SkeletonBlock className="h-4 w-[32rem] max-w-full bg-[#19304c]" />
            </div>
            <SkeletonBlock className="h-8 w-24 rounded-full bg-[#19304c]" />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#214060] bg-[#15253a] p-4"
              >
                <SkeletonBlock className="h-3 w-20 bg-[#1d3a59]" />
                <SkeletonBlock className="mt-4 h-8 w-16 bg-[#1d3a59]" />
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#214060] bg-[#15253a] p-4"
              >
                <SkeletonBlock className="h-3 w-32 bg-[#1d3a59]" />
                <div className="mt-4 space-y-2">
                  <SkeletonBlock className="h-4 w-full bg-[#1d3a59]" />
                  <SkeletonBlock className="h-4 w-11/12 bg-[#1d3a59]" />
                  <SkeletonBlock className="h-4 w-9/12 bg-[#1d3a59]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-[#dceaea] bg-white p-6">
          <SkeletonBlock className="h-7 w-44" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-2xl border border-[#dceaea] bg-[#f8fbfb] px-4 py-4"
              >
                <div className="space-y-2">
                  <SkeletonBlock className="h-4 w-32" />
                  <SkeletonBlock className="h-3 w-24 rounded-full" />
                </div>
                <div className="flex items-center gap-3">
                  <SkeletonBlock className="h-5 w-12 rounded-full" />
                  <SkeletonBlock className="h-7 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

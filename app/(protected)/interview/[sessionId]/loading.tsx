export const unstable_instant = true;

function SkeletonBlock({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gradient-to-r from-[#dfeeee] via-white to-[#dfeeee] bg-[length:200%_100%] ${className}`}
    />
  );
}

export default function InterviewSessionLoading() {
  return (
    <section className="relative h-[calc(100dvh-4rem)] overflow-hidden bg-[#f4fbfb] text-[#15314d]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(23,161,166,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(26,39,68,0.08),_transparent_30%)]" />

      <div className="relative mx-auto flex h-full max-w-7xl flex-col overflow-hidden px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <SkeletonBlock className="h-4 w-36 rounded-full" />
            <SkeletonBlock className="h-10 w-72 max-w-full" />
            <SkeletonBlock className="h-4 w-52 rounded-full" />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end sm:gap-2.5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-[#dceaea] bg-white px-3 py-2.5 shadow-[0_6px_16px_rgba(21,49,77,0.05)]"
              >
                <SkeletonBlock className="h-3 w-16 rounded-full" />
                <SkeletonBlock className="mt-2 h-4 w-20" />
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto grid min-h-0 w-full max-w-6xl flex-1 gap-4 py-4 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="relative flex min-h-0 overflow-hidden rounded-xl border border-[#dceaea] bg-white p-5 shadow-[0_12px_32px_rgba(21,49,77,0.08)] sm:p-6">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1a2744] via-[#17a1a6] to-[#7cd5d8]" />

            <div className="flex h-full min-h-0 w-full flex-col justify-between">
              <div className="max-w-2xl space-y-4">
                <SkeletonBlock className="h-8 w-32 rounded-full" />
                <div className="space-y-2">
                  <SkeletonBlock className="h-3 w-20 rounded-full" />
                  <SkeletonBlock className="h-8 w-40" />
                </div>
                <div className="space-y-2">
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-11/12" />
                  <SkeletonBlock className="h-4 w-9/12" />
                </div>
                <div className="rounded-xl border border-[#d6eeee] bg-[#f0fafa] px-4 py-4">
                  <SkeletonBlock className="h-3 w-28 rounded-full" />
                  <SkeletonBlock className="mt-3 h-5 w-full" />
                  <SkeletonBlock className="mt-2 h-4 w-2/5" />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <SkeletonBlock className="h-14 w-[220px] rounded-xl" />
                <SkeletonBlock className="h-10 w-44 rounded-xl" />
                <SkeletonBlock className="h-12 w-36 rounded-xl" />
              </div>
            </div>
          </div>

          <aside className="flex min-h-0 flex-col gap-4">
            <div className="overflow-hidden rounded-xl border border-[#dceaea] bg-white shadow-[0_8px_24px_rgba(21,49,77,0.08)]">
              <SkeletonBlock className="aspect-[4/4.2] w-full rounded-none" />
              <div className="space-y-2.5 border-t border-[#e4efef] px-4 py-3">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-3 w-20 rounded-full" />
              </div>
            </div>

            <div className="flex flex-1 flex-col rounded-xl border border-[#dceaea] bg-white p-4 shadow-[0_8px_24px_rgba(21,49,77,0.08)]">
              <SkeletonBlock className="h-3 w-24 rounded-full" />
              <div className="mt-4 space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex gap-3">
                    <SkeletonBlock className="h-6 w-6 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <SkeletonBlock className="h-4 w-full" />
                      <SkeletonBlock className="h-4 w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

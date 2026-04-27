import Link from "next/link";

export default function Hero() {
  return (
    <section
      data-reveal
      className="overflow-hidden border-b border-[#dcebea] bg-[linear-gradient(135deg,#f8fbfb_0%,#eef8f7_52%,#fff8f1_100%)]"
    >
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-4xl items-center justify-center px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <div className="max-w-3xl text-center">
          <div className="mb-3 flex justify-center">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-gradient-to-r from-transparent to-[#17a1a6]" />
              <span className="text-xs font-semibold tracking-widest text-[#127d82] uppercase">
                AI-Powered Interview Prep
              </span>
              <div className="h-1 w-8 bg-gradient-to-l from-transparent to-[#17a1a6]" />
            </div>
          </div>

          
          <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight text-[#101616] sm:text-5xl lg:text-[3.5rem]">
            Stop freezing when they ask, &quot;explain your approach.&quot;
          </h1>
          <p className="mt-3 mx-auto max-w-2xl text-base font-normal leading-7 text-[#4b5d5b] sm:text-lg">
            Hold a button to answer an AI interviewer out loud. This is
            interview pressure, not another chatbot.
          </p>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row justify-center">
            <Link
              href="/interview"
              className="inline-flex items-center justify-center rounded-lg bg-[#17a1a6] px-6 py-3 text-base font-semibold text-white shadow-[0_12px_30px_rgba(23,161,166,0.25)] transition hover:bg-[#12898e] hover:shadow-[0_16px_40px_rgba(23,161,166,0.35)]"
            >
              Start Practicing
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-lg border border-[#8fcaca] bg-white/50 px-6 py-3 text-base font-medium text-[#127d82] transition hover:bg-white backdrop-blur-sm"
            >
              See How It Works
            </Link>
          </div>

          <div className="mt-12 space-y-4">
            <p className="text-xs uppercase tracking-widest text-[#8a9b99] font-semibold">
              Available difficulty levels
            </p>
            <div className="mx-auto grid max-w-md grid-cols-3 gap-3">
              <div className="rounded-lg border border-[#d4e8e7] bg-white/60 p-4 backdrop-blur-sm hover:bg-white/80 transition">
                <p className="mt-2 text-xs font-semibold text-[#2e4240]">
                  Easy
                </p>
                <p className="text-xs text-[#637370]">Fundamentals</p>
              </div>
              <div className="rounded-lg border border-[#d4e8e7] bg-white/60 p-4 backdrop-blur-sm hover:bg-white/80 transition">
                <p className="mt-2 text-xs font-semibold text-[#2e4240]">
                  Medium
                </p>
                <p className="text-xs text-[#637370]">Real scenarios</p>
              </div>
              <div className="rounded-lg border border-[#d4e8e7] bg-white/60 p-4 backdrop-blur-sm hover:bg-white/80 transition">
                <p className="mt-2 text-xs font-semibold text-[#2e4240]">
                  Hard
                </p>
                <p className="text-xs text-[#637370]">Edge cases</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

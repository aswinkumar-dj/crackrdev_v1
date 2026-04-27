import Link from "next/link";

export default function CareerGuidance() {
  return (
    <section id="career" data-reveal className="bg-[#f8fbfb] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-center">
        <div>
          <p className="section-kicker">Career guidance</p>
          <h2 className="section-title">
            Need a human read on your prep?
          </h2>
          <p className="section-copy">
            Book a free 1:1 call. CrackrDev AI Founder and its team will
            contact you, no pitch, no cost.
          </p>
          <Link
            href="https://calendly.com/crackrdev-ai-placeholder/interview-prep"
            className="mt-8 inline-flex rounded-lg bg-[#17a1a6] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#12898e]"
          >
            Book a Free 1:1 Call
          </Link>
        </div>

        <div data-reveal-card className="rounded-lg border border-[#cfe5e4] bg-white p-5 shadow-[0_14px_40px_rgba(16,22,22,0.06)]">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#17a1a6] text-2xl font-semibold text-white">
              C
            </div>
            <div>
              <p className="text-xl font-semibold text-[#101616]">
                CrackrDev AI
              </p>
              <p className="text-sm font-medium text-[#637370]">
                Founder and team - prep call
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-lg bg-[#fff8f1] p-5 text-sm font-semibold leading-6 text-[#5c4030]">
            &quot;Bring your resume and one target company. We will make the next week
            of prep obvious.&quot;
          </div>
        </div>
      </div>
    </section>
  );
}

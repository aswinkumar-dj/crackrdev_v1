const STEPS = [
  {
    label: "01",
    title: "Choose difficulty",
    copy: "Pick easy, medium, or hard. The interview adapts its pace and depth.",
  },
  {
    label: "02",
    title: "Enter the interview room",
    copy: "The AI asks. You hold push-to-talk and answer out loud.",
  },
  {
    label: "03",
    title: "Get feedback",
    copy: "Review clarity, correctness, edge cases, and next practice steps.",
  },
];

function StepVisual({ label }: { label: string }) {
  if (label === "01") {
    return (
      <div className="flex h-full items-center justify-center gap-2 rounded-md bg-white">
        <span className="rounded-md bg-[#e4f6f5] px-3 py-2 text-xs font-medium text-[#127d82]">
          Easy
        </span>
        <span className="rounded-md bg-[#fff8f1] px-3 py-2 text-xs font-medium text-[#9a4c05]">
          Medium
        </span>
        <span className="rounded-md bg-[#101616] px-3 py-2 text-xs font-medium text-white">
          Hard
        </span>
      </div>
    );
  }

  if (label === "02") {
    return (
      <div className="flex h-full items-center justify-between gap-3 rounded-md bg-white px-4">
        <div className="flex items-end gap-1">
          <span className="h-4 w-1 rounded-md bg-[#17a1a6]" />
          <span className="h-7 w-1 rounded-md bg-[#f27b53]" />
          <span className="h-10 w-1 rounded-md bg-[#17a1a6]" />
          <span className="h-6 w-1 rounded-md bg-[#f2b84b]" />
          <span className="h-8 w-1 rounded-md bg-[#17a1a6]" />
        </div>
        <span className="rounded-md bg-[#17a1a6] px-4 py-2 text-xs font-semibold text-white">
          Hold
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-center gap-3 rounded-md bg-white px-4">
      <div className="h-2 rounded-md bg-[#dcebea]">
        <div className="h-2 w-10/12 rounded-md bg-[#17a1a6]" />
      </div>
      <div className="h-2 rounded-md bg-[#dcebea]">
        <div className="h-2 w-8/12 rounded-md bg-[#f2b84b]" />
      </div>
      <div className="h-2 rounded-md bg-[#dcebea]">
        <div className="h-2 w-6/12 rounded-md bg-[#f27b53]" />
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      data-reveal
      className="border-y border-[#dcebea] bg-[#f8fbfb] px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="section-kicker">How it works</p>
            <h2 className="section-title">
              A room where you have to speak.
            </h2>
          </div>
          <p className="max-w-md text-sm font-semibold leading-6 text-[#536461]">
            Think, hold, answer, release. That rhythm trains composure.
          </p>
        </div>

        <div className="mt-9 grid gap-4 lg:grid-cols-3">
          {STEPS.map((step) => (
            <article
              key={step.title}
              data-reveal-card
              className="relative rounded-lg border border-[#cfe5e4] bg-white p-5 shadow-[0_12px_34px_rgba(16,22,22,0.04)]"
            >
              <p className="text-sm font-semibold text-[#f27b53]">{step.label}</p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-[#101616]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm font-normal leading-6 text-[#536461]">
                {step.copy}
              </p>
              <div className="mt-6 h-20 rounded-lg border border-[#d9e9e8] bg-[#f8fbfb] p-3">
                <StepVisual label={step.label} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

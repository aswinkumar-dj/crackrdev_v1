const PAIN_POINTS = [
  {
    title: "You know the code, then your voice disappears",
    copy: "Explaining under pressure is a different skill from solving alone.",
  },
  {
    title: "Friend mocks feel too polite",
    copy: "They help, but they rarely probe like an interviewer.",
  },
  {
    title: "Most tools are either shallow or pricey",
    copy: "Chatbots feel fake. Premium coaching can be too much too soon.",
  },
];

export default function Problem() {
  return (
    <section id="problem" data-reveal className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="section-kicker">The real problem</p>
          <h2 className="section-title">
            Interview anxiety needs speaking reps.
          </h2>
          <p className="section-copy">
            Practice the uncomfortable part: explaining while someone is
            listening.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PAIN_POINTS.map((point, index) => (
            <article
              key={point.title}
              data-reveal-card
              className="rounded-lg border border-[#d9e9e8] bg-[#f8fbfb] p-5 shadow-[0_10px_28px_rgba(16,22,22,0.04)]"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#e4f6f5] text-base font-semibold text-[#127d82]">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-[#101616]">
                {point.title}
              </h3>
              <p className="mt-3 text-sm font-normal leading-6 text-[#536461]">
                {point.copy}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

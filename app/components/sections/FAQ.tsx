const FAQS = [
  {
    question: "Is it free?",
    answer:
      "You can start practicing for free.",
  },
  {
    question: "What rounds are covered?",
    answer:
      "DSA, system design basics, project discussion, and HR-style rounds.",
  },
  {
    question: "Is it browser-based?",
    answer:
      "Yes. Voice, push-to-talk, and coding all run in the browser.",
  },
  {
    question: "How does feedback work?",
    answer:
      "You get a breakdown of clarity, correctness, edge cases, and next steps.",
  },
  {
    question: "Who built this?",
    answer:
      "Ashwin built it for Indian CS freshers who need real speaking reps.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" data-reveal className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="max-w-3xl">
          <p className="section-kicker">FAQ</p>
          <h2 className="section-title">Questions before you hold the mic.</h2>
        </div>

        <div className="mt-10 divide-y divide-[#dcebea] rounded-lg border border-[#dcebea] bg-[#f8fbfb]">
          {FAQS.map((item) => (
            <details key={item.question} data-reveal-card className="group p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-[#101616]">
                {item.question}
                <span className="text-2xl text-[#17a1a6] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm font-normal leading-6 text-[#536461]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

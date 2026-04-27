import { FiBarChart2, FiCode, FiLayers, FiMic } from "react-icons/fi";

const FEATURES = [
  {
    title: "Push-to-talk voice interview",
    copy: "Hold, answer, release. No endless chat thread.",
    icon: FiMic,
  },
  {
    title: "Monaco code editor",
    copy: "Code in a familiar editor during the mock.",
    icon: FiCode,
  },
  {
    title: "Adaptive interview modes",
    copy: "Move from warm-up questions to deeper follow-ups as you improve.",
    icon: FiLayers,
  },
  {
    title: "Feedback breakdown",
    copy: "See what worked and what to fix next.",
    icon: FiBarChart2,
  },
];

export default function Features() {
  return (
    <section id="features" data-reveal className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="section-kicker">Features</p>
          <h2 className="section-title">
            Practice what product interviews test.
          </h2>
          <p className="section-copy">
            Spoken reasoning, coding flow, and useful feedback in one focused
            practice loop.
          </p>
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-2">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                data-reveal-card
                className="rounded-lg border border-[#d9e9e8] bg-[#f8fbfb] p-5 transition hover:border-[#9fd3d1] hover:bg-[#f1faf9]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-[#c8e4e2] bg-white text-[#127d82]">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-[#101616]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm font-normal leading-6 text-[#536461]">
                  {feature.copy}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";

export default function FooterCTA() {
  return (
    <section data-reveal className="bg-[#101616] px-4 py-14 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 rounded-lg border border-[#24413f] bg-[#14201f] p-7 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#74d5d2]">
            Ready when you are
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Hold the button. Answer like it matters.
          </h2>
        </div>
        <Link
          href="/interview"
          className="inline-flex items-center justify-center rounded-lg bg-[#17a1a6] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#21b4b9]"
        >
          Start Practicing
        </Link>
      </div>
    </section>
  );
}

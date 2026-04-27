import {
  SiAirbnb,
  SiAtlassian,
  SiFlipkart,
  SiGithub,
  SiGoogle,
  SiPaypal,
  SiPaytm,
  SiPhonepe,
  SiPostman,
  SiRazorpay,
  SiStripe,
  SiSwiggy,
  SiUber,
  SiZomato,
} from "react-icons/si";

const COMPANY_LOGOS = [
  { Icon: SiSwiggy, className: "left-[8%] top-[18%] h-8 w-8" },
  { Icon: SiRazorpay, className: "left-[28%] top-[8%] h-11 w-11" },
  { Icon: SiFlipkart, className: "left-[51%] top-[18%] h-9 w-9" },
  { Icon: SiZomato, className: "right-[8%] top-[10%] h-10 w-10" },
  { Icon: SiPhonepe, className: "left-[16%] top-[48%] h-9 w-9" },
  { Icon: SiPaytm, className: "left-[38%] top-[39%] h-10 w-10" },
  { Icon: SiPostman, className: "right-[34%] top-[47%] h-9 w-9" },
  { Icon: SiAtlassian, className: "right-[12%] top-[38%] h-11 w-11" },
  { Icon: SiUber, className: "left-[4%] bottom-[14%] h-8 w-8" },
  { Icon: SiGoogle, className: "left-[26%] bottom-[10%] h-10 w-10" },
  { Icon: SiStripe, className: "left-[49%] bottom-[18%] h-8 w-8" },
  { Icon: SiPaypal, className: "right-[23%] bottom-[10%] h-10 w-10" },
  { Icon: SiAirbnb, className: "right-[5%] bottom-[18%] h-8 w-8" },
  { Icon: SiGithub, className: "left-[62%] top-[6%] h-8 w-8" },
];

export default function WhoItsFor() {
  return (
    <section data-reveal className="border-y border-[#dcebea] bg-[#101616] px-4 py-[4.5rem] text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="max-w-xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#74d5d2]">
            Who it is for
          </p>
          <h2 className="max-w-lg text-3xl font-semibold leading-tight tracking-tight sm:text-[2.6rem]">
            Freshers with product-company ambition.
          </h2>
          <p className="mt-4 max-w-md text-[15px] font-normal leading-7 text-[#c6d7d4]">
            For 0-2 year CS candidates applying to Indian product teams.
          </p>
        </div>

        <div data-reveal-card className="relative min-h-[380px] overflow-hidden lg:min-h-[420px]">
          <p className="mx-auto max-w-s text-center text-sm font-medium leading-6 text-[#d9fffb]">
            Practice for the kind of product teams freshers dream about.
          </p>
          <div className="pointer-events-none absolute inset-x-0 top-14 h-[280px] sm:h-[310px]">
            {COMPANY_LOGOS.map(({ Icon, className }, index) => (
              <div
                key={index}
                className={`absolute flex items-center justify-center text-[#d9fffb]/80 transition ${className}`}
              >
                <Icon aria-label="Product company logo" className="h-full w-full" />
              </div>
            ))}
          </div>
          <p className="absolute bottom-0 left-1/2 w-full max-w-sm -translate-x-1/2 text-center text-sm font-normal leading-6 text-[#b5cbc8]">
            The goal is simple: sound clear when someone asks, &quot;why this?&quot;
          </p>
        </div>
      </div>
    </section>
  );
}

import CareerGuidance from "../components/sections/CareerGuidance";
import FAQ from "../components/sections/FAQ";
import Features from "../components/sections/Features";
import FooterCTA from "../components/sections/FooterCTA";
import Hero from "../components/sections/Hero";
import HowItWorks from "../components/sections/HowItWorks";
import Problem from "../components/sections/Problem";
import WhoItsFor from "../components/sections/WhoItsFor";

export default function Home() {
  return (
    <div className="bg-[#f8fbfb] text-[#101616]">
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <WhoItsFor />
      <CareerGuidance />
      <FAQ />
      <FooterCTA />
    </div>
  );
}

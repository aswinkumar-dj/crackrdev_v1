"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function RevealAnimations() {
  useEffect(() => {
    // Create context for animations
    const ctx = gsap.context(() => {
      // Animate reveal sections
      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      if (reveals.length > 0) {
        reveals.forEach((section) => {
          gsap.fromTo(
            section,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 82%",
                once: true,
              },
            },
          );
        });
      }

      // Animate reveal cards
      const cards = gsap.utils.toArray<HTMLElement>("[data-reveal-card]");
      if (cards.length > 0) {
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { autoAlpha: 0, y: 18 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                once: true,
              },
            },
          );
        });
      }
    });

    // Cleanup on unmount
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
}

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ChevronDown } from "lucide-react";

const HeroIntro = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleMainRef = useRef<HTMLParagraphElement>(null);
  const subtitleSmallRef = useRef<HTMLParagraphElement>(null);
  const arrowRef = useRef(null);

  useEffect(() => {
    if (!titleRef.current) return;

    const text = titleRef.current.textContent || "";
    titleRef.current.textContent = "";

    text.split("").forEach((letter) => {
      const spanWrapper = document.createElement("span");
      const span = document.createElement("span");

      span.textContent = letter;
      span.style.display = "inline-block";
      span.style.transform = "translateY(120%)";
      spanWrapper.style.overflow = "hidden";
      spanWrapper.style.display = "inline-block";

      spanWrapper.appendChild(span);
      titleRef.current?.appendChild(spanWrapper);
    });

    const letters = titleRef.current.querySelectorAll("span > span");

    const tl = gsap.timeline({ delay: 0.4 });

    tl.to(letters, {
      y: "0%",
      duration: 1.2,
      ease: "power4.out",
      stagger: 0.08,
    })
      .fromTo(
        subtitleMainRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
        "-=0.5"
      )
      .fromTo(
        subtitleSmallRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        "-=0.6"
      )
      .fromTo(
        arrowRef.current,
        { opacity: 0, y: -10 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          onStart: () => {
            if (arrowRef.current) {
              gsap.to(arrowRef.current, {
                y: 12,
                repeat: -1,
                yoyo: true,
                duration: 0.8,
                ease: "power1.inOut",
              });
            }
          },
        },
        "-=0.2"
      );
  }, []);

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center bg-[#131516] overflow-hidden px-4">
      {/* === TITLE === */}
      <h1
        ref={titleRef}
        className="text-[14vw] leading-none font-bigbesty text-[#c5ff75] tracking-tight text-center pb-4"
      >
        Daily Weird
      </h1>

      {/* === SUBS === */}
      <div className="flex flex-col items-center mt-10 text-center sm:items-end sm:text-right sm:absolute sm:right-[15%] sm:top-[60%] sm:mt-0">
        {" "}
        <p
          ref={subtitleMainRef}
          className="text-white text-lg sm:text-2xl uppercase tracking-widest font-roboto font-bold"
        >
          {" "}
          The weird, every day{" "}
        </p>{" "}
        <p
          ref={subtitleSmallRef}
          className="text-gray-400 text-xs sm:text-sm mt-3 uppercase tracking-widest font-roboto"
        >
          {" "}
          ©2025 - All rights reserved{" "}
        </p>{" "}
      </div>

      <div
        ref={arrowRef}
        className="absolute bottom-10 flex justify-center items-center text-[#c5ff75]"
      >
        {" "}
        <ChevronDown size={40} strokeWidth={2.5} />{" "}
      </div>
    </section>
  );
};

export default HeroIntro;

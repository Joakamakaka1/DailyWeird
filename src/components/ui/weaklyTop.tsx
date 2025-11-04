import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useNavigate } from "react-router-dom";
import type { DailyWeird } from "../../model/DailyWeird";
import api from "../../../api/api";

gsap.registerPlugin(ScrollTrigger);

const WeaklyTop: React.FC = () => {
  const navigate = useNavigate();
  const [weeklyJsons, setWeeklyJsons] = useState<DailyWeird[] | null>([]);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(
    () => window.innerWidth >= 1024
  );

  const fetchWeeklyJsons = async () => {
    try {
      const response = await api.get("/n8n?path=dailyweird-json");
      console.log("RESPONSE:", response.data);
      const result = response.data.data;
      setWeeklyJsons(result);
    } catch (error) {
      console.error("ERROR FETCH:", error);
    }
  };

  useEffect(() => {
    fetchWeeklyJsons();
  });

  // === Lenis (smooth scroll global) ===
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.3, smoothWheel: true });
    const raf = (time: number) => {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // === Detect screen width ===
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // === Build horizontal scroll for desktop ===
  const buildHorizontalScroll = () => {
    if (!isDesktop) return;
    const section = sectionRef.current;
    const track = containerRef.current;
    if (!section || !track) return;

    ScrollTrigger.getAll().forEach((t) => t.kill());
    if (scrollTweenRef.current) {
      scrollTweenRef.current.kill();
      scrollTweenRef.current = null;
    }

    const cards = Array.from(track.children) as HTMLElement[];
    if (!cards.length) return;

    const viewport = window.innerWidth;
    const offset = -640;
    const lastCard = cards[cards.length - 1];
    const lastCardCenter = lastCard.offsetLeft + lastCard.offsetWidth / 2;
    const viewportCenter = viewport / 2;
    const scrollDistance = Math.max(
      0,
      lastCardCenter - viewportCenter + offset
    );

    gsap.set(track, { x: 0 });

    scrollTweenRef.current = gsap.to(track, {
      x: -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${scrollDistance}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
  };

  // === Initialize / clean GSAP scroll ===
  useEffect(() => {
    if (isDesktop) {
      buildHorizontalScroll();
    } else {
      // Clean GSAP if switching to mobile/tablet
      if (scrollTweenRef.current) {
        scrollTweenRef.current.kill();
        scrollTweenRef.current = null;
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (containerRef.current) gsap.set(containerRef.current, { x: 0 });
    }

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (scrollTweenRef.current) {
        scrollTweenRef.current.kill();
        scrollTweenRef.current = null;
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

  // === Subtle entrance animation (desktop only) ===
  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean) as HTMLElement[];
    if (!cards.length) return;

    if (isDesktop) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    } else {
      cards.forEach((c) => gsap.set(c, { opacity: 1, y: 0, scale: 1 }));
    }
  }, [isDesktop]);

  // === Hover effects (desktop only) ===
  const handleEnter = (el: HTMLDivElement) => {
    if (!isDesktop) return;
    gsap.to(el, {
      scale: 1.06,
      y: -8,
      duration: 0.28,
      ease: "power3.out",
      boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
    });
  };

  const handleLeave = (el: HTMLDivElement) => {
    if (!isDesktop) return;
    gsap.to(el, {
      scale: 1,
      y: 0,
      duration: 0.4,
      ease: "power3.inOut",
      boxShadow: "none",
    });
  };

  const navigateToTheTop = () => navigate("/dailyWeirdTop");

  return (
    <section
      ref={sectionRef}
      className="text-white lg:px-12 w-full min-h-screen overflow-hidden relative"
    >
      {/* Header */}
      <div className="text-center sticky top-20 mb-40 px-4">
        <p className="text-[#c5ff75] font-roboto font-semibold text-2xs uppercase tracking-widest pb-4">
          What's Hot Right Now
        </p>
        <h2 className="text-4xl sm:text-5xl font-extrabold mt-3 font-bigbesty">
          Trending Topics of the Week
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mt-4 text-base sm:text-lg leading-relaxed">
          Discover the stories everyone is talking about. Curated and updated
          weekly just for you.
        </p>
      </div>

      {/* Cards container */}
      <div
        ref={containerRef}
        className={
          isDesktop
            ? "flex gap-12 no-scrollbar w-full mx-auto"
            : "flex flex-col gap-6 px-4 sm:px-8 w-full mx-auto overflow-y-auto snap-y snap-mandatory touch-pan-y"
        }
        style={
          isDesktop
            ? { scrollSnapType: "x mandatory" }
            : { scrollSnapType: "y mandatory" }
        }
      >
        {weeklyJsons?.map((topic, i) => (
          <div
            key={topic.id}
            ref={(el) => {
              if (el) cardsRef.current[i] = el;
            }}
            onMouseEnter={() =>
              isDesktop &&
              cardsRef.current[i] &&
              handleEnter(cardsRef.current[i]!)
            }
            onMouseLeave={() =>
              isDesktop &&
              cardsRef.current[i] &&
              handleLeave(cardsRef.current[i]!)
            }
            className={
              isDesktop
                ? "bg-gradient-to-r from-[#1e2021] to-[#2a2d2e] border border-[#7a7164]/40 rounded-2xl overflow-hidden shadow-lg cursor-pointer transform-gpu flex flex-col min-w-[360px] md:min-w-[400px] h-[440px]"
                : "snap-start bg-[#151515] border border-[#7a7164]/40 rounded-2xl overflow-hidden shadow-lg cursor-pointer transform-gpu flex flex-col w-full max-w-[600px] mx-auto"
            }
          >
            {/* Image */}
            <div className="relative overflow-hidden">
              <img
                src={topic.image_url}
                alt={topic.title}
                className="w-full h-52 sm:h-60 object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col justify-between flex-1">
              <div className="space-y-3">
                <h3 className="font-semibold font-roboto text-lg sm:text-xl leading-snug line-clamp-2">
                  {topic.title}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base line-clamp-3">
                  {topic.description}
                </p>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-400 mt-4">
                <button
                  onClick={navigateToTheTop}
                  className="text-[#c5ff75] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Read →
                </button>
                <span className="text-xs">{topic.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WeaklyTop;

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect, useRef, useState } from "react";
import type { DailyWeird } from "../../model/DailyWeird";
import api from "../../api/api";

// Registrar ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const numbersRef = useRef<(HTMLHeadingElement | null)[]>([]);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroDescriptionRef = useRef<HTMLParagraphElement>(null);
  const stickyTitleRef = useRef<HTMLDivElement>(null);

  // ========= ANIMACIÓN HERO =========
  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      heroTitleRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: "power3.out",
      }
    );

    tl.fromTo(
      heroDescriptionRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power2.out",
      },
      "-=0.5"
    );
  }, []);

  // ========= SCROLL + ANIMACIÓN DE ARTÍCULOS =========
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Configurar animaciones GSAP para cada artículo
    cardsRef.current.forEach((card, idx) => {
      if (!card) return;

      gsap.set(card, { opacity: 0, y: 60 });

      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: idx * 0.05, // pequeña cascada
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          end: "bottom 70%",
          toggleActions: "play none none none",
        },
      });
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // ========= EFECTOS HOVER =========
  const handleCardEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: -5,
      scale: 1.02,
      boxShadow: "0 15px 30px rgba(197, 255, 117, 0.15)",
      borderColor: "#c5ff75",
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      y: 0,
      scale: 1,
      boxShadow: "none",
      borderColor: "#7a7164/40",
      duration: 0.4,
      ease: "power2.out",
    });
  };

  // ========= FETCH DE DATOS  =========
  const [data, setData] = useState<DailyWeird | null>(null);

  const fetchData = async () => {
    try {
      const response = await api.get("/dailyweird-json");
      const result = response.data.data?.[0];
      setData(result);
    } catch (error) {
      console.error("ERROR FETCH:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 pb-10 bg-[#131516] min-h-screen text-white">
      {/* ========== HEADER ========== */}
      <header className="w-full max-w-[1500px] flex justify-between items-center py-6 mx-auto">
        <h1
          className="text-white text-2xl sm:text-3xl tracking-tight border-b-4 border-lime-700 pb-1"
          style={{ fontFamily: "BigBesty" }}
        >
          Daily Weird
        </h1>
      </header>

      {/* ========== HERO SECTION ========== */}
      <section className="w-full text-center mt-16 mb-10 px-4 py-4">
        <h2
          ref={heroTitleRef}
          className="text-white text-[42px] sm:text-[58px] font-['Crimson_Text'] leading-tight mb-10"
          style={{ fontFamily: "BigBesty" }}
        >
          {data?.title}
        </h2>
        <p
          ref={heroDescriptionRef}
          className="text-[#dbd8d3] text-base sm:text-lg font-['Roboto'] max-w-2xl mx-auto mb-6"
        >
          {data?.description}
        </p>
        <img
          src={data?.image_url}
          alt="Foto Random"
          className="w-full max-w-3xl rounded-3xl shadow-md border border-gray-200 object-cover aspect-video mx-auto"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </section>

      {/* ========== SECCIÓN STICKY + SCROLL ========== */}
      <section className="relative w-full max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-20 lg:gap-32 mt-36">
        {/* Título sticky */}
        <div
          ref={stickyTitleRef}
          className="lg:sticky lg:top-80 lg:self-start lg:w-1/3 h-fit border-l-4 border-lime-700 pl-6"
        >
          <h2
            className="text-[42px] sm:text-[64px] font-['Crimson_Text'] leading-tight mb-6 "
            style={{ fontFamily: "BigBesty" }}
          >
            {data?.title}
          </h2>
          <p className="text-[#dbd8d3] text-base sm:text-lg font-['Roboto']">
            {data?.description}
          </p>
        </div>

        {/* Lista de artículos - aparecen uno a uno */}
        <div className="lg:w-2/3 flex flex-col gap-12">
          {data?.items?.map((item, idx) => (
            <article
              key={idx}
              ref={(el: HTMLDivElement | null) => {
                if (el) cardsRef.current[idx] = el;
              }}
              onMouseEnter={handleCardEnter}
              onMouseLeave={handleCardLeave}
              className="bg-[#1e2021] border border-[#7a7164]/40 p-8 rounded-2xl shadow-sm cursor-pointer"
            >
              {" "}
              <h3
                ref={(el: HTMLHeadingElement | null) => {
                  if (el) numbersRef.current[idx] = el;
                }}
                className="text-[#c5ff75] font-['Roboto'] text-sm mb-1"
              >
                {" "}
                #{item.rank}{" "}
              </h3>{" "}
              <p className="text-white text-xl font-['Roboto']">{item.name}</p>{" "}
              <p className="text-[#dbd8d3] text-sm mt-2 font-['Roboto']">
                {" "}
                {item.description}{" "}
              </p>{" "}
            </article>
          ))}
        </div>
      </section>

      {/* ========== SECCIÓN FINAL ========== */}
      <section className="w-full max-w-[1500px] mx-auto mt-30 text-center">
        <div className="bg-gradient-to-r from-[#1e2021] to-[#2a2d2e] border border-[#7a7164]/40 p-12 rounded-2xl shadow-lg">
          <h3
            className="text-white text-2xl sm:text-3xl font-['Crimson_Text'] mb-6"
            style={{ fontFamily: "BigBesty" }}
          >
            Interested in more weirdness?
          </h3>

          <p className="text-[#dbd8d3] text-lg sm:text-xl font-['Roboto'] max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover daily absurd products, deceptive food items, and objects
            that defy logic. Your daily dose of "why would someone do this?"
            awaits.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button className="cursor-pointer bg-[#c5ff75] text-[#131516] px-8 py-3 rounded-lg font-['Roboto'] font-semibold shadow-lg">
              Subscribe to the weirdness
            </button>
            <button className="cursor-pointer border border-[#c5ff75] text-[#c5ff75] px-8 py-3 rounded-lg font-['Roboto'] font-semibold hover:bg-[#c5ff75] hover:text-[#131516] transition-all duration-300">
              Share weirdness
            </button>
          </div>

          <div className="flex justify-center gap-6 mt-8">
            <span className="text-[#7a7164] font-['Roboto'] text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-[#c5ff75] rounded-full"></span>
              New weirdness every day
            </span>
            <span className="text-[#7a7164] font-['Roboto'] text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-[#c5ff75] rounded-full"></span>
              100% not in common sense
            </span>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="w-full max-w-[1500px] mx-auto mt-20 flex flex-col items-center gap-4">
        <p className="text-xs text-[#c5ff75] font-['Roboto']">
          © {new Date().getFullYear()} DailyWeird.top — All the weird, every
          day.
        </p>
      </footer>
    </main>
  );
};

export default Home;

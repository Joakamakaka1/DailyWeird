import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HeroIntro from "../../components/ui/heroIntro";
import WeaklyTop from "../../components/ui/weaklyTop";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const navigate = useNavigate();

  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // === Inicializar Lenis (scroll suave) ===
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".home-hero-section",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.6"
        )
        .fromTo(
          descRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
          "-=0.4"
        )
        // Botón y estadísticas animan simultáneamente
        .addLabel("buttonAndStats")
        .fromTo(
          buttonRef.current,
          { opacity: 0, scale: 1 },
          { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" },
          "buttonAndStats"
        )
        .fromTo(
          statsRef.current?.querySelectorAll(".stat-item")!,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power4.out",
            stagger: 0.1,
          },
          "buttonAndStats"
        );
    });

    return () => ctx.revert();
  }, []);

  const navigateToTop = () => {
    navigate("/dailyWeirdTop");
  };

  return (
    <main className="w-full min-h-screen bg-[#131516]">
      <HeroIntro />

      <div className="h-[230px] lg:h-[290px]" />

      <section className="home-hero-section w-full flex flex-col lg:flex-row items-center justify-center max-w-[1500px] mx-auto lg:pt-6 not-first:pl-6 text-center lg:text-left overflow-hidden">
        <div className="lg:w-1/2 w-full space-y-5 mt-5 px-4">
          <h1
            ref={titleRef}
            className="text-white text-4xl sm:text-5xl font-bold leading-tight font-bigbesty"
          >
            Your top 10 Daily Weird
          </h1>

          <p ref={subtitleRef} className="text-gray-400 text-sm">
            {new Date().toLocaleDateString()} | by DailyWeird
          </p>

          <p
            ref={descRef}
            className="text-gray-300 text-base sm:text-lg font-roboto max-w-lg mx-auto lg:mx-0"
          >
            In DailyWeird we present you the top 10 weird things of the day. We
            use AI to generate the top 10 weird things of the day. Maybe you
            should check it out.
          </p>

          <button
            ref={buttonRef}
            onClick={navigateToTop}
            className="bg-[#c5ff75] text-white py-2 px-6 rounded-lg transition font-semibold cursor-pointer"
          >
            Read More
          </button>

          <div
            ref={statsRef}
            className="mt-5 flex justify-center lg:justify-start gap-8 text-gray-300"
          >
            <div className="stat-item flex flex-col items-center lg:items-start">
              <span className="text-3xl font-bold text-[#c5ff75]">250+</span>
              <span className="text-sm uppercase tracking-widest text-gray-400">
                Articles
              </span>
            </div>

            <div className="stat-item flex flex-col items-center lg:items-start">
              <span className="text-3xl font-bold text-[#c5ff75]">20K</span>
              <span className="text-sm uppercase tracking-widest text-gray-400">
                Readers
              </span>
            </div>

            <div className="stat-item flex flex-col items-center lg:items-start">
              <span className="text-3xl font-bold text-[#c5ff75]">100%</span>
              <span className="text-sm uppercase tracking-widest text-gray-400 pl-1">
                Random
              </span>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 flex justify-center mt-15 lg:mt-0">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="/images/Logo2.webp"
              alt="Daily Weird logo"
              className="w-[410px] object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      <div className="h-[230px] lg:h-[290px]" />

      <WeaklyTop />
    </main>
  );
};

export default Home;

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect, useRef, useState } from "react";
import EmailModalSubscribe from "../../components/emailModalSubscribe";
import ItemModalImage from "../../components/itemModalImage";
import Footer from "../../components/ui/footer";
import Header from "../../components/ui/header";
import useDailyWeirdData from "../../hooks/getJson";

// Registrar ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const DailyTop = () => {
  const data = useDailyWeirdData();

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

  // ========= MODAL IMAGE =========
  const [selectedItem, setSelectedItem] = useState<{
    name: string;
    image_url: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (item: { name: string; image_url: string }) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // ========= MODAL SUBSCRIBE FORM =========
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);

  const handleOpenSubscribeModal = () => {
    setIsSubscribeModalOpen(true);
  };

  const handleCloseSubscribeModal = () => {
    setIsSubscribeModalOpen(false);
  };

  // ========= SHARING =========
  const [shareText, setShareText] = useState("Share weirdness");

  const handleShare = async () => {
    const shareData = {
      title: "Daily Weird",
      text: "Discover the weirdest products and items curated daily!",
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        setShareText("Copied!");
      } catch (err) {
        console.error("Failed to copy link:", err);
        setShareText("Error");
      }
    }
  };

  return (
    <main className="w-full mx-auto px-4 sm:px-8 bg-[#131516] min-h-screen text-white">
      {/* ========== HEADER ========== */}
      <Header />

      {/* ========== HERO SECTION ========== */}
      <section className="w-full text-center mt-16 mb-10 px-4 py-4">
        <h2
          ref={heroTitleRef}
          className="text-white text-[40px] sm:text-[50px] font-bigbesty leading-tight mb-10 max-w-4xl mx-auto"
        >
          {data?.title || "Loading..."}
        </h2>

        <p
          ref={heroDescriptionRef}
          className="text-gray-400 text-base sm:text-lg font-roboto max-w-2xl mx-auto mb-6"
        >
          Discover the weirdest products and items curated daily to baffle your
          mind. From bizarre gadgets to peculiar food items, we bring you a
          daily dose of the unusual and extraordinary.
        </p>

        <div className="relative w-full max-w-3xl mx-auto aspect-video rounded-3xl overflow-hidden border border-gray-200 shadow-md bg-[#151515]">
          {/* Loader centrado */}
          {!data?.image_url && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#c5ff75] font-roboto animate-pulse">
              <div className="w-10 h-10 border-4 border-[#c5ff75]/40 border-t-[#c5ff75] rounded-full animate-spin mb-3"></div>
              <p className="text-xl font-bigbesty">Loading image...</p>
            </div>
          )}

          {data?.image_url && (
            <img
              src={data.image_url}
              alt="Foto Random"
              className="w-full h-full object-cover transition-opacity duration-700 opacity-0"
              onLoad={(e) => {
                const img = e.currentTarget;
                gsap.to(img, { opacity: 1, duration: 0.8, ease: "power2.out" });
              }}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          )}
        </div>
      </section>

      {/* ========== SECCIÓN STICKY + SCROLL ========== */}
      <section className="relative w-full max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-20 lg:gap-32 mt-36">
        {/* Título sticky */}
        <div
          ref={stickyTitleRef}
          className="lg:sticky lg:top-80 lg:self-start lg:w-1/3 h-fit pl-6"
          style={{ borderLeft: "3px solid #aaff00" }}
        >
          <h2 className="text-[42px] sm:text-[64px] font-bigbesty leading-tight mb-6">
            {data?.title || "Loading..."}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg font-roboto">
            {data?.description || "Loading..."}
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
              onClick={() => handleOpenModal(item)}
              onMouseEnter={handleCardEnter}
              onMouseLeave={handleCardLeave}
              className="bg-[#151515] border border-[#7a7164]/40 p-8 rounded-2xl shadow-sm cursor-pointer hover:border-[#c5ff75]/60 transition-all"
            >
              {" "}
              <h3
                ref={(el: HTMLHeadingElement | null) => {
                  if (el) numbersRef.current[idx] = el;
                }}
                className="text-[#c5ff75] font-roboto text-sm mb-1"
              >
                {" "}
                #{item.rank}{" "}
              </h3>{" "}
              <p className="text-white text-xl font-roboto">{item.name}</p>{" "}
              <p className="text-gray-400 text-sm mt-2 font-roboto">
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
          <h3 className="text-white text-2xl sm:text-3xl font-bigbesty mb-6">
            Interested in more weirdness?
          </h3>

          <p className="text-gray-400 text-lg sm:text-xl font-roboto max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover daily absurd products, deceptive food items, and objects
            that defy logic. Your daily dose of "why would someone do this?"
            awaits.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              className="cursor-pointer bg-[#c5ff75] text-[#131516] px-8 py-3 rounded-lg font-roboto font-semibold shadow-lg"
              onClick={handleOpenSubscribeModal}
            >
              Subscribe to the weirdness
            </button>
            <button
              onClick={handleShare}
              className="cursor-pointer border border-[#c5ff75] text-[#c5ff75] px-8 py-3 rounded-lg font-roboto font-semibold hover:bg-[#c5ff75] hover:text-[#131516] transition-all duration-300"
            >
              {shareText}
            </button>
          </div>

          <div className="flex justify-center gap-6 mt-8">
            <span className="text-[#7a7164] font-roboto text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-[#c5ff75] rounded-full"></span>
              New weirdness every day
            </span>
            <span className="text-[#7a7164] font-roboto text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-[#c5ff75] rounded-full"></span>
              100% not in common sense
            </span>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <Footer />

      {isModalOpen && selectedItem && (
        <ItemModalImage
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={selectedItem.name}
          imageUrl={selectedItem.image_url}
        />
      )}

      <EmailModalSubscribe
        isOpen={isSubscribeModalOpen}
        onClose={handleCloseSubscribeModal}
      />
    </main>
  );
};

export default DailyTop;

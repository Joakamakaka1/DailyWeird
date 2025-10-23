import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  imageUrl: string;
}

const ItemModalImage: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  imageUrl,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Animación de entrada y salida
  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [isOpen]);

  // Animar imagen cuando carga
  useEffect(() => {
    if (isImageLoaded && imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [isImageLoaded]);

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.overflowY = "scroll";
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.overflowY = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    return () => {
      // Limpieza por si el componente se desmonta
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.overflowY = "";
      document.body.style.width = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-[999]"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative bg-[#1e2021] border border-[#7a7164]/40 rounded-3xl shadow-xl max-w-3xl w-[90%] p-6 sm:p-10 text-center cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#c5ff75] hover:text-white text-2xl leading-none font-bold cursor-pointer transition-colors"
        >
          ✕
        </button>

        <h2 className="text-white text-2xl sm:text-3xl font-bigbesty mb-4">
          {title}
        </h2>

        {/* Loader o Imagen */}
        <div className="w-full h-[300px] sm:h-[400px] rounded-2xl overflow-hidden flex justify-center items-center bg-[#131516] border border-[#7a7164]/40">
          {!isImageLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#c5ff75] font-roboto animate-pulse pointer-events-none">
              <div className="w-10 h-10 border-4 border-[#c5ff75]/40 border-t-[#c5ff75] rounded-full animate-spin mb-3"></div>
              <p className="text-xl font-bigbesty">Loading image...</p>
            </div>
          )}
          <img
            ref={imageRef}
            src={imageUrl}
            alt={title}
            onLoad={() => setIsImageLoaded(true)}
            className={`rounded-2xl max-h-[400px] w-full object-cover transition-opacity duration-500 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
};

export default ItemModalImage;

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import type { EmailDailyWeird } from "../model/DailyWeird";
import api from "../api/api";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailModalSubscribe: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const [emailSend, setEmailSend] = useState<EmailDailyWeird | null>(null);
  const [confirmEmail, setConfirmEmail] = useState<EmailDailyWeird | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailInput = (e.target as HTMLFormElement).querySelector(
      'input[type="email"]'
    ) as HTMLInputElement;
    if (!emailInput || !emailInput.value) return;

    const dataEmail = {
      created_at: new Date().toISOString(),
      email: emailInput.value,
      verified: true,
    };

    try {
      // PRIMER POST → Guardar en Supabase
      const saveResponse = await api.post("/dailyweird-send-email", dataEmail);

      // SEGUNDO POST → Enviar email de confirmación
      const confirmResponse = await api.post("/dailyweird-send-confirmation", {
        email: emailInput.value,
      });

      setEmailSend(saveResponse.data);
      setConfirmEmail(confirmResponse.data);
    } catch (error) {
      console.error("Error during subscription:", error);
    }
  };

  useEffect(() => {
    if (emailSend && confirmEmail) {
      const timer = setTimeout(() => {
        setEmailSend(null);
        setConfirmEmail(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [emailSend, confirmEmail]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[#131516] backdrop-blur-sm flex justify-center items-center z-[999]"
      onClick={onClose}
    >
      <div
        className="bg-[#1e2021] rounded-xl shadow-md p-8 max-w-md relative"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Subscribe to our newsletter</h2>
        <p className="mb-4">
          Get the latest weird and wonderful content delivered straight to your
          inbox!
        </p>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            className="px-4 py-2 rounded-md border border-gray-300"
          />
          <button
            type="submit"
            className="bg-[#c5ff75] text-[#131516] px-6 py-3 rounded-md font-roboto text-sm font-semibold transition-colors cursor-pointer"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailModalSubscribe;

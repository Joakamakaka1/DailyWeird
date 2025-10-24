import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import api from "../../api/api";
import supabase from "../db/supabaseClient";
import type { EmailDailyWeird } from "../model/DailyWeird";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailModalSubscribe: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [emailSend, setEmailSend] = useState<EmailDailyWeird | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Animación de entrada
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

  // Bloquear scroll al abrir modal
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
  }, [isOpen]);

  // Login con Google
  const handleGoogleLogin = async () => {
    try {
      setErrorMessage(null); // limpiar error previo
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(
          data.url,
          "_blank",
          "width=500,height=600,menubar=no,toolbar=no,status=no"
        );
      }
    } catch (err) {
      console.error("Error al iniciar sesión con Google:", err);
      setErrorMessage("Error al conectar con Google.");
    }
  };

  // Escuchar mensaje del popup
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "auth-success") {
        const userEmail = event.data.email;
        setErrorMessage(null);
        setIsLoading(true);

        try {
          const response = await api.post("/n8n?path=dailyweird-send-email", {
            created_at: new Date().toISOString(),
            email: userEmail,
            verified: true,
          });

          if (response.data?.success === false) {
            // Mostrar mensaje del endpoint o uno genérico
            const msg =
              response.data?.error ||
              "This email is already registered. Try again";
            setErrorMessage(msg);
            setIsLoading(false);
            return;
          }

          setEmailSend({ email: userEmail } as EmailDailyWeird);
        } catch (error: any) {
          console.error("Error al enviar el correo:", error);
          const msg =
            error.response?.data?.error ||
            error.message ||
            "An unexpected error occurred.";
          setErrorMessage(msg);
        } finally {
          setIsLoading(false);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-[999]"
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

        <button
          onClick={handleGoogleLogin}
          className="cursor-pointer text-black justify-center flex gap-2 items-center bg-[#c5ff75] px-4 py-2 rounded-lg transition-all ease-in duration-200 mt-8 w-full"
        >
          <svg
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6"
          >
            <path
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12
                c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
                c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              fill="#FFC107"
            ></path>
            <path
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12
                c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              fill="#FF3D00"
            ></path>
            <path
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238
                C29.211,35.091,26.715,36,24,36
                c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025
                C9.505,39.556,16.227,44,24,44z"
              fill="#4CAF50"
            ></path>
            <path
              d="M43.611,20.083H42V20H24v8h11.303
                c-0.792,2.237-2.231,4.166-4.087,5.571
                c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238
                C36.971,39.205,44,34,44,24
                C44,22.659,43.862,21.35,43.611,20.083z"
              fill="#1976D2"
            ></path>
          </svg>
          Continue with Google
        </button>

        {/* MENSAJES */}
        {isLoading ? (
          <div className="flex flex-col items-center mt-6 text-[#c5ff75] font-roboto animate-pulse">
            <div className="w-8 h-8 border-4 border-[#c5ff75]/40 border-t-[#c5ff75] rounded-full animate-spin mb-3"></div>
            <p className="text-sm">Adding your Gmail...</p>
          </div>
        ) : emailSend ? (
          <p className="text-green-400 mt-4 text-sm text-center">
            Subscribed successfully!
          </p>
        ) : errorMessage ? (
          <p className="text-red-400 mt-4 text-sm text-center">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default EmailModalSubscribe;

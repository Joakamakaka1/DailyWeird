import { useEffect, useState } from "react";
import api from "../../api/api";
import supabase from "../../db/supabaseClient";

const EmailModalUnsubscribe = () => {
  const [unsubscribed, setUnsubscribed] = useState<boolean>(false);

  //  Login con Google
  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`, // ← ruta callback
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
    }
  };

  //  Una vez el usuario haya iniciado sesión → eliminar automáticamente
  useEffect(() => {
    const checkSessionAndUnsubscribe = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "auth-success") {
        const userEmail = event.data.email;

        try {
          // Guardar email en tu tabla subscribers y enviar correo de bienvenida
          await api.delete("/dailyweird-delete-email", {
            data: { email: userEmail },
          });

          setUnsubscribed(true);
        } catch (error) {
          console.error("Error al enviar el correo:", error);
        }
      }
    };

    window.addEventListener("message", checkSessionAndUnsubscribe);
    return () =>
      window.removeEventListener("message", checkSessionAndUnsubscribe);
  }, []);

  return (
    <div className="fixed text-white inset-0 bg-[#131516] backdrop-blur-sm flex justify-center items-center z-[999]">
      <div
        className="bg-[#1e2021] rounded-xl shadow-md p-8 max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Unsubscribe from DailyWeird</h2>
        <p className="mb-4">
          We're sorry to see you go! You can unsubscribe manually or using your
          Google account.
        </p>

        {/* BOTÓN GOOGLE */}
        <button
          onClick={handleGoogleLogin}
          className="cursor-pointer text-black justify-center flex gap-2 items-center bg-[#c5ff75] px-4 py-2 rounded-lg transition-all ease-in duration-200 mt-8 w-full "
        >
          <svg
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6"
          >
            <path
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              fill="#FFC107"
            ></path>
            <path
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              fill="#FF3D00"
            ></path>
            <path
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              fill="#4CAF50"
            ></path>
            <path
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              fill="#1976D2"
            ></path>
          </svg>
          Continue with Google
        </button>
        {unsubscribed && (
          <p className="text-red-500 mt-3 text-sm">
            You have been unsubscribed. Click{" "}
            <a href="/" className="underline">
              here
            </a>{" "}
            to return to the homepage.
          </p>
        )}
      </div>
    </div>
  );
};

export default EmailModalUnsubscribe;

import { useEffect } from "react";
import { supabase } from "../db/supabaseClient";

export default function AuthCallback() {
  useEffect(() => {
    const sendMessageAndClose = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const email = data?.user?.email;

        if (window.opener && email) {
          window.opener.postMessage(
            { type: "auth-success", email },
            window.location.origin
          );
        }
      } catch (error) {
        console.error("Error en callback:", error);
      } finally {
        window.close();
      }
    };

    sendMessageAndClose();
  }, []);

  return (
    <p className="text-white text-2xl font-bigbesty text-center">
      Logging in...
    </p>
  );
}

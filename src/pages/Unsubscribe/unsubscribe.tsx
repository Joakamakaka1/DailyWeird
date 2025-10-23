import { useEffect, useState } from "react";
import api from "../../api/api";

const EmailModalUnsubscribe = () => {
  const [unsubscribed, setUnsubscribed] = useState<boolean>(false);
  const [confirmUnsubscribe, setConfirmUnsubscribe] = useState<boolean>(false);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailInput = (e.target as HTMLFormElement).querySelector(
      'input[type="email"]'
    ) as HTMLInputElement;
    if (!emailInput || !emailInput.value) return;

    try {
      // Primer DELETE → Eliminar email de Supabase
      const response = await api.delete("/dailyweird-delete-email", {
        data: { email: emailInput.value },
      });

      // Segundo POST → Enviar email de confirmación de baja
      const confirmUnsubscribe = await api.post("/dailyweird-send-goodbye", {
        email: emailInput.value,
      });

      setUnsubscribed(response.data);
      setConfirmUnsubscribe(confirmUnsubscribe.data);
    } catch (error) {
      console.error("Error unsubscribing email:", error);
    }
  };

  useEffect(() => {
    if (unsubscribed && confirmUnsubscribe) {
      const timer = setTimeout(() => {
        setUnsubscribed(false);
        setConfirmUnsubscribe(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [unsubscribed, confirmUnsubscribe]);

  return (
    <div className="fixed inset-0 bg-[#131516] backdrop-blur-sm flex justify-center items-center z-[999]">
      <div
        className="bg-[#1e2021] rounded-xl shadow-md p-8 max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Unsubscribe from DailyWeird</h2>
        <p className="mb-4">
          We're sorry to see you go! Please enter your email to unsubscribe.
        </p>
        <form onSubmit={handleUnsubscribe} className="flex flex-col space-y-4">
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
            Unsubscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailModalUnsubscribe;

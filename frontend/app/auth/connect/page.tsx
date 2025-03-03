"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
 const URL = "http://127.0.0.1:8000"
export default function ConnectPage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSendCode = async () => {
    try {
      const res = await fetch(`${URL}/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (res.ok) {
        setStep(2);
      } else {
        const err = await res.json();
        if (Array.isArray(err.detail)) {
          setError(err.detail.map((e:any) => e.msg).join(", "));
        } else {
          setError(err.detail || "Помилка відправки коду");
        }
        
      }
    } catch (err) {
      setError("Сервер недоступний");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await fetch(`${URL}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });

      if (res.ok) {
        router.push("/chats");
      } else {
        const err = await res.json();
        if (Array.isArray(err.detail)) {
          setError(err.detail.map((e:any) => e.msg).join(", "));
        } else {
          setError(err.detail || "Помилка авторизації");
        }
        
      }
    } catch (err) {
      setError("Сервер недоступний");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Підключення до Telegram</h2>
        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Ваш номер телефону +380..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border p-2 mb-2 w-full"
              required
            />
            <button
              onClick={handleSendCode}
              className="bg-blue-500 text-white py-2 px-4 rounded w-full"
            >
              Відправити код
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Введіть код з Telegram"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border p-2 mb-2 w-full"
              required
            />
            <button
              onClick={handleVerifyCode}
              className="bg-green-500 text-white py-2 px-4 rounded w-full"
            >
              Підтвердити код
            </button>
          </>
        )}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}

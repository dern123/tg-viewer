"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
const URL = "http://127.0.0.1:8000"
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        router.push("/auth/connect");
      } else {
        const err = await res.json();
        setError(err.detail || "Помилка авторизації");
      }
    } catch (err) {
      setError("Сервер недоступний");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-semibold mb-4">Логін</h2>
        <input
          type="text"
          placeholder="Ім'я користувача"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-2 w-full"
          required
        />
        {error && <p className="text-red-500 text-sm mb-2">{typeof error === 'string' ? error : JSON.stringify(error)}</p>}
        <button className="bg-blue-500 text-white py-2 px-4 rounded">Увійти</button>
        <button className="bg-blue-500 text-white py-2 px-4 rounded ml-2" onClick={() => router.push("/auth/register")}>Реєстрація</button>
      </form>
    </div>
  );
}

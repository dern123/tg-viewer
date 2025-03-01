"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Chat = {
  id: string;
  title: string;
};

export default function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/chats")
      .then((res) => res.json())
      .then((data: Chat[]) => setChats(data))
      .catch((error) => console.error("Помилка отримання чатів:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Сторінка чатів</h1>

        {chats.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {chats.map((chat) => (
              <div key={chat.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col">
                <h2 className="text-lg font-semibold text-gray-900">{chat.title}</h2>
                <button
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  onClick={() => router.push(`/chat/${chat.id}`)}
                >
                  Перейти до чату
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Немає доступних чатів</p>
        )}
      </div>
    </div>
  );
}

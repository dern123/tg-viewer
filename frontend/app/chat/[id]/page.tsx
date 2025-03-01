"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Message = {
  id: number;
  text: string;
  sender: string;
  timestamp: string;
  isMine: boolean; // true - якщо це наше повідомлення
};

export default function ChatPage() {
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (id) {
      fetch(`http://127.0.0.1:8000/messages/${id}`)
        .then((res) => res.json())
        .then((data: Message[]) => setMessages(data))
        .catch((error) => console.error("Помилка отримання повідомлень:", error));
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-[#dcf8c6] flex flex-col p-4">
      <div className="max-w-2xl mx-auto w-full bg-[#e5ddd5] shadow-lg rounded-lg p-4 h-[80vh] overflow-y-auto">
        <h1 className="text-lg font-semibold text-gray-900 mb-4">Чат {id}</h1>

        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`relative p-3 rounded-2xl max-w-[70%] shadow ${
                  msg.isMine ? "bg-[#dcf8c6] text-gray-900" : "bg-white text-gray-900"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className="absolute bottom-1 right-2 text-xs text-gray-500">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from telethon import TelegramClient
import os
from dotenv import load_dotenv

# Завантаження змінних середовища
load_dotenv()

app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Telegram API Config
API_ID = os.getenv("TELEGRAM_API_ID")
API_HASH = os.getenv("TELEGRAM_API_HASH")

client = TelegramClient("session_name", API_ID, API_HASH)

@app.on_event("startup")
async def startup_event():
    if not client.is_connected():
        await client.start()

@app.get("/")
async def root():
    return {"message": "Telegram Viewer API"}

@app.get("/chats")
async def get_chats():
    try:
        async with client:
            chats = await client.get_dialogs()
            return [{"id": chat.id, "title": chat.title} for chat in chats]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/messages/{chat_id}")
async def get_messages(chat_id: int):
    try:
        async with client:
            if not client.is_connected():
                await client.connect()

            if not await client.is_user_authorized():
                raise HTTPException(status_code=401, detail="Користувач не авторизований у Telegram")

            # Отримуємо ID поточного користувача (нашого)
            me = await client.get_me()
            session_id = me.id  # Тепер session_id буде нашим user_id

            # Отримуємо повідомлення
            messages = await client.get_messages(int(chat_id), limit=1000000)

            return [
                {
                    "id": msg.id,
                    "text": msg.text or "",
                    "sender": msg.sender_id,
                    "timestamp": msg.date.strftime("%H:%M") if msg.date else "",
                    "isMine": msg.sender_id == session_id,  # Перевіряємо, чи це наше повідомлення
                }
                for msg in messages
            ]
    except Exception as e:
        print(f"❌ Помилка отримання повідомлень: {e}")  # Лог у консоль
        raise HTTPException(status_code=500, detail=str(e))

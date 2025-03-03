# telegram_client.py
from telethon import TelegramClient
import os
from dotenv import load_dotenv

# Завантаження змінних середовища
load_dotenv()

API_ID = os.getenv("TELEGRAM_API_ID")
API_HASH = os.getenv("TELEGRAM_API_HASH")

# 🟢 Створюємо єдиний екземпляр TelegramClient
client = TelegramClient("session_name", API_ID, API_HASH)

from telethon.tl.types import Dialog
from telethon.tl.patched import Message
from telethon.errors import SessionPasswordNeededError
from telegram_client import client  # 🟢 Імпортуємо єдиний client

# Підключення до клієнта
async def connect():
    if not client.is_connected():
        await client.connect()

    if not await client.is_user_authorized():
        print("❌ Користувач не авторизований.")
        raise Exception("Користувач не авторизований у Telegram")

# Відправка коду авторизації
async def send_code(phone: str):
    await connect()
    return await client.send_code_request(phone)

# Верифікація коду
async def verify_code(phone: str, code: str):
    await connect()
    try:
        await client.sign_in(phone, code)
    except SessionPasswordNeededError:
        raise Exception("Потрібен пароль від двофакторної авторизації")

# Отримання списку чатів
async def get_chats():
    await connect()
    chats = await client.get_dialogs()
    return [{"id": chat.id, "title": chat.title} for chat in chats]

# Отримання повідомлень у чаті
async def get_messages(chat_id: int):
    await connect()
    me = await client.get_me()
    messages = await client.get_messages(chat_id, limit=100)
    return [
        {
            "id": msg.id,
            "text": msg.text or "",
            "sender": msg.sender_id,
            "timestamp": msg.date.strftime("%H:%M") if msg.date else "",
            "isMine": msg.sender_id == me.id,
        }
        for msg in messages
    ]

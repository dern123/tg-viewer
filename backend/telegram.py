from fastapi import APIRouter, HTTPException
from telegram_client import client  # 🟢 Імпортуємо єдиний client
from telegram_service import get_chats, get_messages
from pydantic import BaseModel, field_validator

router = APIRouter()

class PhoneRequest(BaseModel):
    phone: str

class VerifyRequest(PhoneRequest):
    code: str

@router.post("/connect")
async def connect_telegram(data: PhoneRequest):
    await client.connect()
    if not await client.is_user_authorized():
        try:
            await client.send_code_request(data.phone)
            return {"msg": "Код відправлено"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    return {"msg": "Вже підключено"}

@router.post("/verify")
async def verify_telegram(data: VerifyRequest):
    print("Отриманий номер телефону:", data.phone)
    print("Отриманий код:", data.code)
    try:
        await client.sign_in(data.phone, data.code)
        return {"msg": "Успішно підключено"}
    except Exception as e:
        print("Помилка:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chats")
async def fetch_chats():
    try:
        chats = await get_chats()
        return chats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/messages/{chat_id}")
async def fetch_messages(chat_id: int):
    try:
        messages = await get_messages(chat_id)
        return messages
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


from database import users_db

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, field_validator
from passlib.context import CryptContext
from fastapi_jwt import JwtAccessBearer

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Використовуємо fastapi-jwt для роботи з токенами
jwt = JwtAccessBearer(secret_key="super-secret")


# Модель користувача
class User(BaseModel):
    username: str
    password: str

    @field_validator("username")
    def validate_username(cls, v):
        if len(v) < 3:
            raise ValueError("Ім'я користувача повинно бути не менше 3 символів")
        return v

    @field_validator("password")
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError("Пароль повинен бути не менше 6 символів")
        return v

class UserRegister(User):
    email: str

    @field_validator("email")
    def validate_email(cls, v):
        if "@" not in v or "." not in v:
            raise ValueError("Некоректний email")
        return v

# Реєстрація користувача
@router.post("/register")
async def register(user: UserRegister):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="Користувач вже існує")
    hashed_password = pwd_context.hash(user.password)
    users_db[user.username] = {"email": user.email, "password": hashed_password}
    return {"msg": "Реєстрація успішна"}

# Логін користувача
@router.post("/login")
async def login(user: User):
    if user.username not in users_db or not pwd_context.verify(user.password, users_db[user.username]["password"]):
        raise HTTPException(status_code=401, detail="Невірний логін або пароль")
    
    # 🟢 Створення токена
    access_token = jwt.create_access_token(subject={"username": user.username})
    return {"access_token": access_token}

# Захищений маршрут
@router.get("/protected")
async def protected(Authorize: JwtAccessBearer = Depends()):
    Authorize.jwt_required()
    user = Authorize.get_jwt_subject()
    return {"user": user}

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str
    picture: Optional[str] = None
    google_id: str

class QuizResult(BaseModel):
    vata_score: int
    pitta_score: int
    kapha_score: int
    dominant_dosha: str
    secondary_dosha: Optional[str] = None
    taken_at: datetime = Field(default_factory=datetime.utcnow)

class UserInDB(UserBase):
    id: Optional[str] = Field(None, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    quiz_history: List[QuizResult] = []

class TokenAuthRequest(BaseModel):
    token: str

class QuizSaveRequest(BaseModel):
    user_email: EmailStr
    vata: int
    pitta: int
    kapha: int
    dominant: str
    secondary: Optional[str] = None

from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
import uuid

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    session_id: str
    message: str
    message_type: str = "user"  # "user", "assistant", "system"
    language: str = "hi"
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    message: str
    message_type: str = "assistant"
    language: str = "hi"
    confidence: Optional[float] = None
    category: Optional[str] = None  # "farming_advice", "market_advice", "scheme_info"
    actionable_steps: Optional[List[str]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatRequest(BaseModel):
    message: str
    session_id: str
    user_id: Optional[str] = None
    language: str = "hi"
    context: Optional[Dict] = None  # Additional context like crop type, location, etc.

class VoiceRequest(BaseModel):
    audio_base64: str
    language: str = "hi-IN"
    user_id: Optional[str] = None

class VoiceResponse(BaseModel):
    transcript: str
    confidence: Optional[float] = None
    language: str = "hi-IN"

class TTSRequest(BaseModel):
    text: str
    language: str = "hi-IN"
    voice_name: Optional[str] = None

class TTSResponse(BaseModel):
    audio_base64: str
    language: str = "hi-IN"
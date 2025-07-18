from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
import uuid

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: Optional[str] = None
    language: str = "hi"  # Default to Hindi
    location: Optional[str] = None
    farm_size: Optional[float] = None
    primary_crops: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    language: str = "hi"
    location: Optional[str] = None
    farm_size: Optional[float] = None
    primary_crops: List[str] = []

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    language: Optional[str] = None
    location: Optional[str] = None
    farm_size: Optional[float] = None
    primary_crops: Optional[List[str]] = None
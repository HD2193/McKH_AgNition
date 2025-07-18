from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date
import uuid

class Task(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    title_hindi: Optional[str] = None
    title_local: Optional[str] = None  # For regional languages
    description: Optional[str] = None
    description_hindi: Optional[str] = None
    description_local: Optional[str] = None
    category: str  # "irrigation", "fertilization", "disease_prevention", etc.
    priority: str = "medium"  # "low", "medium", "high"
    crop_type: Optional[str] = None
    due_date: date
    due_time: Optional[str] = None
    completed: bool = False
    completed_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TaskCreate(BaseModel):
    user_id: str
    title: str
    title_hindi: Optional[str] = None
    title_local: Optional[str] = None
    description: Optional[str] = None
    description_hindi: Optional[str] = None
    description_local: Optional[str] = None
    category: str
    priority: str = "medium"
    crop_type: Optional[str] = None
    due_date: date
    due_time: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    title_hindi: Optional[str] = None
    title_local: Optional[str] = None
    description: Optional[str] = None
    description_hindi: Optional[str] = None
    description_local: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    crop_type: Optional[str] = None
    due_date: Optional[date] = None
    due_time: Optional[str] = None
    completed: Optional[bool] = None
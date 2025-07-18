from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
import uuid

class Treatment(BaseModel):
    title: str
    title_hindi: Optional[str] = None
    title_local: Optional[str] = None
    description: str
    description_hindi: Optional[str] = None
    description_local: Optional[str] = None
    icon: str
    priority: str = "medium"

class DiseaseAnalysis(BaseModel):
    name: str
    name_hindi: Optional[str] = None
    name_local: Optional[str] = None
    confidence: float
    symptoms: str
    symptoms_hindi: Optional[str] = None
    symptoms_local: Optional[str] = None
    causes: Optional[str] = None
    causes_hindi: Optional[str] = None
    causes_local: Optional[str] = None
    prevention: Optional[str] = None
    prevention_hindi: Optional[str] = None
    prevention_local: Optional[str] = None

class CropAnalysisResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    image_url: Optional[str] = None
    disease: DiseaseAnalysis
    treatments: List[Treatment]
    confidence: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CropAnalysisRequest(BaseModel):
    image_base64: str
    user_id: Optional[str] = None
    language: str = "hi"
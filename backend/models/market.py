from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime, date
import uuid

class MarketPrice(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    crop_name: str
    crop_name_hindi: Optional[str] = None
    crop_name_local: Optional[str] = None
    region: str
    district: Optional[str] = None
    market_name: str
    market_name_hindi: Optional[str] = None
    min_price: float
    max_price: float
    avg_price: float
    price_date: date
    unit: str = "kg"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PriceTrend(BaseModel):
    date: date
    price: float
    volume: Optional[int] = None

class MarketAdvice(BaseModel):
    action: str  # "sell", "wait", "hold"
    reason: str
    reason_hindi: Optional[str] = None
    reason_local: Optional[str] = None
    confidence: float
    expected_change: Optional[str] = None  # "up", "down", "stable"
    timeframe: Optional[str] = None  # "1-2 days", "1 week", etc.

class MarketAnalysis(BaseModel):
    crop_name: str
    current_price: MarketPrice
    price_trends: List[PriceTrend]
    advice: MarketAdvice
    nearby_markets: List[Dict]
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class MarketPriceRequest(BaseModel):
    crop_name: str
    region: str
    district: Optional[str] = None
    language: str = "hi"
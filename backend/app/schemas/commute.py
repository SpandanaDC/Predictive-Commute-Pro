from pydantic import BaseModel
from typing import Optional


class CommuteRequest(BaseModel):
    origin: str
    destination: str
    departure_time: str  # ISO 8601 format, e.g. "2026-04-15T08:30:00"
    mode: Optional[str] = "auto"  # bus | metro | rail | auto


class CommuteResponse(BaseModel):
    origin: str
    destination: str
    estimated_duration_min: float
    predicted_delay_min: float
    recommended_mode: str
    confidence_score: float
    tips: list[str]

from pydantic import BaseModel
from typing import Optional


class PredictionRequest(BaseModel):
    route_id: str
    departure_time: str       # ISO 8601
    day_of_week: Optional[int] = None   # 0=Mon … 6=Sun
    weather_condition: Optional[str] = "clear"  # clear | rain | fog | snow


class PredictionResponse(BaseModel):
    route_id: str
    predicted_delay_min: float
    confidence: float
    factors: list[str]

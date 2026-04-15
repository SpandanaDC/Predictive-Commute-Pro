import random
from app.schemas.prediction import PredictionRequest, PredictionResponse


async def predict_delay(payload: PredictionRequest) -> PredictionResponse:
    """
    Stub prediction service.
    Replace with a trained scikit-learn / ONNX model for real delay prediction.
    """
    simulated_delay = round(random.uniform(0.0, 18.0), 2)
    confidence = round(random.uniform(0.70, 0.99), 2)

    factors = []
    if payload.weather_condition and payload.weather_condition != "clear":
        factors.append(f"Weather: {payload.weather_condition}")
    if payload.day_of_week in (0, 4):   # Monday / Friday
        factors.append("High-traffic weekday")
    if not factors:
        factors.append("Typical traffic conditions")

    return PredictionResponse(
        route_id=payload.route_id,
        predicted_delay_min=simulated_delay,
        confidence=confidence,
        factors=factors,
    )

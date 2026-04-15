import random

from fastapi import APIRouter, Query
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services.prediction_service import predict_delay

router = APIRouter()


@router.post("/delay", response_model=PredictionResponse)
async def predict_commute_delay(payload: PredictionRequest):
    """Predict delay for a given route and time."""
    return await predict_delay(payload)


@router.get("/health")
async def prediction_health():
    return {"model_status": "ready", "engine": "scikit-learn"}


@router.get("/recommend")
async def recommend_commute(
    destination: str = Query(..., description="The destination for commute recommendation"),
):
    """
    Simulate a traffic score for the given destination.
    Returns {"decision": "GO"} if traffic score < 0.7, else {"decision": "WAIT"}.
    """
    traffic_score: float = round(random.uniform(0.0, 1.0), 4)
    decision = "GO" if traffic_score < 0.7 else "WAIT"

    return {
        "destination": destination,
        "traffic_score": traffic_score,
        "decision": decision,
    }

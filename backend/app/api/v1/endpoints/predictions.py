import math
import random
from typing import Optional

from fastapi import APIRouter, Query

router = APIRouter()


def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great-circle distance in meters between two GPS coordinates
    using the Haversine formula.
    """
    R = 6_371_000  # Earth radius in metres
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


@router.get("/recommend")
async def recommend_commute(
    # Legacy string-based call (kept for backward compat)
    destination: Optional[str] = Query(None, description="Destination name"),
    # GPS-based call
    user_lat: Optional[float] = Query(None, description="User's current latitude"),
    user_lng: Optional[float] = Query(None, description="User's current longitude"),
    dest_lat: Optional[float] = Query(None, description="Destination latitude"),
    dest_lng: Optional[float] = Query(None, description="Destination longitude"),
    # Alarm threshold in metres
    alarm_threshold_m: Optional[float] = Query(None, description="Alarm radius in metres (e.g. 500 or 1200)"),
):
    """
    Returns a GO/WAIT traffic decision.
    When lat/lng coords are provided, also returns real Haversine distance
    and whether the alarm threshold has been reached.
    """
    traffic_score: float = round(random.uniform(0.0, 1.0), 4)
    decision = "GO" if traffic_score < 0.7 else "WAIT"

    response: dict = {
        "destination": destination or "Unknown",
        "traffic_score": traffic_score,
        "decision": decision,
    }

    # If all four GPS coords are provided, calculate real distance
    has_coords = all(x is not None for x in [user_lat, user_lng, dest_lat, dest_lng])
    if has_coords:
        distance_m = haversine(user_lat, user_lng, dest_lat, dest_lng)  # type: ignore[arg-type]
        response["distance_meters"] = round(distance_m, 2)
        response["distance_km"] = round(distance_m / 1000, 3)

        if alarm_threshold_m is not None:
            response["alarm_triggered"] = distance_m <= alarm_threshold_m
            response["alarm_threshold_m"] = alarm_threshold_m
        else:
            response["alarm_triggered"] = False

    return response


@router.get("/health")
async def prediction_health():
    return {"model_status": "ready", "engine": "scikit-learn"}

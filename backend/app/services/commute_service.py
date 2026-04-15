from app.schemas.commute import CommuteRequest, CommuteResponse


async def get_commute_summary(payload: CommuteRequest) -> CommuteResponse:
    """
    Stub commute summary service.
    Replace with real ML model / transit API integration.
    """
    return CommuteResponse(
        origin=payload.origin,
        destination=payload.destination,
        estimated_duration_min=32.5,
        predicted_delay_min=4.2,
        recommended_mode="metro",
        confidence_score=0.87,
        tips=[
            "Peak hour detected — consider leaving 15 min earlier.",
            "Metro Line A is currently running on schedule.",
        ],
    )

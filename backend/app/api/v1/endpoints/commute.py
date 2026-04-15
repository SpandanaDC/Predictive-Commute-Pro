from fastapi import APIRouter
from app.schemas.commute import CommuteRequest, CommuteResponse
from app.services.commute_service import get_commute_summary

router = APIRouter()


@router.post("/summary", response_model=CommuteResponse)
async def commute_summary(payload: CommuteRequest):
    """Return a predicted commute summary for the given origin/destination."""
    return await get_commute_summary(payload)


@router.get("/status")
async def commute_status():
    return {"status": "Commute endpoint live"}

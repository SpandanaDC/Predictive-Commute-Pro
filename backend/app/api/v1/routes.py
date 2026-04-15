from fastapi import APIRouter
from app.api.v1.endpoints import commute, routes as route_endpoints, predictions

router = APIRouter()

router.include_router(commute.router, prefix="/commute", tags=["Commute"])
router.include_router(route_endpoints.router, prefix="/routes", tags=["Routes"])
router.include_router(predictions.router, prefix="/predictions", tags=["Predictions"])

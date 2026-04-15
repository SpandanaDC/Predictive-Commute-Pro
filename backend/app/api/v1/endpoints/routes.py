from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_routes():
    """Return a list of available transit routes (stub)."""
    return {
        "routes": [
            {"id": "R1", "name": "Downtown Express", "mode": "bus"},
            {"id": "R2", "name": "Metro Line A", "mode": "metro"},
            {"id": "R3", "name": "Suburban Rail", "mode": "rail"},
        ]
    }


@router.get("/{route_id}")
async def get_route(route_id: str):
    """Return details for a specific route."""
    return {"route_id": route_id, "status": "stub — implement with real data"}

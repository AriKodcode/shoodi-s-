from fastapi import APIRouter
from app.models.request_model import CandidateRequest
from app.serivces.meals_service import MealsService

router = APIRouter()

service = MealsService()


@router.post("/candidates")
def get_candidates(request: CandidateRequest):
    meals = MealsService.get_full_meals(request)

    return {
        "meals": meals
    }
from pydantic import BaseModel
from enum import Enum


class Type(str,Enum):
    MEAT= 'meat'
    DAIRY= 'dairy'
    FUR= 'vegan'

class FloatScore(float,Enum):
    ZERO = 0
    HALF = 0.5
    FULL = 1.0

class WeightsChoice(BaseModel):
    lightness: FloatScore
    health: FloatScore
    complexity: FloatScore

class ClientRequest(BaseModel):
    type: Type
    weights: WeightsChoice

class ResponsePart(BaseModel):
    id: int
    score : float
    light_score : float
    health_score: float
    complex_score: float
    popularity_score: float
    # matched_ingredients: list[str|None] |None

class DBResponse(BaseModel):
    main: ResponsePart
    side: ResponsePart
    salad: ResponsePart

class MealsDB(BaseModel):
    meals: list[DBResponse]
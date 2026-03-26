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
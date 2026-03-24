from pydantic import BaseModel, Field
from typing import List, Optional, Literal


class Weights(BaseModel):
    lightness: float = Field(0, ge=0, le=1)
    health: float = Field(0, ge=0, le=1)
    complexity: float = Field(0, ge=0, le=1)


class CandidateRequest(BaseModel):
    type: Literal["meat", "dairy", "vegan"]
    weights: Weights

    include: List[str] = []
    exclude: List[str] = []
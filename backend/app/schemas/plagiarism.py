from pydantic import BaseModel
from typing import Literal


class SimilarityMatch(BaseModel):
    id: int
    document: str
    chunk: int | None = 0
    similarity: int
    matchedText: str | None = ""
    context: str | None = ""

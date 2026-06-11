from pydantic import BaseModel


class SearchResult(BaseModel):
    id: int
    document: str
    chunk: int | None = 0
    similarity: int
    text: str | None = ""
    explanation: str | None = ""


class RecentCheck(BaseModel):
    id: int
    document: str
    similarity: int
    date: str


class ChartData(BaseModel):
    id: int
    name: str
    checks: int
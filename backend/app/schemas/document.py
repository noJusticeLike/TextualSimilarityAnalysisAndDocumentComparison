from datetime import date
from pydantic import BaseModel
from typing import Literal


class LibraryDocument(BaseModel):
    id: int
    filename: str
    uploadDate: str
    pages: int
    chunks: int
    status: Literal["processed"]


class DashboardStats(BaseModel):
    totalDocuments: int
    totalChunks: int | None = 0
    recentSearches: int
    avgSimilarity: int


class RecentDocument(BaseModel):
    id: int
    title: str
    uploadDate: str
    status: Literal["processed"]


class Chunk(BaseModel):
    id: int
    text: str
    startPage: int
    endPage: int
    embeddings: int


class DocumentDetail(BaseModel):
    id: int
    filename: str
    uploadDate: str
    totalPages: int | None = 0
    totalChunks: int | None = 0
    status: Literal["processed"] 
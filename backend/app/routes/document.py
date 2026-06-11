from fastapi import APIRouter
from typing import List
from fastapi import HTTPException

from app.schemas.document import LibraryDocument, DashboardStats, RecentDocument
from app.services.document_service import (
    fetch_documents,
    fetch_document_by_id,
    fetch_dashboard_stats,
    fetch_recent_documents,
)

router = APIRouter()


@router.get("/documents", response_model=List[LibraryDocument])
def get_documents():
    return fetch_documents()


@router.get("/documents/stats", response_model=DashboardStats)
def get_dashboard_stats():
    return fetch_dashboard_stats()


@router.get("/documents/recent", response_model=list[RecentDocument])
def get_recent_documents():
    return fetch_recent_documents()


@router.get("/documents/{document_id}")
def get_document(document_id: int):
    document = fetch_document_by_id(document_id)

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    return document
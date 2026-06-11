from fastapi import APIRouter, HTTPException

from app.services.plagiarism_service import (
    fetch_similarity_matches,
    fetch_document_detail,
    fetch_document_chunks,
)

router = APIRouter(prefix="/plagiarism", tags=["Plagiarism"])


@router.get("/{document_id}/matches")
def get_similarity_matches(document_id: int):
    return fetch_similarity_matches(document_id)


@router.get("/{document_id}")
def get_document_detail(document_id: int):
    result = fetch_document_detail(document_id)

    if not result:
        raise HTTPException(status_code=404, detail="Document not found")

    return result


@router.get("/{document_id}/chunks")
def get_document_chunks(document_id: int):
    return fetch_document_chunks(document_id)
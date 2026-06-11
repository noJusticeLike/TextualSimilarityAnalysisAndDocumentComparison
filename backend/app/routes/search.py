from fastapi import APIRouter, Query
from typing import List

from app.schemas.search import SearchResult
from app.services.search_service import (
    fetch_recent_checks,
    fetch_search_results,
    fetch_chart_data,
    execute_semantic_search,
)

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("/recent")
def get_recent_checks():
    return fetch_recent_checks()


@router.get("/results")
def get_search_results():
    return fetch_search_results()


@router.get("/chart")
def get_chart_data():
    return fetch_chart_data()

@router.get("/execute", response_model=List[SearchResult])
def get_semantic_search(query: str = Query(..., description="Текстовий запит для пошуку")):
    return execute_semantic_search(query)
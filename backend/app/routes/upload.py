from fastapi import APIRouter, UploadFile, File
from app.services.upload_service import process_upload

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    result = await process_upload(file)
    return result
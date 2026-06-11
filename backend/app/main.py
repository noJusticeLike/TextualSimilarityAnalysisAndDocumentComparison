from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.document import router as documents_router
from app.routes.search import router as search_router
from app.routes.plagiarism import router as plagiarism_router
from app.routes.upload import router as upload_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend (Vite)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "API running"}


# =====================
# ROUTES
# =====================

app.include_router(documents_router)
app.include_router(search_router)
app.include_router(plagiarism_router)
app.include_router(upload_router)
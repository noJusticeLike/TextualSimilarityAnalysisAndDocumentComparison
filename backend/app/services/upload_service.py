import os
from search.search import compare_pdf


TEMP_DIR = "temp"


def search_similar(pdf_path: str) -> dict:
    """
    Runs plagiarism detection on a PDF file.
    """

    score, results = compare_pdf(pdf_path)

    if not results:
        return {
            "plagiarismScore": float(score),
            "matches": []
        }

    results = sorted(results, key=lambda x: x.get("similarity", 0), reverse=True)

    return {
        "plagiarismScore": float(score),
        "matches": [
            {
                "document_id": r.get("document_id"),
                "similarity": float(r.get("similarity", 0)),
                "query_chunk": r.get("query_chunk", ""),
                "matched_chunk": r.get("matched_chunk", ""),
            }
            for r in results
        ]
    }


async def process_upload(file):
    """
    Handles upload + calls plagiarism detection pipeline.
    """

    os.makedirs(TEMP_DIR, exist_ok=True)

    # use original filename directly
    path = os.path.join(TEMP_DIR, file.filename)

    content = await file.read()
    with open(path, "wb") as f:
        f.write(content)

    result = search_similar(path)

    return {
        "filename": file.filename,
        "plagiarismScore": result.get("plagiarismScore"),
        "matches": result.get("matches", [])
    }
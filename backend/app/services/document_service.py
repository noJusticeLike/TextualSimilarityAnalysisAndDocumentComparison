from app.core.db import get_connection


def fetch_documents(limit=None):
    conn = get_connection()
    cur = conn.cursor()

    try:
        query = """
            SELECT
                id,
                title,
                created_at,
                total_pages,
                total_chunks,
                status
            FROM documents
            ORDER BY created_at DESC
        """

        if limit:
            query += " LIMIT %s"
            cur.execute(query, (limit,))
        else:
            cur.execute(query)

        rows = cur.fetchall()

        return [
            {
                "id": row[0],
                "filename": row[1],
                "title": row[1],  # useful for dashboard cards
                "uploadDate": row[2].date().isoformat() if row[2] else None,
                "pages": row[3],
                "chunks": row[4],
                "status": row[5],
            }
            for row in rows
        ]

    finally:
        cur.close()
        conn.close()


def fetch_document_by_id(document_id: int):
    conn = get_connection()
    cur = conn.cursor()

    try:
        # document info
        cur.execute("""
            SELECT
                id,
                title,
                created_at,
                total_pages,
                total_chunks,
                status
            FROM documents
            WHERE id = %s
        """, (document_id,))

        doc = cur.fetchone()

        if not doc:
            return None

        # chunks
        cur.execute("""
            SELECT
                c.id,
                c.chunk_index,
                c.text,
                c.start_page,
                c.end_page,
                COALESCE(
                    vector_dims(e.embedding),
                    0
                ) AS embeddings
            FROM chunks c
            LEFT JOIN embeddings e
                ON e.chunk_id = c.id
            WHERE c.document_id = %s
            ORDER BY c.id
        """, (document_id,))

        chunk_rows = cur.fetchall()

        chunks = [
            {
                "id": row[0],
                "chunk_index": row[1],
                "text": row[2],
                "startPage": row[3] if row[3] else 0,
                "endPage": row[4] if row[4] else 0,
                "embeddings": row[5] if row[5] else 0,
            }
            for row in chunk_rows
        ]

        return {
            "id": doc[0],
            "filename": doc[1],
            "uploadDate": doc[2].date().isoformat() if doc[2] else None,
            "totalPages": doc[3] if doc[3] else 0,
            "totalChunks": doc[4] if doc[4] else 0,
            "status": doc[5],
            "chunks": chunks,
            "extractedText": "\n\n".join(
                [chunk["text"] for chunk in chunks]
            )
        }

    finally:
        cur.close()
        conn.close()


def fetch_recent_documents():
    return fetch_documents(limit=5)


def fetch_dashboard_stats():
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("SELECT COUNT(*) FROM documents")
        total_documents = cur.fetchone()[0]

        cur.execute("SELECT COALESCE(SUM(total_chunks), 0) FROM documents")
        total_chunks = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM search_queries")
        recent_searches = cur.fetchone()[0]

        cur.execute("""
            SELECT COALESCE(
                ROUND(AVG(score) * 100),
                0
            )
            FROM search_results
        """)
        avg_similarity = cur.fetchone()[0]

        return {
            "totalDocuments": total_documents,
            "totalChunks": total_chunks,
            "recentSearches": recent_searches,
            "avgSimilarity": avg_similarity,
        }

    finally:
        cur.close()
        conn.close()
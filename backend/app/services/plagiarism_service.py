from app.core.db import get_connection


def fetch_similarity_matches(document_id: int, limit: int = 10):
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT
                sr.id,
                d.title,
                sr.matched_chunk_id,
                ROUND(sr.score * 100),
                c.text,
                COALESCE(sr.metadata::text, 'No context available')
            FROM search_results sr
            JOIN documents d
                ON sr.matched_document_id = d.id
            LEFT JOIN chunks c
                ON sr.matched_chunk_id = c.id
            WHERE sr.matched_document_id = %s
            ORDER BY sr.score DESC
            LIMIT %s
        """, (document_id, limit))

        rows = cur.fetchall()

        return [
            {
                "id": row[0],
                "document": row[1],
                "chunk": row[2] if row[2] else 0,
                "similarity": int(row[3]) if row[3] is not None else 0,
                "matchedText": row[4] if row[4] else "",
                "context": row[5],
            }
            for row in rows
        ]

    finally:
        cur.close()
        conn.close()


def fetch_document_detail(document_id: int):
    conn = get_connection()
    cur = conn.cursor()

    try:
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

        row = cur.fetchone()

        if not row:
            return None

        return {
            "id": row[0],
            "filename": row[1],
            "uploadDate": row[2].date().isoformat() if row[2] else None,
            "totalPages": row[3],
            "totalChunks": row[4],
            "status": row[5],
        }

    finally:
        cur.close()
        conn.close()


def fetch_document_chunks(document_id: int):
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT
                id,
                text,
                chunk_index,
                chunk_index,
                char_count
            FROM chunks
            WHERE document_id = %s
            ORDER BY chunk_index
        """, (document_id,))

        rows = cur.fetchall()

        return [
            {
                "id": row[0],
                "text": row[1],
                "startPage": row[2],
                "endPage": row[3],
                "embeddings": row[4],
            }
            for row in rows
        ]

    finally:
        cur.close()
        conn.close()
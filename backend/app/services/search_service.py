from app.core.db import get_connection
from app.core.embeddings import get_embeddings

def execute_semantic_search(query_text: str, limit: int = 5):
    query_vector = get_embeddings([query_text])[0]
    
    vector_str = "[" + ",".join(map(str, query_vector.tolist())) + "]"
    
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("""
            SELECT
                c.id AS chunk_id,
                d.title AS document_title,
                c.chunk_index,
                ROUND((1 - (e.embedding <=> %s::vector)) * 100) AS similarity,
                c.text,
                'Контекстуальний збіг знайдено у файлі ' || d.title || ' (Чанк №' || c.chunk_index || ')' AS explanation
            FROM embeddings e
            JOIN chunks c ON e.chunk_id = c.id
            JOIN documents d ON e.document_id = d.id
            ORDER BY e.embedding <=> %s::vector ASC
            LIMIT %s;
        """, (vector_str, vector_str, limit))
        
        rows = cur.fetchall()

        return [
            {
                "id": row[0],
                "document": row[1],
                "chunk": row[2] if row[2] is not None else 0,
                "similarity": int(row[3]) if row[3] is not None else 0,
                "text": row[4] if row[4] else "",
                "explanation": row[5],
            }
            for row in rows
        ]
        
    finally:
        cur.close()
        conn.close()

def fetch_search_rows(limit=None):
    conn = get_connection()
    cur = conn.cursor()

    try:
        query = """
            SELECT
                sq.id AS search_id,
                sq.title AS document,
                ROUND(AVG(sr.score) * 100) AS similarity,
                sq.created_at
            FROM search_queries sq
            LEFT JOIN search_results sr
                ON sr.query_id = sq.id
            GROUP BY
                sq.id,
                sq.title,
                sq.created_at
            ORDER BY sq.created_at DESC
        """

        if limit:
            query += " LIMIT %s"
            cur.execute(query, (limit,))
        else:
            cur.execute(query)

        return cur.fetchall()

    finally:
        cur.close()
        conn.close()


def fetch_recent_checks():
    rows = fetch_search_rows(limit=5)

    return [
        {
            "id": row[0],
            "document": row[1],
            "similarity": int(row[2]) if row[2] is not None else 0,
            "date": row[3].date().isoformat() if row[3] else None,
        }
        for row in rows
    ]


def fetch_search_results():
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT
                sr.id,
                sq.title AS document,
                sr.matched_chunk_id,
                ROUND(sr.score * 100) AS similarity,
                c.text,
                COALESCE(
                    sr.metadata::text,
                    'Semantic similarity match found'
                ) AS explanation
            FROM search_results sr
            JOIN search_queries sq
                ON sr.query_id = sq.id
            LEFT JOIN chunks c
                ON sr.matched_chunk_id = c.id
            ORDER BY sr.id DESC
            LIMIT 20
        """)

        rows = cur.fetchall()

        return [
            {
                "id": row[0],
                "document": row[1],
                "chunk": row[2] if row[2] is not None else 0,
                "similarity": int(row[3]) if row[3] is not None else 0,
                "text": row[4] if row[4] else "",
                "explanation": row[5],
            }
            for row in rows
        ]

    finally:
        cur.close()
        conn.close()


def fetch_chart_data():
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT
                TO_CHAR(created_at, 'Dy') AS day_name,
                COUNT(*) AS checks_count
            FROM search_queries
            WHERE created_at >= NOW() - INTERVAL '7 days'
            GROUP BY
                DATE(created_at),
                TO_CHAR(created_at, 'Dy')
            ORDER BY DATE(created_at)
        """)

        rows = cur.fetchall()

        return [
            {
                "id": i + 1,
                "name": row[0].strip(),
                "checks": row[1],
            }
            for i, row in enumerate(rows)
        ]

    finally:
        cur.close()
        conn.close()
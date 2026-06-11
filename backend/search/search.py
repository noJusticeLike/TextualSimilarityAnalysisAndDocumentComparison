import os
import numpy as np

from app.core.pdf import extract_text_from_pdf, chunk_text
from app.core.embeddings import get_embeddings
from app.core.db import get_connection

from similarity.lexical import ngram_overlap
from similarity.structure import sentence_similarity
from search.score import compute_final_score


# ----------------------------
# VECTOR SEARCH
# ----------------------------
def search_similar_chunks(query_vector, cur, top_k=3, threshold=0.4):
    cur.execute(
        """
        SELECT
            e.document_id,
            e.chunk_id,
            c.text,
            e.embedding <=> %s::vector AS distance
        FROM embeddings e
        JOIN chunks c ON c.id = e.chunk_id
        ORDER BY distance ASC
        LIMIT %s
        """,
        (query_vector.tolist(), top_k)
    )

    results = cur.fetchall()

    return [
        (r[0], r[1], r[2], r[3])
        for r in results
        if r[3] <= threshold
    ]


# ----------------------------
# SAVE SEARCH SESSION
# ----------------------------
def save_search_to_db(conn, title, content, chunk_items, results):
    cur = conn.cursor()

    try:
        # 1. search_queries (ONE per PDF)
        cur.execute(
            """
            INSERT INTO search_queries (
                title,
                content
            )
            VALUES (%s, %s)
            RETURNING id
            """,
            (
                title,
                content
            )
        )

        query_id = cur.fetchone()[0]

        # 2. search_query_chunks
        for idx, chunk in enumerate(chunk_items):
            cur.execute("""
                INSERT INTO search_query_chunks (
                    query_id,
                    chunk_index,
                    text,
                    char_count,
                    embedding,
                    start_page,
                    end_page
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                query_id,
                idx,
                chunk["text"],
                chunk["char_count"],
                chunk["embedding"].tolist(),
                chunk["start_page"],
                chunk["end_page"]
            )
            )

        # 3. search_results
        for rank, item in enumerate(results, start=1):
            cur.execute(
                """
                INSERT INTO search_results (
                    query_id,
                    matched_document_id,
                    matched_chunk_id,
                    score,
                    rank,
                    metadata
                )
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    query_id,
                    item["document_id"],
                    item["matched_chunk_id"],
                    item["similarity"],
                    rank,
                    None
                )
            )

        conn.commit()

    except Exception as e:
        conn.rollback()
        print(f"[DB ERROR] {e}")

    finally:
        cur.close()


# ----------------------------
# MAIN PIPELINE
# ----------------------------
def compare_pdf(pdf_path):
    # 1. extract
    text, pages, total_pages = extract_text_from_pdf(pdf_path)

    # 2. chunk
    chunk_items = chunk_text(pages)
    chunks = [c["text"] for c in chunk_items]

    if not chunks:
        return 0.0, []

    # 3. embeddings
    embeddings = get_embeddings(chunks)

    # attach embeddings to chunks
    for i in range(len(chunk_items)):
        chunk_items[i]["embedding"] = embeddings[i]

    conn = get_connection()
    cur = conn.cursor()

    all_results = []
    scores = []

    try:
        # 4. compare
        for i, query_vector in enumerate(embeddings):

            matches = search_similar_chunks(query_vector, cur)

            if not matches:
                continue

            best = min(matches, key=lambda x: x[3])
            doc_id, chunk_id, db_chunk, distance = best

            embedding_sim = 1 - float(distance)
            query_text = chunks[i]

            lexical = ngram_overlap(query_text, db_chunk)
            structural = sentence_similarity(query_text, db_chunk)

            final = compute_final_score(
                embedding_sim,
                lexical,
                structural
            )

            scores.append(final)

            all_results.append({
                "query_chunk": query_text,
                "document_id": doc_id,
                "matched_chunk_id": chunk_id,
                "matched_chunk": db_chunk,
                "similarity": round(final, 4)
            })

        # 5. SAVE ONCE PER PDF
        if all_results:
            filename = os.path.basename(pdf_path)

            save_search_to_db(
                conn=conn,
                title=filename,
                content=text,   # full PDF text
                chunk_items=chunk_items,
                results=all_results
            )

        # 6. deduplicate
        seen = set()
        unique_results = []

        for r in all_results:
            key = (r["document_id"], r["matched_chunk_id"])
            if key not in seen:
                seen.add(key)
                unique_results.append(r)

        # 7. score
        plagiarism_score = (
            round(float(np.mean(scores)), 4)
            if scores else 0.0
        )

        return plagiarism_score, unique_results

    finally:
        cur.close()
        conn.close()
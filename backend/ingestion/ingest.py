import os
import hashlib

from app.core.pdf import extract_text_from_pdf, process_pdf
from app.core.embeddings import get_embeddings
from app.core.db import get_connection


def generate_hash(text):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def ingest_pdf(pdf_path):
    filename = os.path.basename(pdf_path)

    # 1. extract + structured preprocessing (NOW includes pages)
    pdf_stats, chunks = process_pdf(pdf_path)

    text = "\n".join([c["text"] for c in chunks])
    doc_hash = generate_hash(text)

    conn = get_connection()
    cur = conn.cursor()

    # 2. insert document
    cur.execute("""
        INSERT INTO documents
        (title, content, hash, total_characters, total_pages, total_chunks)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (
        filename,
        text,
        doc_hash,
        pdf_stats["total_characters"],
        pdf_stats["total_pages"],
        pdf_stats["total_chunks"]
    ))

    doc_id = cur.fetchone()[0]

    # 3. embeddings
    chunk_texts = [c["text"] for c in chunks]
    embeddings = get_embeddings(chunk_texts)

    # 4. insert chunks + embeddings (UPDATED)
    for i, (chunk, emb) in enumerate(zip(chunks, embeddings)):
        cur.execute("""
            INSERT INTO chunks (
                document_id,
                chunk_index,
                text,
                char_count,
                start_page,
                end_page
            )
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            doc_id,
            i,
            chunk["text"],
            chunk["char_count"],
            chunk["start_page"],
            chunk["end_page"]
        ))

        chunk_id = cur.fetchone()[0]

        cur.execute("""
            INSERT INTO embeddings (
                document_id,
                chunk_id,
                embedding
            )
            VALUES (%s, %s, %s)
        """, (
            doc_id,
            chunk_id,
            emb.tolist()
        ))

    conn.commit()
    cur.close()
    conn.close()

    print("PDF successfully ingested.")
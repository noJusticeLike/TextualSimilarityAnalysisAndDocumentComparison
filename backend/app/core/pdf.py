import pymupdf


def extract_text_from_pdf(pdf_path):
    doc = pymupdf.open(pdf_path)

    pages = []

    for page_number, page in enumerate(doc, start=1):
        page_text = page.get_text("text").strip()

        pages.append({
            "page_number": page_number,
            "text": page_text
        })

    full_text = "\n".join(
        page["text"] for page in pages
    ).strip()

    return full_text, pages, len(doc)


def chunk_text(pages, chunk_size=500):
    chunks = []

    buffer = []
    start_page = None

    for page in pages:
        page_number = page["page_number"]
        words = page["text"].split()

        if not words:
            continue

        if start_page is None:
            start_page = page_number

        buffer.extend(words)

        while len(buffer) >= chunk_size:
            chunk_words = buffer[:chunk_size]
            buffer = buffer[chunk_size:]

            chunk_text = " ".join(chunk_words)

            chunks.append({
                "text": chunk_text,
                "char_count": len(chunk_text),
                "start_page": start_page,
                "end_page": page_number
            })

            start_page = page_number

    # leftover words
    if buffer:
        chunk_text = " ".join(buffer)

        chunks.append({
            "text": chunk_text,
            "char_count": len(chunk_text),
            "start_page": start_page,
            "end_page": page_number
        })

    return chunks


def get_pdf_stats(text, chunks, total_pages):
    """
    Only numeric / structural metadata
    """
    return {
        "total_characters": len(text),
        "total_pages": total_pages,
        "total_chunks": len(chunks)
    }


def process_pdf(pdf_path, chunk_size=500):
    """
    Main clean pipeline output:
    - stats (numbers only)
    - chunks (for embeddings + DB)
    """

    text, pages, total_pages = extract_text_from_pdf(pdf_path)
    chunks = chunk_text(pages, chunk_size)

    pdf_stats = get_pdf_stats(text, chunks, total_pages)

    return pdf_stats, chunks
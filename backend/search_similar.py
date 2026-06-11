from search.search import compare_pdf
import sys


def main():
    if len(sys.argv) < 2:
        print("Usage: python search_similar.py <pdf_path>")
        return

    pdf_path = sys.argv[1]

    score, results = compare_pdf(pdf_path)

    print(f"\nPlagiarism score: {score:.4f}\n")

    if not results:
        print("No similar content found.")
        return

    # Sort by strongest similarity first
    results = sorted(results, key=lambda x: x["similarity"], reverse=True)

    for item in results:
        print(f"Document ID: {item['document_id']}")
        print(f"Similarity: {item['similarity']:.4f}")
        print(f"Query chunk: {item['query_chunk'][:200]}")
        print(f"Matched chunk: {item['matched_chunk'][:200]}")
        print("-" * 50)


if __name__ == "__main__":
    main()
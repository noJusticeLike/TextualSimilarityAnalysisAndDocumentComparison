import os
import sys
import shutil

from ingestion.ingest import ingest_pdf


PROCESSED_DIR = os.path.join("example_pdfs", "processed")


def move_to_processed(file_path):
    filename = os.path.basename(file_path)
    destination = os.path.join(PROCESSED_DIR, filename)

    # if file already exists in processed, rename instead of overwriting
    if os.path.exists(destination):
        base, ext = os.path.splitext(filename)
        counter = 1

        while os.path.exists(destination):
            destination = os.path.join(PROCESSED_DIR, f"{base}_{counter}{ext}")
            counter += 1

    shutil.move(file_path, destination)


def main():
    path = sys.argv[1]

    # only PDF files from folder root (NOT processed folder)
    if os.path.isdir(path):
        files = [
            os.path.join(path, f)
            for f in os.listdir(path)
            if f.endswith(".pdf")
            and os.path.isfile(os.path.join(path, f))
        ]
    else:
        files = [path]

    for pdf in files:
        # skip already processed folder if someone passes root
        if "processed" in pdf:
            continue

        print(f"\n[INGEST] {pdf}")

        try:
            ingest_pdf(pdf)
            move_to_processed(pdf)
            print(f"[MOVED] → processed/{os.path.basename(pdf)}")

        except Exception as e:
            print(f"[ERROR] {pdf}: {e}")


if __name__ == "__main__":
    main()
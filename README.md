# Plagiarism Checker Website

This is a full-stack Plagiarism Checker system that analyzes PDF documents, breaks them into equal sized chunks and stores them in a database. Then calculates similarity scores using embedding-based methods (vectors), lexical and structural similarity.

## Requirements
Python 3.12.0
Node.js (LTS version recommended)
PostgreSQL 17

# PostgreSQL Extension Requirement

This project requires the pgvector extension for storing and comparing embedding vectors in the database.

Before running the project, enable it in PostgreSQL:

`CREATE EXTENSION vector;`

If the extension is not installed, you may need to install the pgvector package first depending on your system setup.

## Backend Setup

### 1. Install dependencies
`pip install -r requirements.txt`

### 2. Environment variables

Before running the backend, create a .env file inside the backend/ directory with the following structure:

```
DB_NAME=PlagiarismChecker
DB_USER=
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=5432
```

Make sure to fill in your PostgreSQL username and password.

### 3. Load PDFs into the database

To process all PDFs from a folder and store them in the database:

`python write_in_db.py example_pdfs/`

Processed files are automatically moved to their respective folder after saving.

### 4. Run plagiarism analysis manually

To check similarity for a specific student document:

`python search_similar.py similarity_check_pdfs/<student_surname>_bakalavr.pdf`

Replace <student_surname> with the actual surname of the student.

### 5. Start backend server
`uvicorn app.main:app --reload`

The backend will be available at:

http://127.0.0.1:8000

## Frontend Setup

### 1. Install dependencies
`npm install`

### 2. Start development server
`npm run dev`

The frontend will be available at:

http://localhost:5173
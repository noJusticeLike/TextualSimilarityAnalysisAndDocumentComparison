const BASE_URL = "http://localhost:8001";

// GET ALL DOCUMENTS
export const getDocuments = async () => {
  const res = await fetch(`${BASE_URL}/documents`);
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
};

// GET DOCUMENTS BY ID
export const getDocumentById = async (id: string | number) => {
  const res = await fetch(`${BASE_URL}/documents/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch document");
  }

  return res.json();
};

// GET RECENT DOCUMENTS
export const getRecentDocuments = async () => {
  const res = await fetch(`${BASE_URL}/documents/recent`);
  if (!res.ok) throw new Error("Failed to fetch recent documents");
  return res.json();
};

// GET DOCUMENT STATS
export const getDocumentStats = async () => {
  const res = await fetch(`${BASE_URL}/documents/stats`);
  if (!res.ok) throw new Error("Failed to fetch document stats");
  return res.json();
};

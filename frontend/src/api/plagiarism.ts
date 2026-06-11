const API_URL = "http://localhost:8001";

export async function getSimilarityResults() {
  const response = await fetch(`${API_URL}/search/results`);

  if (!response.ok) {
    throw new Error("Failed to fetch similarity results");
  }

  return response.json();
}

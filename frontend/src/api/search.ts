const BASE_URL = "http://localhost:8001";

// GET RECENT SIMILARITY CHECKS
export const getRecentChecks = async () => {
  const res = await fetch(`${BASE_URL}/search/recent`);

  if (!res.ok) {
    throw new Error("Failed to fetch recent checks");
  }

  return res.json();
};

// GET DETAILED SEARCH RESULTS
export const getSearchResults = async () => {
  const res = await fetch(`${BASE_URL}/search/results`);

  if (!res.ok) {
    throw new Error("Failed to fetch search results");
  }

  return res.json();
};

// EXECUTE SEMANTIC SEARCH
export const executeSearch = async (query: string) => {
  const res = await fetch(
    `${BASE_URL}/search/execute?query=${encodeURIComponent(query)}`,
  );

  if (!res.ok) {
    throw new Error("Failed to execute search");
  }

  return res.json();
};

// GET WEEKLY CHART DATA
export const getChartData = async () => {
  const res = await fetch(`${BASE_URL}/search/chart`);

  if (!res.ok) {
    throw new Error("Failed to fetch chart data");
  }

  return res.json();
};

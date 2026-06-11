export const mockStats = {
  totalDocuments: 124,
  totalChunks: 3456,
  recentSearches: 89,
  avgSimilarity: 67,
};

export const mockRecentDocuments = [
  { id: 1, title: "Research Paper - AI Ethics.pdf", uploadDate: "2026-04-27", status: "processed" },
  { id: 2, title: "Thesis Chapter 3.pdf", uploadDate: "2026-04-26", status: "processed" },
  { id: 3, title: "Literature Review.pdf", uploadDate: "2026-04-25", status: "processing" },
];

export const mockRecentChecks = [
  { id: 1, document: "Research Paper - AI Ethics.pdf", similarity: 23, date: "2026-04-27" },
  { id: 2, document: "Thesis Chapter 3.pdf", similarity: 45, date: "2026-04-26" },
  { id: 3, document: "Literature Review.pdf", similarity: 12, date: "2026-04-25" },
];

export const chartData = [
  { id: 1, name: "Mon", checks: 12 },
  { id: 2, name: "Tue", checks: 19 },
  { id: 3, name: "Wed", checks: 15 },
  { id: 4, name: "Thu", checks: 22 },
  { id: 5, name: "Fri", checks: 28 },
  { id: 6, name: "Sat", checks: 8 },
  { id: 7, name: "Sun", checks: 5 },
];
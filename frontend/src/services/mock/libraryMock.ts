interface Document {
  id: number;
  filename: string;
  uploadDate: string;
  chunks: number;
  status: "processed" | "processing" | "failed";
}

export const mockDocuments: Document[] = [
  {
    id: 1,
    filename: "Research Paper - AI Ethics.pdf",
    uploadDate: "2026-04-27",
    chunks: 45,
    status: "processed",
  },
  {
    id: 2,
    filename: "Thesis Chapter 3.pdf",
    uploadDate: "2026-04-26",
    chunks: 67,
    status: "processed",
  },
  {
    id: 3,
    filename: "Literature Review.pdf",
    uploadDate: "2026-04-25",
    chunks: 23,
    status: "processing",
  },
  {
    id: 4,
    filename: "Introduction to Machine Learning.pdf",
    uploadDate: "2026-04-24",
    chunks: 89,
    status: "processed",
  },
  {
    id: 5,
    filename: "Data Science Fundamentals.pdf",
    uploadDate: "2026-04-23",
    chunks: 102,
    status: "processed",
  },
  {
    id: 6,
    filename: "Neural Networks Research.pdf",
    uploadDate: "2026-04-22",
    chunks: 78,
    status: "processed",
  },
  {
    id: 7,
    filename: "Deep Learning Applications.pdf",
    uploadDate: "2026-04-21",
    chunks: 56,
    status: "failed",
  },
];
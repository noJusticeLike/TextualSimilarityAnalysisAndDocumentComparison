interface SearchResult {
  id: number;
  document: string;
  chunk: number;
  similarity: number;
  text: string;
  explanation: string;
}

export const mockResults: SearchResult[] = [
  {
    id: 1,
    document: "Research Paper - AI Ethics.pdf",
    chunk: 12,
    similarity: 92,
    text: "Artificial Intelligence has become an integral part of modern society, influencing various aspects of our daily lives. From recommendation systems to autonomous vehicles, AI systems are increasingly making decisions that affect human welfare.",
    explanation: "Strong semantic match - discusses AI's integration in society and decision-making impact",
  },
  {
    id: 2,
    document: "Introduction to Machine Learning.pdf",
    chunk: 45,
    similarity: 85,
    text: "The integration of AI technologies into everyday applications has transformed how we interact with digital systems. Machine learning algorithms power personalized experiences across platforms.",
    explanation: "Highly relevant - focuses on AI integration and its transformative effects",
  },
  {
    id: 3,
    document: "Neural Networks Research.pdf",
    chunk: 8,
    similarity: 78,
    text: "Modern artificial intelligence systems demonstrate unprecedented capabilities in pattern recognition and decision-making. These advancements have led to widespread adoption in various industries.",
    explanation: "Semantic similarity - discusses AI capabilities and widespread adoption",
  },
  {
    id: 4,
    document: "Data Science Fundamentals.pdf",
    chunk: 23,
    similarity: 71,
    text: "Automated systems powered by AI are reshaping industries from healthcare to finance. The ability to process vast amounts of data and generate insights has become invaluable.",
    explanation: "Relevant context - mentions AI's impact across industries and data processing",
  },
];
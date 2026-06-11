interface SimilarityMatch {
  id: number;
  document: string;
  chunk: number;
  similarity: number;
  matchedText: string;
  context: string;
}

export const mockMatches: SimilarityMatch[] = [
  {
    id: 1,
    document: "Introduction to Machine Learning.pdf",
    chunk: 12,
    similarity: 87,
    matchedText:
      "Artificial Intelligence has become an integral part of modern society, influencing various aspects of our daily lives.",
    context:
      "...technological advancement. Artificial Intelligence has become an integral part of modern society, influencing various aspects of our daily lives. These systems are now ubiquitous...",
  },
  {
    id: 2,
    document: "Data Science Fundamentals.pdf",
    chunk: 45,
    similarity: 72,
    matchedText: "Machine learning algorithms are trained on vast datasets",
    context:
      "...in practice. Machine learning algorithms are trained on vast datasets, which enable them to learn patterns and make predictions. The quality of training data...",
  },
  {
    id: 3,
    document: "Neural Networks Research.pdf",
    chunk: 8,
    similarity: 68,
    matchedText: "deep learning models operate as black boxes",
    context:
      "...interpretability challenges. However, many modern AI systems, particularly deep learning models, operate as black boxes that are difficult to interpret. This opacity presents...",
  },
  {
    id: 4,
    document: "AI Ethics Framework.pdf",
    chunk: 23,
    similarity: 55,
    matchedText: "questions arise about accountability, transparency, and fairness",
    context:
      "...societal impact. As these systems become more sophisticated, questions arise about accountability, transparency, and fairness in automated decision-making. Stakeholders must...",
  },
  {
    id: 5,
    document: "Privacy in AI Systems.pdf",
    chunk: 67,
    similarity: 45,
    matchedText: "collection and analysis of personal data",
    context:
      "...regulatory frameworks. The collection and analysis of personal data enable powerful AI applications but must be balanced with privacy protections. Organizations should...",
  },
];
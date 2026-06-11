interface Chunk {
  id: number;
  text: string;
  startPage: number;
  endPage: number;
  embeddings: number;
}

export const mockDocument = {
  id: 1,
  filename: "Research Paper - AI Ethics.pdf",
  uploadDate: "2026-04-27",
  totalPages: 12,
  totalChunks: 45,
  status: "processed",
};

export const mockChunks: Chunk[] = [
  {
    id: 1,
    text: "Artificial Intelligence has become an integral part of modern society, influencing various aspects of our daily lives. From recommendation systems to autonomous vehicles, AI systems are increasingly making decisions that affect human welfare...",
    startPage: 1,
    endPage: 1,
    embeddings: 1536,
  },
  {
    id: 2,
    text: "The ethical implications of AI development cannot be overstated. As these systems become more sophisticated, questions arise about accountability, transparency, and fairness. Who is responsible when an AI system makes a mistake?...",
    startPage: 1,
    endPage: 2,
    embeddings: 1536,
  },
  {
    id: 3,
    text: "Machine learning algorithms are trained on vast datasets, which can inadvertently encode human biases. This raises concerns about algorithmic discrimination and the perpetuation of societal inequalities through automated systems...",
    startPage: 2,
    endPage: 2,
    embeddings: 1536,
  },
  {
    id: 4,
    text: "Privacy is another critical concern in the age of AI. The collection and analysis of personal data enable powerful AI applications, but also pose risks to individual privacy and autonomy. Striking a balance between innovation and privacy protection...",
    startPage: 3,
    endPage: 3,
    embeddings: 1536,
  },
  {
    id: 5,
    text: "Transparency in AI decision-making is essential for building trust. However, many modern AI systems, particularly deep learning models, operate as 'black boxes' that are difficult to interpret. This lack of explainability poses challenges...",
    startPage: 4,
    endPage: 4,
    embeddings: 1536,
  },
];

export const mockExtractedText = `Artificial Intelligence Ethics: A Comprehensive Review

Introduction
Artificial Intelligence has become an integral part of modern society, influencing various aspects of our daily lives. From recommendation systems to autonomous vehicles, AI systems are increasingly making decisions that affect human welfare.

Ethical Considerations
The ethical implications of AI development cannot be overstated. As these systems become more sophisticated, questions arise about accountability, transparency, and fairness. Who is responsible when an AI system makes a mistake?

Bias in Machine Learning
Machine learning algorithms are trained on vast datasets, which can inadvertently encode human biases. This raises concerns about algorithmic discrimination and the perpetuation of societal inequalities through automated systems.

Privacy Concerns
Privacy is another critical concern in the age of AI. The collection and analysis of personal data enable powerful AI applications, but also pose risks to individual privacy and autonomy.`;

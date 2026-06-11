import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { FileText, ArrowLeft, Play, Eye, EyeOff, Hash } from "lucide-react";

import { getDocumentById } from "@/api/documents";

interface Chunk {
  id: number;
  chunk_index: number;
  text: string;
  startPage: number;
  endPage: number;
  embeddings: number;
}

export function DocumentDetail() {
  const { id } = useParams();
  const [document, setDocument] = useState<any>(null);
  const [chunks, setChunks] = useState<any[]>([]);
  const [extractedText, setExtractedText] = useState<string>("");
  const [showExtractedText, setShowExtractedText] = useState(false);
  const [selectedChunk, setSelectedChunk] = useState<number | null>(null);

  // FETCH DATA FROM BACKEND
  useEffect(() => {
    async function loadDocument() {
      try {
        const data = await getDocumentById(id!);

        setDocument({
          title: data.filename,
          upload_date: data.uploadDate,
          total_pages: data.totalPages,
          total_chunks: data.totalChunks,
          status: data.status,
        });
        setChunks(data.chunks || []);
        setExtractedText(data.extractedText || "");
      } catch (err) {
        console.error(err);
      }
    }

    if (id) loadDocument();
  }, [id]);

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-6">
        <Link to="/library" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Library
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-8 h-full flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start">
                <FileText className="h-8 w-8 text-blue-600 mt-1 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{document?.title}</h1>
                  <div className="mt-4 flex flex-wrap gap-4 text-base text-gray-500">
                    <span>Uploaded: {document?.upload_date}</span>
                    <span>Pages: {document?.total_pages}</span>
                    <span>Chunks: {document?.total_chunks}</span>
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                {document?.status}
              </span>
            </div>

            <div className="flex gap-3 mt-auto pt-6">
              <button
                onClick={() => setShowExtractedText(!showExtractedText)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {showExtractedText ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide Extracted Text
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show Extracted Text
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6 h-full flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Embeddings Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-600">Total Chunks</span>
                <span className="text-lg font-semibold text-blue-600">{document?.total_chunks}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-600">Embedding Dimensions</span>
                <span className="text-lg font-semibold text-green-600">384</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-600">Model</span>
                <span className="text-sm font-medium text-purple-600">all-MiniLM-L6-v2</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      {showExtractedText && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Extracted Text</h2>
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
              {extractedText}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Chunk Breakdown</h2>
        <div className="space-y-3">
          {chunks.length > 0 ? (
            chunks.map((chunk) => (
              <div
                key={chunk.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedChunk === chunk.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedChunk(selectedChunk === chunk.id ? null : chunk.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <Hash className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Chunk {chunk.chunk_index}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    Pages {chunk.startPage}-{chunk.endPage}
                  </span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{chunk.text}</p>
                {selectedChunk === chunk.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{chunk.text}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      Embeddings: {chunk.embeddings} dimensions
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No chunks available</p>
          )}
        </div>
      </div>
    </div>
  );
}

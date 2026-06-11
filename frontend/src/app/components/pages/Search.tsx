import { FormEvent, useState } from "react";
import {
  Search as SearchIcon,
  FileText,
  Sparkles,
  Filter,
} from "lucide-react";

import { executeSearch } from "@/api/search";

interface SearchResult {
  id: number;
  document: string;
  chunk: number;
  similarity: number;
  text: string;
  explanation: string;
}

export function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [similarityThreshold, setSimilarityThreshold] = useState(0);
  const [documentFilter, setDocumentFilter] = useState("all");

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setSearchError("");

    try {
      const data = await executeSearch(query);
      setResults(data);
    } catch (error) {
      console.error(error);
      setResults([]);
      setSearchError("Unable to complete search. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const filteredResults = results.filter(
    (result) =>
      result.similarity >= similarityThreshold &&
      (documentFilter === "all" || result.document === documentFilter)
  );

  const uniqueDocuments = Array.from(new Set(results.map((result) => result.document)));

  const getColorForSimilarity = (similarity: number) => {
    if (similarity >= 70) return "#ef4444";
    if (similarity >= 50) return "#f59e0b";
    return "#10b981";
  };

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Semantic Search</h1>
        <p className="mt-2 text-gray-600">
          Search across all documents using natural language queries
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <form onSubmit={handleSearch}>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter your search query... (e.g., 'How does AI impact society?')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        <div className="mt-4 flex items-start">
          <Sparkles className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Semantic search</span> understands the meaning of your
              query, not just keywords.
            </p>
          </div>
        </div>

        {searchError && (
          <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {searchError}
          </div>
        )}
      </div>

      {isSearching && (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Searching through embeddings...</p>
        </div>
      )}

      {!isSearching && hasSearched && results.length === 0 && (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-500">No results found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search query</p>
        </div>
      )}

      {!isSearching && results.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Search Results ({filteredResults.length} of {results.length})
            </h2>
            <p className="text-sm text-gray-500 mt-1">Ranked by semantic similarity</p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Similarity Threshold: {similarityThreshold}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={similarityThreshold}
                  onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Filter</label>
                <select
                  value={documentFilter}
                  onChange={(e) => setDocumentFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Documents</option>
                  {uniqueDocuments.map((doc) => (
                    <option key={doc} value={doc}>
                      {doc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {filteredResults.length > 0 ? (
            <>
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Similarity Distribution</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {filteredResults.map((result) => (
                    <div key={result.id} className="text-center">
                      <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <div
                          className="absolute bottom-0 w-full rounded-t-lg transition-all"
                          style={{
                            height: `${result.similarity}%`,
                            backgroundColor: getColorForSimilarity(result.similarity),
                          }}
                        />
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 truncate" title={result.document}>
                          {result.document.split(".")[0].substring(0, 12)}...
                        </p>
                        <p
                          className={`text-sm font-semibold ${
                            result.similarity >= 70
                              ? "text-red-600"
                              : result.similarity >= 50
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {result.similarity}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredResults.map((result, index) => (
                  <div key={result.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start flex-1 min-w-0">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <h3 className="text-sm font-medium text-gray-900 truncate">{result.document}</h3>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Chunk #{result.chunk}</p>
                        </div>
                      </div>
                      <div className="ml-3 px-3 py-1 bg-blue-100 rounded-full">
                        <span className="text-sm font-semibold text-blue-800">{result.similarity}%</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-sm text-gray-700">{result.text}</p>
                    </div>

                    <div className="flex items-start">
                      <Sparkles className="h-4 w-4 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-gray-600 italic">{result.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
              <p className="text-sm font-medium text-gray-900 mb-2">No results match the current filters.</p>
              <p className="text-sm text-gray-500">Try lowering the similarity threshold or selecting a different document.</p>
            </div>
          )}
        </div>
      )}

      {!hasSearched && (
        <div className="bg-white shadow rounded-lg p-12">
          <div className="text-center max-w-2xl mx-auto">
            <SearchIcon className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Semantic Search</h3>
            <p className="text-gray-600 mb-6">
              Enter a natural language query to find relevant content across all your documents.
              Our embedding-based search understands context and meaning, not just exact keyword
              matches.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <p className="text-sm font-medium text-gray-900 mb-2">Example queries:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• "What are the ethical implications of AI?"</li>
                <li>• "How do machine learning algorithms handle bias?"</li>
                <li>• "Privacy concerns in data collection"</li>
                <li>• "Transparency in automated decision-making"</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

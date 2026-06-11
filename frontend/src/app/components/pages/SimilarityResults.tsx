import { useState } from "react";
import { useLocation, Link } from "react-router";
import { AlertTriangle, FileText, Filter, ArrowLeft, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface SimilarityMatch {
  document_id: number;
  similarity: number;
  query_chunk: string;
  matched_chunk: string;
}

function ExpandableChunkBox({ title, text, isDbSource = false }: { title: string; text: string; isDbSource?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongText = text ? text.length > 220 : false;

  return (
    <div 
      onClick={() => isLongText && setIsExpanded(!isExpanded)}
      className={`p-4 rounded-lg border transition-all duration-200 relative group ${
        isLongText ? "cursor-pointer select-none" : ""
      } ${
        isDbSource 
          ? "bg-yellow-50/30 border-yellow-100 hover:border-yellow-200" 
          : "bg-gray-50 border-gray-100 hover:border-gray-200"
      }`}
    >
  
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-gray-200/40">
        <span className={`text-xs font-bold uppercase tracking-wider ${isDbSource ? "text-yellow-600" : "text-gray-400"}`}>
          {title}
        </span>
        {isLongText && (
          <span className="text-[11px] font-medium text-blue-600 bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100 group-hover:bg-blue-50 transition">
            {isExpanded ? "Collapse" : "Expand"}
          </span>
        )}
      </div>

      <p 
        className={`text-sm text-gray-700 whitespace-pre-wrap leading-relaxed ${
          !isExpanded && isLongText ? "line-clamp-4 text-ellipsis" : ""
        }`}
      >
      
        {isDbSource ? (
          <span className={!isExpanded ? "bg-yellow-100/60 px-0.5 rounded" : "bg-yellow-100/20 px-0.5 rounded"}>
            {text || "No text available"}
          </span>
        ) : (
          text || "No text available"
        )}
      </p>
    </div>
  );
}

export function SimilarityResults() {
  const location = useLocation();
  
  const uploadedData = location.state as {
    matches: SimilarityMatch[];
    filename: string;
    score: number;
  } | null;

  const [similarityThreshold, setSimilarityThreshold] = useState(30);

  const matches = uploadedData?.matches || [];
  const filename = uploadedData?.filename || "Unknown Document";
  const totalScore = uploadedData?.score !== undefined ? uploadedData?.score * 100 : 0;

  const filteredMatches = matches.filter(
    (match) => (match.similarity * 100) >= similarityThreshold
  );

  const chartData = filteredMatches.map((match, index) => ({
    name: `Match #${index + 1}`,
    similarity: Math.round(match.similarity * 100),
  }));

  const getColorForSimilarity = (score: number) => {
    if (score >= 70) return "#ef4444"; 
    if (score >= 50) return "#f59e0b";
    return "#10b981";
  };

  if (!uploadedData) {
    return (
      <div className="px-4 sm:px-0 max-w-3xl mx-auto text-center py-12 bg-white shadow rounded-lg">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Available</h3>
        <p className="text-gray-600 mb-6">
          Please upload a document first to see the detailed plagiarism analysis.
        </p>
        <Link to="/upload" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Go to Upload
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-0 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/upload" className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Plagiarism Report</h1>
            <p className="text-sm text-gray-500 truncate max-w-xl">File: {filename}</p>
          </div>
        </div>

        <div className={`flex items-center px-4 py-2 rounded-lg border ${
          totalScore >= 70 ? "bg-red-50 border-red-200" : totalScore >= 50 ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"
        }`}>
          <div className="mr-3">
            <p className="text-xs text-gray-500 font-medium uppercase">Total Score</p>
            <p className="text-xl font-bold text-gray-900">{totalScore.toFixed(1)}%</p>
          </div>
          {totalScore >= 50 ? (
            <AlertTriangle className={`h-6 w-6 ${totalScore >= 70 ? "text-red-500" : "text-yellow-500"}`} />
          ) : (
            <CheckCircle className="h-6 w-6 text-green-500" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Similarity Distribution</h3>
          <div className="h-64">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis unit="%" />
                  <Tooltip formatter={(value) => [`${value}%`, "Similarity"]} />
                  <Bar dataKey="similarity">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getColorForSimilarity(entry.similarity)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No matches matching current filter
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900">Report Filters</h3>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
              Minimum Similarity: {similarityThreshold}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-500 space-y-2">
            <p className="font-semibold text-gray-700">Statistics:</p>
            <p>Total raw matches found: <span className="font-bold text-gray-900">{matches.length}</span></p>
            <p>Visible matches (filtered): <span className="font-bold text-gray-900">{filteredMatches.length}</span></p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Matched Source Text Pieces</h2>
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match, index) => {
            const pct = Math.round(match.similarity * 100);
            
            return (
              <div 
                key={index} 
                className="bg-white shadow rounded-lg p-6 border-l-4 hover:shadow-md transition-shadow duration-200" 
                style={{ borderColor: getColorForSimilarity(pct) }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900">Match #{index + 1}</span>
                    <span className="text-xs text-gray-400">(Source Doc ID: {match.document_id})</span>
                  </div>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold" 
                    style={{ backgroundColor: getColorForSimilarity(pct) + "20", color: getColorForSimilarity(pct) }}
                  >
                    {pct}% Match
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ExpandableChunkBox 
                    title="Your Document Chunk" 
                    text={match.query_chunk} 
                    isDbSource={false} 
                  />

                  <ExpandableChunkBox 
                    title="Matched DB Source" 
                    text={match.matched_chunk} 
                    isDbSource={true} 
                  />

                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white shadow rounded-lg text-gray-500">
            No plagiarism segments found above {similarityThreshold}%.
          </div>
        )}
      </div>
    </div>
  );
}
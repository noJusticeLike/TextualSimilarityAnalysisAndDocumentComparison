import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Upload, FileText, Package, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { getDocumentStats, getRecentDocuments } from "@/api/documents";
import { getRecentChecks, getChartData } from "@/api/search";

export function Dashboard() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);

  // REAL DATA STATE
  const [stats, setStats] = useState<any>(null);
  const [recentDocs, setRecentDocs] = useState<any[]>([]);
  const [recentChecks, setRecentChecks] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  // FETCH FROM BACKEND
  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsRes, docsRes, checksRes, chartRes] =
          await Promise.all([
            getDocumentStats(),
            getRecentDocuments(),
            getRecentChecks(),
            getChartData(),
          ]);

        setStats(statsRes);
        setRecentDocs(Array.isArray(docsRes) ? docsRes : []);
        setRecentChecks(Array.isArray(checksRes) ? checksRes : []);
        setChartData(Array.isArray(chartRes) ? chartRes : []);
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    }

    loadDashboard();
  }, []);

  // DRAG HANDLERS
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      navigate("/upload", {
        state: { files: e.dataTransfer.files },
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    if (e.target.files && e.target.files.length > 0) {
      navigate("/upload", {
        state: { files: e.target.files },
      });
    }
  };

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of the plagiarism detection system</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Documents</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats?.totalDocuments ?? 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Chunks</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats?.totalChunks ?? 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Recent Searches</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats?.recentSearches ?? 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Upload className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Similarity</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats?.avgSimilarity ?? 0}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="checks" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick Plagiarism Check</h2>
          </div>
          <form
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className="relative"
          >
            <input
              type="file"
              id="quick-upload"
              multiple
              accept=".pdf"
              onChange={handleChange}
              className="hidden"
            />
            <label
              htmlFor="quick-upload"
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 cursor-pointer transition-all ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
            >
              <Upload className={`mx-auto h-12 w-12 ${dragActive ? "text-blue-500" : "text-gray-400"}`} />
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">Results shown instantly - no database storage</p>
            </label>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Documents</h2>
          <div className="space-y-3">
            {recentDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center flex-1 min-w-0">
                  <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div className="ml-3 min-w-0 flex-1">
                    <Link
                      to={`/document/${doc.id}`}
                      className="text-sm font-medium text-gray-900 truncate hover:text-blue-600"
                    >
                      {doc.title}
                    </Link>
                    <p className="text-xs text-gray-500">{doc.uploadDate}</p>
                  </div>
                </div>
                <span
                  className={`ml-3 px-2 py-1 text-xs rounded-full ${
                    doc.status === "processed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Similarity Checks</h2>
          <div className="space-y-3">
            {recentChecks.map((check) => (
              <div key={check.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{check.document}</p>
                  <p className="text-xs text-gray-500">{check.date}</p>
                </div>
                <div className="ml-3 flex items-center">
                  <div
                    className={`text-sm font-semibold ${
                      check.similarity > 30 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {check.similarity}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

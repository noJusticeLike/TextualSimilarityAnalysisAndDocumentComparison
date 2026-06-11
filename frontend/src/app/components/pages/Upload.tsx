import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import { Upload as UploadIcon, FileText, CheckCircle, XCircle, Loader, AlertTriangle} from "lucide-react";

import { uploadPlagiarismCheck } from "@/api/upload";

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  status: "processing" | "completed" | "failed";
  progress: number;
  plagiarismScore: number | null;
  steps: {
    parsing: boolean;
    chunking: boolean;
    embedding: boolean;
    checking: boolean;
  };
}

export function Upload() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const simulateUpload = useCallback(async (fileId: string) => {
    const steps = ["parsing", "chunking", "embedding", "checking"] as const;
    let currentStep = 0;

    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.id !== fileId) return f;

          const newSteps = { ...f.steps };

          for (let i = 0; i <= currentStep; i++) {
            newSteps[steps[i]] = true;
          }

          const progress = ((currentStep + 1) / steps.length) * 100;

          if (currentStep === steps.length - 1) {
            clearInterval(interval);

            uploadPlagiarismCheck(f.file)
              .then((res) => {
                setFiles((prevFiles) =>
                  prevFiles.map((file) =>
                    file.id === fileId
                      ? {
                          ...file,
                          status: "completed",
                          progress: 100,
                          plagiarismScore: res.plagiarismScore,
                          matches: res.matches,
                          steps: {
                            parsing: true,
                            chunking: true,
                            embedding: true,
                            checking: true,
                          },
                        }
                      : file,
                  ),
                );
              })
              .catch(() => {
                setFiles((prevFiles) =>
                  prevFiles.map((file) =>
                    file.id === fileId ? { ...file, status: "failed" } : file,
                  ),
                );
              });

            return {
              ...f,
              steps: newSteps,
              progress: 100,
              status: "processing",
            };
          }

          return {
            ...f,
            steps: newSteps,
            progress,
          };
        }),
      );

      currentStep++;
    }, 1000);
  }, []);

  const handleFiles = useCallback(
    (fileList: FileList) => {
      const newFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        status: "processing" as const,
        progress: 0,
        plagiarismScore: null,
        steps: {
          parsing: false,
          chunking: false,
          embedding: false,
          checking: false,
        },
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach((file) => {
        simulateUpload(file.id);
      });
    },
    [simulateUpload],
  );

  useEffect(() => {
    const state = location.state as { files?: FileList } | null;
    if (state?.files) {
      handleFiles(state.files);
      window.history.replaceState({}, document.title);
    }
  }, [handleFiles, location.state]);

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="px-4 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Check for Plagiarism
        </h1>
        <p className="mt-2 text-gray-600">
          Upload documents to instantly check their similarity against the
          database
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-8 mb-8">
        <form
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className="relative"
        >
          <input
            type="file"
            id="file-upload"
            multiple
            accept=".pdf"
            onChange={handleChange}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadIcon
                className={`w-12 h-12 mb-3 ${dragActive ? "text-blue-500" : "text-gray-400"}`}
              />
              <p className="mb-2 text-sm text-gray-700">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">
                PDF files only - instant plagiarism check
              </p>
            </div>
          </label>
        </form>
      </div>

      {files.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Plagiarism Check Results
          </h2>
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start flex-1 min-w-0">
                    <FileText className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="ml-3 min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <div className="ml-3">
                    {file.status === "completed" && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {file.status === "processing" && (
                      <Loader className="h-5 w-5 text-blue-500 animate-spin" />
                    )}
                    {file.status === "failed" && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      file.status === "completed"
                        ? "bg-green-500"
                        : file.status === "failed"
                          ? "bg-red-500"
                          : "bg-blue-500"
                    }`}
                    style={{ width: `${file.progress}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div
                    className={`flex items-center text-xs ${
                      file.steps.parsing ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {file.steps.parsing ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <div className="h-4 w-4 mr-1 rounded-full border-2 border-current"></div>
                    )}
                    Parsing PDF
                  </div>
                  <div
                    className={`flex items-center text-xs ${
                      file.steps.chunking ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {file.steps.chunking ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <div className="h-4 w-4 mr-1 rounded-full border-2 border-current"></div>
                    )}
                    Chunking Text
                  </div>
                  <div
                    className={`flex items-center text-xs ${
                      file.steps.embedding ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {file.steps.embedding ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <div className="h-4 w-4 mr-1 rounded-full border-2 border-current"></div>
                    )}
                    Generating Embeddings
                  </div>
                  <div
                    className={`flex items-center text-xs ${
                      file.steps.checking ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {file.steps.checking ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <div className="h-4 w-4 mr-1 rounded-full border-2 border-current"></div>
                    )}
                    Checking Similarity
                  </div>
                </div>

                {file.status === "completed" &&
                  file.plagiarismScore !== null && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {file.plagiarismScore >= 70 ? (
                            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                          ) : file.plagiarismScore >= 50 ? (
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          )}
                          <span className="text-sm font-medium text-gray-700">
                            Plagiarism Score:
                          </span>
                        </div>
                        <span
                          className={`text-lg font-bold ${
                            file.plagiarismScore >= 70
                              ? "text-red-600"
                              : file.plagiarismScore >= 50
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {(file.plagiarismScore * 100).toFixed(2)}%
                        </span>
                      </div>
                      <button
                        onClick={() => navigate("/similarity", {
                          state: {
                            matches: file.matches,
                            filename: file.name,
                            score: file.plagiarismScore,
                          },
                        })}
                        className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        View Detailed Results
                      </button>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

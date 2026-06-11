import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/pages/Dashboard";
import { Upload } from "./components/pages/Upload";
import { Library } from "./components/pages/Library";
import { DocumentDetail } from "./components/pages/DocumentDetail";
import { SimilarityResults } from "./components/pages/SimilarityResults";
import { Search } from "./components/pages/Search";
import { NotFound } from "./components/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "upload", Component: Upload },
      { path: "library", Component: Library },
      { path: "document/:id", Component: DocumentDetail },
      { path: "similarity", Component: SimilarityResults },
      { path: "search", Component: Search },
      { path: "*", Component: NotFound },
    ],
  },
]);

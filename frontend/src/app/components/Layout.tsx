import { Outlet, NavLink } from "react-router";
import { Home, Upload, Library, Search, BarChart3 } from "lucide-react";

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-semibold text-gray-900">PlagiarismChecker</span>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 ${
                      isActive
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`
                  }
                >
                  <Home className="h-5 w-5 mr-2" />
                  Dashboard
                </NavLink>
                <NavLink
                  to="/upload"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 ${
                      isActive
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`
                  }
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload
                </NavLink>
                <NavLink
                  to="/library"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 ${
                      isActive
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`
                  }
                >
                  <Library className="h-5 w-5 mr-2" />
                  Library
                </NavLink>
                <NavLink
                  to="/search"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 ${
                      isActive
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`
                  }
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

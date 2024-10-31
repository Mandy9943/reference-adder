import { Outlet } from "react-router-dom";
export default function App() {
  return (
    <main
      key="1"
      className="flex flex-col items-center min-h-screen py-6 bg-gray-50 dark:bg-gray-900 container"
    >
      <div className="w-full max-w-7xl mx-auto space-y-6 h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center">
            Random References Inserter
          </h1>
        </div>
        <div>
          <div className="flex flex-grow w-full mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
}

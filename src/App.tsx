import { NavLink, Outlet } from "react-router-dom";
import { Button } from "./components/ui/button";
export default function App() {
  return (
    <main
      key="1"
      className="flex flex-col items-center min-h-screen py-6 bg-gray-50 dark:bg-gray-900 container"
    >
      <div className="w-full max-w-7xl mx-auto space-y-6 h-full flex flex-col">
        <div>
          <h1 className="text-2xl font-bold text-center">
            Random References Inserter
          </h1>
          <nav className="flex gap-5 justify-center">
            <Button variant={"outline"} className="rounded-full" asChild>
              <NavLink to={"/"}>References</NavLink>
            </Button>
            <Button variant={"secondary"} className="rounded-full" asChild>
              <NavLink to={"/ai"}>Remove Plagiarism</NavLink>
            </Button>
          </nav>
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

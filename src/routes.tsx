import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/Home/HomePage";
import RemovePlagiarismPage from "./pages/RemovePlagiarism/RemovePlagiarismPage";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "ai",
        element: <RemovePlagiarismPage />,
      },
    ],
  },
]);

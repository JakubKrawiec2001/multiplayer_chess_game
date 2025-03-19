import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Game from "./pages/Game.jsx";
import Home from "./pages/Home.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/game/:id",
    element: <Game />,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);

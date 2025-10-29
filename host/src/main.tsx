import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import Login from "./pages/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SelectedList from "./pages/SelectedList";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/clientes-selecionados",
    Component: SelectedList,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

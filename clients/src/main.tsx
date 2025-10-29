import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Clients from "./pages/Clients";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Clients />
  </StrictMode>
);

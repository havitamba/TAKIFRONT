import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter, Route, Routes } from "react-router";
import GamePage from "./pages/GamePage/GamePage";
import HomePage from "./pages/HomePage/HomePage";
import "./main.css";
import WaitingPage from "./pages/WaitingPage/WaitingPage";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <div className="abg">
        <ToastContainer />
        <Routes>
          <Route path="/game/:id" element={<GamePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/waiting/:id" element={<WaitingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  </StrictMode>
);

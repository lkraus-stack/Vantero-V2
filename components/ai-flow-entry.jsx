import React from "react";
import { createRoot } from "react-dom/client";
import AIFlowSection from "./AIFlowSection.jsx";
import "./AIFlowSection.css";

const rootElement = document.getElementById("ai-flow-root");

if (rootElement) {
  createRoot(rootElement).render(<AIFlowSection />);
}

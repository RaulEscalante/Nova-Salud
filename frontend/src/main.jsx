
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { SalesProvider } from "./context/SalesContext";

import "./index.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <SalesProvider>
            <App />
        </SalesProvider>
    </StrictMode>
);


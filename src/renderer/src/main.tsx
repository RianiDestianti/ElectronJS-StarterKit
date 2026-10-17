import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StoreProvider } from "@/providers/StoreProvider";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <StoreProvider>
            <App />
        </StoreProvider>
    </StrictMode>
);

import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "@/components/error-boundary";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/hooks/use-theme";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);

root.render(
  <ErrorBoundary>
    <ThemeProvider defaultTheme="system" storageKey="centsible-theme">
      <App />
    </ThemeProvider>
  </ErrorBoundary>
);
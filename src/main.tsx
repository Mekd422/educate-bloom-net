import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "./components/AuthProvider.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <Toaster />
    </AuthProvider>
  </BrowserRouter>
);

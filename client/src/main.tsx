import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Force dark mode by adding the class to document element
document.documentElement.classList.add('dark');

createRoot(document.getElementById("root")!).render(<App />);

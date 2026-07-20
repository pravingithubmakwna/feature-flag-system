import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { FeatureFlagProvider } from "./flags/FeatureFlagContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <FeatureFlagProvider>
        <App />
      </FeatureFlagProvider>
    </UserProvider>
  </StrictMode>
);

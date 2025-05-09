import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import ContextProvider from "./context/Context.jsx"
import { AuthProvider } from "./context/authContext.jsx"

createRoot(document.getElementById("root")).render(
  <AuthProvider>
  <ContextProvider>
    <App />
  </ContextProvider>
  </AuthProvider>



)

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function AppWrapper({ children }) {
  const location = useLocation();

  useEffect(() => {
    const root = document.getElementById("root");

    root.className = "";

    if (location.pathname === "/login" || location.pathname === "/register") {
      root.classList.add("auth-root");
    } else {
      root.classList.add("main-root");
    }
  }, [location]);

  return children;
}

export default AppWrapper;
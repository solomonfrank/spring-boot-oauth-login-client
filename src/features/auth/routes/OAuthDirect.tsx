import { Navigate, useLocation } from "react-router-dom";

export const OAuthDirect = () => {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  if (!token) {
    return <Navigate to="/auth/login" />;
  }

  localStorage.setItem("access_token", token);

  return <Navigate to="/app/dashboard" />;
};

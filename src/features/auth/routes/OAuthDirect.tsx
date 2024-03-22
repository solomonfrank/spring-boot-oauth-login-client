import { Navigate, useLocation } from "react-router-dom";

export const OAuthDirect = () => {
  const location = useLocation();

  const token = new URLSearchParams(location.search).get("token");

  const error = new URLSearchParams(location.search).get("error");

  console.log("errrr", error);

  if (!token || error) {
    return <Navigate to="/auth/login" state={{ error }} />;
  }

  localStorage.setItem("access_token", token);

  return <Navigate to="/app/dashboard" />;
};

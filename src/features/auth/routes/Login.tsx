import { Navigate } from "react-router-dom";
import { LoginForm } from "../components/LoginForm";

export const Login = () => {
  if (localStorage.getItem("access_token")) {
    return <Navigate to="/app/dashboard" />;
  }
  return <LoginForm />;
};

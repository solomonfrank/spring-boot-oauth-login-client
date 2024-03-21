import { Login } from "@/features/auth/routes/Login";
import { EventBooking } from "@/features/booking/routes";
import { isLogged } from "@/utils/isLogged";
import { Navigate, useRoutes } from "react-router-dom";
import { protectedRoute } from "./protected";
import { publicRoute } from "./public";

export const AppRoutes = () => {
  const commonRoutes = [
    { path: "/", element: <div>Welcome to landing</div> },
    { path: "/auth/login", element: <Login /> },
    { path: "*", element: <Navigate to="/auth/login" /> },

    {
      path: "/:username/:title",
      element: <EventBooking />,
    },
  ];
  const routes = isLogged() ? protectedRoute : publicRoute;
  return useRoutes([...routes, ...commonRoutes]);
};

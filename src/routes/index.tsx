import { CalendarRedirect } from "@/features/auth/routes/CalendarRedirect";
import { Login } from "@/features/auth/routes/Login";
import { EventBooking } from "@/features/booking/routes";
import { Landing } from "@/features/home/route/Landing";
import { isLogged } from "@/utils/isLogged";
import { Navigate, useRoutes } from "react-router-dom";
import { protectedRoute } from "./protected";
import { publicRoute } from "./public";

export const AppRoutes = () => {
  const commonRoutes = [
    { path: "/", element: <Landing /> },
    { path: "/auth/login", element: <Login /> },
    { path: "/auth/login", element: <Login /> },
    { path: "/auth/calendar/callback", element: <CalendarRedirect /> },
    { path: "*", element: <Navigate to="/auth/login" /> },

    {
      path: "/bookme/:username/:title",
      element: <EventBooking />,
    },
  ];
  const routes = isLogged() ? protectedRoute : publicRoute;
  return useRoutes([...routes, ...commonRoutes]);
};

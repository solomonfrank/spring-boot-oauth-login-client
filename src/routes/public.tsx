import { AuthRoutes } from "@/features/auth";
import { OAuthDirect } from "@/features/auth/routes/OAuthDirect";

export const publicRoute = [
  {
    path: "/auth/*",
    element: <AuthRoutes />,
  },

  {
    path: "/oauth2/redirect/",
    element: <OAuthDirect />,
  },
];

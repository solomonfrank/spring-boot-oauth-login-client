import MainLayout from "@/components/layout/main-layout";
import { Booking } from "@/features/booking/routes";
import { Dashboard } from "@/features/dashboard/routes";
import { CreateEvent } from "@/features/events/routes";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export const protectedRoute = [
  {
    path: "/app",
    element: <App />,
    children: [
      { path: "/app/dashboard", element: <Dashboard /> },
      { path: "/app/event", element: <CreateEvent /> },
      { path: "/app/booking", element: <Booking /> },
    ],
  },
];

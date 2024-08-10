import { axios } from "@/libs/axios";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const CalendarRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const code = new URLSearchParams(location.search).get("code");

  console.log("code", code);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get("code");

    if (code) {
      // Send the authorization code to the backend
      axios
        .get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/integration/googlecalender/callback?code=${code}&returnTo=${
            import.meta.env.VITE_APPLICATION_URL
          }/app/event`
        )
        .then((response) => {
          console.log("Access Token:", response.data);
          navigate(
            `${import.meta.env.VITE_APPLICATION_URL}/app/event?status=success`
          );
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, []);

  return <div />;
};

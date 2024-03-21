import { JwtPayload, jwtDecode } from "jwt-decode";

export const getUser = (): JwtPayload | null => {
  const token = localStorage.getItem("access_token");

  if (token) {
    const userInfo = jwtDecode(token);

    console.log("user info", userInfo);

    return userInfo;
  }

  return null;
};

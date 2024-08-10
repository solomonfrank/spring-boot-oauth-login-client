import { JwtPayload, jwtDecode } from "jwt-decode";

export const getUser = ():
  | (JwtPayload & { fullName?: string; userId?: number })
  | null => {
  const token = localStorage.getItem("access_token");

  if (token) {
    const userInfo = jwtDecode(token);

    return userInfo;
  }

  return null;
};

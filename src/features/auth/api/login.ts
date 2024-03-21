import { authAxios } from "@/libs/axios";
import { UserResponse } from "@/types";

export type LoginRequestDto = {
  email: string;
  password: string;
};

export const loginWithEmailAndPassword = async (
  data: LoginRequestDto
): Promise<UserResponse> => {
  const response = await authAxios.post("/auth/login", data);
  return response.data;
};

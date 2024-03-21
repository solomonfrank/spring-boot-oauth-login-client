import { authAxios } from "@/libs/axios";
import { UserResponse } from "@/types";

export type SignRequestDto = {
  username: string;
  name: string;
  password: string;
  email: string;
};

export const signupWithEmailAndPassword = (
  data: SignRequestDto
): Promise<UserResponse> => {
  return authAxios.post("/auth/register", data);
};

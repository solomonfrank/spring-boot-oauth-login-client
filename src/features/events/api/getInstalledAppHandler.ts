import { axios } from "@/libs/axios";

export type CredentialResponse = {
  id: string;
  userId: number;
  slug: string;
  createdAt: string;
};

export const getInstalledAppsHandler = (): Promise<CredentialResponse[]> => {
  return axios.get("/apps/installed");
};

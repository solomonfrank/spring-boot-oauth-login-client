import { axios } from "@/libs/axios";
import { EventProps } from "../types";

export const createEventHandler = (
  data: Record<string, string>
): Promise<EventProps> => {
  return axios.post("/event-type", data);
};

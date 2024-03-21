import { axios } from "@/libs/axios";
import { EventProps } from "../types";

export const getEventHandler = (): Promise<EventProps[]> => {
  return axios.get("/event-type");
};

import { axios } from "@/libs/axios";
import { FormValue } from "../components/CreateEventForm";
import { EventProps } from "../types";

export const createEventHandler = (data: FormValue): Promise<EventProps> => {
  return axios.post("/event-type", data);
};

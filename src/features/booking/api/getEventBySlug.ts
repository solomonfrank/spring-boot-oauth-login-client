import { axios } from "@/libs/axios";
import { EventProps } from "@/types";

export const getEventBySlugHandler = (
  userId: string,
  slug: string
): Promise<EventProps> => {
  return axios.get(`/event-type/${userId}/${slug}`);
};

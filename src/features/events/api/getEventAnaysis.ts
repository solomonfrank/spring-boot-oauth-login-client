import { axios } from "@/libs/axios";

export type EventBookingAnalysis = {
  totalUpcomingCount: number;
  totalPastCount: number;
};

export const getEventAnaysisHandler = (
  userId: number
): Promise<EventBookingAnalysis> => {
  return axios.get(`/event-type/${userId}/analysis`);
};

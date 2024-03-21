import { axios } from "@/libs/axios";
import { EventProps } from "@/types";

type BookingStatus = "ACCEPTED" | "DECLINED";

export type AttendeeProps = {
  email: string;
  name: string;
  timeZone: string;
  phoneNumber: string;
};
export type BookingProps = {
  startDate: string;
  endDate: string;
  title: string | null;
  description: string | null;
  location: string;
  bookStatus: BookingStatus;
  attendee: AttendeeProps;
  eventTypeId: number;
};
export const scheduleEventHandler = (
  data: BookingProps
): Promise<EventProps> => {
  return axios.post(`/booking`, data);
};

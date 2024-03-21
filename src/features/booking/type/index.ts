import { AttendeeProps } from "../api/scheduleEvent";

export type Attendee = AttendeeProps & { id: number };

export type BookingResponse = {
  startDate: string;
  id: number;
  endDate: string;
  title: string;
  description: string;
  location: string;
  bookStatus: string;
  attendee: Attendee;
};

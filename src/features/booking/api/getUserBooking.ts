import { axios } from "@/libs/axios";
import { BookingResponse } from "../type";

export const getUserBooking = (): Promise<BookingResponse[]> => {
  return axios.get(`/booking`);
};

import { axios } from "@/libs/axios";
import { PagedBookingResponse } from "../type";

export const getUserBooking = (
  filter: Record<string, string>
): Promise<PagedBookingResponse> => {
  const query = new URLSearchParams(filter).toString();

  return axios.get(`/booking?${query}`);
};

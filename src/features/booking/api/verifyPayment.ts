import { axios } from "@/libs/axios";

type VerifyPaymentResponse = {
  status: string;
};
export const verifyBookingPayment = (
  reference: string
): Promise<VerifyPaymentResponse> => {
  return axios.get(`/payment/verify/${reference}`);
};

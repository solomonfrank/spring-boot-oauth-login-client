export type UserResponse = {
  user: Record<string, string>;
  token: string;
};

export type PaystackInitializeResponse = {
  accessCode: string;
  reference: string;
  amount: string;
  authorizationUrl: string;
};

export type EventProps = {
  title: string;
  duration: number;
  description: string;
  slug?: string;
  owner?: string;
  id: number;
  price: number;
  paymentResponse?: PaystackInitializeResponse;
};

export type UserResponse = {
  user: Record<string, string>;
  token: string;
};

export type EventProps = {
  title: string;
  duration: number;
  description: string;
  slug?: string;
  owner?: string;
  id: number;
};

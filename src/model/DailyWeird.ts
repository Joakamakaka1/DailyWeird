export interface DailyWeird {
  id: number;
  title: string;
  date: string;
  author: string;
  description: string;
  image_url: string;
  items: {
    rank: number;
    name: string;
    description: string;
    image_url: string;
  }[];
}

export interface EmailDailyWeird {
  id: number;
  created_at: string;
  email: string;
  verified: boolean;
}

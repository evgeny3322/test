export interface Payment {
  id: number;
  img: string;
  title: string;
  area?: number;
  date: string;
  participants_number?: number;
  total_duration?: number;
  total_price?: number;
  transportation?: string;
  services?: Services[];
}

interface Services {
  id: number;
  title: string;
  description: string;
  price: number;
  img: string;
}

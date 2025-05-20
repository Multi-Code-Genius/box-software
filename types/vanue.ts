export interface FormData {
  name: string;
  description: string;
  city: string;
  area: string;
  address: string;
  capacity: string;
  category: string;
  hourlyPrice: string;
  surface: string;
  net: string;
  turfType: string;
  image: string | null;
}
export interface Errors {
  name?: string;
  description?: string;
  city?: string;
  area?: string;
  address?: string;
  capacity?: string;
  category?: string;
  hourlyPrice?: string;
  surface?: string;
  net?: string;
  image?: string;
}

export interface CreateBooking {
  gameId: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  nets: number;
  date: string;
  name: string;
  number: string;
}

export interface UpdateBooking {
  id?: string;
  startTime: string;
  endTime: string;
  date: any;
}

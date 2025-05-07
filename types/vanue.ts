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

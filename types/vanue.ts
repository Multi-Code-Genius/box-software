import { ReactNode } from "react";

export type GroundDetail = {
  ground: number | "";
  hourly_price: number | "";
  capacity: number | "";
  width: number | "";
  height: number | "";
};

export type VenueFormData = {
  name: string;
  description: string;
  category: string;
  location: {
    city: string;
    lat: number;
    lng: number;
    area: string;
  };
  address: string;
  game_info: {
    type: string;
    maxPlayers: number;
  };
  ground_details: {
    ground: number;
    hourly_price: number | string;
    capacity: number | string;
    width: number | string;
    height: number | string;
  }[];
  images: File[];
};

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
  name: string;
  phone: string;
  startTime: string;
  endTime: string;
  date: string;
  venueId: number;
  totalAmount: number;
  bookedGrounds: number;
}

export interface UpdateBooking {
  id?: string;
  name: string;
  startTime: string;
  endTime: string;
  date: string;
  bookedGrounds: number;
  totalAmount: number;
  phone: number;
}

export interface Venues {
  ground_details: any;
  id: string;
  name: string;
  category: string;
  address: string;
  description: string;
  grounds: string;
  capacity: number;
  hourly_price: number;
  bookings: any[];
  startDate: string;
  endDate: string;
  game_info: {
    maxPlayers: ReactNode;
    type: string;
    max_players: number;
  };
  location: {
    lat: number;
    lng: number;
    area: string;
    city: string;
  };
}

import { ReactNode } from "react";

export type VenueFormData = {
  name: string;
  description: string;
  address: string;
  category: string;
  hourlyPrice: number;
  location: {
    city: string;
    lat: number;
    lng: number;
  };
  gameInfo: {
    type: string;
    maxPlayers: number;
  };
  grounds: number;
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
  startTime: string;
  endTime: string;
  date: any;
}

export interface Venues {
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

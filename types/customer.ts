export interface Game {
  id: string;
  name: string;
}

export interface Booking {
  id: string;
  userId: string;
  venueId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  isCancel: boolean;
  nets: number;
  totalAmount: number;
  customerId: string;
  game: Game;
}

export interface CustomerData {
  booking_count: number;
  id: string;
  name: string;
  mobile: string;
  userId: string;
  ownerId: string;
  createdById: string;
  total_spent: number;
  createdAt: string;
  updatedAt: string;
  bookings: Booking[];
}

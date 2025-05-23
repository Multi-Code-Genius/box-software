export interface Game {
  id: string;
  name: string;
}

export interface Booking {
  id: string;
  userId: string;
  gameId: string;
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
  id: string;
  name: string;
  mobile: string;
  userId: string;
  ownerId: string;
  createdById: string;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
  bookings: Booking[];
}

export interface Game {
  id: string;
  name: string;
  category: string;
  address: string;
  capacity: number;
  hourlyPrice: number;
  location: {
    area: string[];
    city: string[];
  };
  description: any;
  bookings: any;
  startDate: any;
  endDate: any;
}

// API response interface
export interface GamesResponse {
  games: Game[];
}

// Function to fetch all games
export const getAllGames = async (): Promise<GamesResponse> => {
  try {
    // In a real application, this would be an API call
    // For now, we'll return mock dataO
    const mockGames: Game[] = [
      {
        id: "1",
        name: "City Football Ground",
        category: "Football",
        address: "123 Sports Lane",
        capacity: 22,
        hourlyPrice: 1200,
        location: {
          area: ["Downtown"],
          city: ["Mumbai"],
        },
        description: "Professional football ground with high-quality turf",
        bookings: [],
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      },
      {
        id: "2",
        name: "Central Cricket Stadium",
        category: "Cricket",
        address: "456 Play Street",
        capacity: 30,
        hourlyPrice: 1500,
        location: {
          area: ["Suburbs"],
          city: ["Delhi"],
        },
        description: "Full-size cricket stadium with premium facilities",
        bookings: [],
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "3",
        name: "Metro Basketball Court",
        category: "Basketball",
        address: "789 Game Avenue",
        capacity: 12,
        hourlyPrice: 800,
        location: {
          area: ["University Area"],
          city: ["Bangalore"],
        },
        description: "Indoor basketball court with professional flooring",
        bookings: [],
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return { games: mockGames };
  } catch (error) {
    console.error("Error fetching games:", error);
    throw error;
  }
};

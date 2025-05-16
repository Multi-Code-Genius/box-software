// components/BookingList.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const bookings = [
  {
    id: 1,
    avatarUrl: "https://github.com/shadcn.png",
    username: "John Doe",
    timeAgo: "2 mins ago",
    message: "Booked a slot",
    slotInfo: "20 June, Sunday, 9:30PM - 11:00PM",
    actionText: "View booking info",
  },
  {
    id: 2,
    avatarUrl: "https://github.com/vercel.png",
    username: "Alice Smith",
    timeAgo: "10 mins ago",
    message: "Booked a slot",
    slotInfo: "22 June, Tuesday, 1:00PM - 2:30PM",
    actionText: "View booking info",
  },
  {
    id: 3,
    avatarUrl: "https://github.com/shadcn.png",
    username: "John Doe",
    timeAgo: "2 mins ago",
    message: "Booked a slot",
    slotInfo: "20 June, Sunday, 9:30PM - 11:00PM",
    actionText: "View booking info",
  },
  {
    id: 4,
    avatarUrl: "https://github.com/shadcn.png",
    username: "John Doe",
    timeAgo: "2 mins ago",
    message: "Booked a slot",
    slotInfo: "20 June, Sunday, 9:30PM - 11:00PM",
    actionText: "View booking info",
  },
];

const BookingList = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-300 px-3 py-6 font-bold">
        New Booking
      </div>

      <div className="flex-1 overflow-auto">
        {bookings.map((booking) => (
          <div key={booking.id} className="w-full flex flex-row gap-3 px-4">
            <div className="w-full px-3 py-7 border-b border-gray-300">
              <div className="flex flex-row gap-3">
                <div className="pt-1">
                  <div className="text-lg font-semibold">
                    <Avatar>
                      <AvatarImage src={booking.avatarUrl} />
                      <AvatarFallback>
                        {booking.username
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                <div className="w-full space-y-1">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <p className="font-bold text-base">{booking.username}</p>
                    <p>{booking.timeAgo}</p>
                  </div>
                  <p>{booking.message}</p>
                  <p className="text-sm text-green-500 font-medium">
                    {booking.slotInfo}
                  </p>
                  <p className="text-sm text-blue-500 cursor-pointer hover:underline font-bold pt-2">
                    {booking.actionText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full flex justify-center py-3 border-t border-gray-200">
        <button className="mx-auto">View all</button>
      </div>
    </div>
  );
};

export default BookingList;

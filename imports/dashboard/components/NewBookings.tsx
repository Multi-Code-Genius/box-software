"use client";

import { useState } from "react";
import { useDashboardStore } from "@/store/dashboardStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, formatDistanceToNow } from "date-fns";

const BookingList = () => {
  const [showAll, setShowAll] = useState(false);
  const { data } = useDashboardStore();

  const bookings =
    data?.newBookings?.map((booking: any, index: number) => {
      const user = booking.user || {};
      const startDate = new Date(booking.startTime);
      const endDate = new Date(booking.endTime);
      const formattedDate = format(startDate, "dd MMMM, EEEE");
      const formattedTime = `${format(startDate, "h:mma")} - ${format(
        endDate,
        "h:mma"
      )}`;

      return {
        id: booking.id,
        avatarUrl: "https://github.com/shadcn.png",
        username: user.name || "Unknown",
        timeAgo: formatDistanceToNow(new Date(booking.createdAt), {
          addSuffix: true,
        }),
        message: "Booked a slot",
        slotInfo: `${formattedDate}, ${formattedTime}`,
        actionText: "View booking info",
      };
    }) || [];

  const visibleBookings = showAll ? bookings : bookings.slice(0, 3);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-300 px-3 py-6 font-bold flex items-center justify-between ">
        New Booking
        <div className="text-xs font-medium bg-gray-200 h-5 w-5 flex justify-center items-center rounded-full">
          {bookings.length}
        </div>
      </div>

      <div
        className={`flex-1 my-2 ${
          showAll ? "overflow-auto" : "overflow-hidden"
        }`}
      >
        {visibleBookings.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No new bookings available.
          </div>
        ) : (
          visibleBookings.map((booking) => (
            <div key={booking.id} className="w-full flex flex-row gap-3 px-4">
              <div className="w-full px-3 py-6 border-b border-gray-300">
                <div className="flex flex-row gap-3">
                  <div className="pt-1">
                    <Avatar>
                      <AvatarImage src={booking.avatarUrl} />
                      <AvatarFallback className="text-xs">
                        {booking.username
                          .split(" ")
                          .map((word: any) => word[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
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
          ))
        )}
      </div>

      {!showAll && bookings.length > 3 && visibleBookings.length > 0 && (
        <div className="w-full flex justify-center py-3 border-t border-gray-200">
          <button
            onClick={() => setShowAll(true)}
            className="mx-auto text-blue-500 font-medium hover:underline"
          >
            View all
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingList;

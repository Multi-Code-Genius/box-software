"use client";

import {
  useBookingByRange,
  useCancelBooking,
  useCreateBooking,
  useUpdateBooking,
} from "@/api/booking";
import { Venue } from "@/types/auth";
import moment from "moment";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ISchedule } from "tui-calendar";

const TuiCalendar = dynamic(() => import("../components/TuiCalendar"), {
  ssr: false,
});

const BookingPage = ({ venue }: { venue: Venue }) => {
  const [range, setRange] = useState<{ start: string; end: string }>(() => {
    const start = moment().startOf("week").format("YYYY-MM-DD");
    const end = moment().endOf("week").format("YYYY-MM-DD");
    return { start, end };
  });

  const { refetch, isLoading, data, error } = useBookingByRange(
    venue.id,
    range
  );
  console.log(data, "bookingbyrange");
  const [events, setEvents] = useState<ISchedule[]>([]);

  const updateEvents = (data: any) => {
    const formatted =
      data?.bookings?.map((item: any) => ({
        id: item.id,
        calendarId: item.id,
        title: item?.customer?.name,
        category: "time",
        start: item.start_time,
        end: item.end_time,
      })) ?? [];

    setEvents(formatted);
    console.log(events, "kjasfhjlad");
  };

  useEffect(() => {
    if (venue?.id && range.start && range.end) {
      refetch().then((res) => {
        updateEvents(res.data);
      });
    }
  }, [venue?.id, range.start, range.end]);

  const { mutate: cancelBooking } = useCancelBooking(
    () => refetch(),
    () => refetch()
  );

  const { mutate: updateBooking } = useUpdateBooking(
    () => refetch(),
    () => refetch()
  );

  const { mutate: createBooking } = useCreateBooking(
    async () => {
      const newData = await refetch();
      console.log(newData, "newData");
      updateEvents(newData.data);
    },
    async () => {
      const newData = await refetch();
      updateEvents(newData.data);
    }
  );

  console.log(events);
  return (
    <div>
      <TuiCalendar
        events={events}
        setEvents={setEvents}
        createBooking={createBooking}
        refetch={refetch}
        isLoading={isLoading}
        cancelBooking={cancelBooking}
        updateBooking={updateBooking}
        setRange={setRange}
      />
    </div>
  );
};

export default BookingPage;
function mutate(): import("react").EffectCallback {
  throw new Error("Function not implemented.");
}

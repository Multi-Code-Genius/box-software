"use client";

import {
  useBookingByRange,
  useCancelBooking,
  useCreateBooking,
  useUpdateBooking,
} from "@/api/booking";
import moment from "moment";
import { useEffect, useState } from "react";
import { ISchedule } from "tui-calendar";
import TuiCalendar from "../components/TuiCalendar";

const BookingPage = () => {
  const [range, setRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  const { data, refetch, isLoading } = useBookingByRange(
    "a2d93d2c-d738-4cad-9884-f700dadfb10e",
    range
  );

  const { mutate: cancelBooking } = useCancelBooking(
    () => refetch(),
    () => refetch()
  );

  const { mutate: updateBooking } = useUpdateBooking(
    () => refetch(),
    () => refetch()
  );

  const [events, setEvents] = useState<ISchedule[]>([]);

  const updateEvents = (data: any) => {
    const formatted =
      data?.bookings?.map((item: any) => ({
        id: item.id,
        calendarId: item.id,
        title: item.user.name,
        category: "time",
        start: moment.utc(item.startTime).local().format("YYYY-MM-DDTHH:mm:ss"),
        end: moment.utc(item.endTime).local().format("YYYY-MM-DDTHH:mm:ss"),
      })) ?? [];

    setEvents(formatted);
  };

  useEffect(() => {
    if (data) {
      updateEvents(data);
    }
  }, [data]);

  const { mutate: createBooking } = useCreateBooking(
    async () => {
      const newData = await refetch();
      updateEvents(newData.data);
    },
    async () => {
      const newData = await refetch();
      updateEvents(newData.data);
    }
  );

  return (
    <div>
      <h1>Booking Page</h1>
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

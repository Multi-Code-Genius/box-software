"use client";

import {
  useBookingByRange,
  useCancelBooking,
  useCreateBooking,
  useUpdateBooking,
} from "@/api/booking";
import moment from "moment";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ISchedule } from "tui-calendar";

const TuiCalendar = dynamic(() => import("../components/TuiCalendar"), {
  ssr: false,
});

const BookingPage = ({ game }: any) => {
  const [range, setRange] = useState<{ start: string; end: string }>(() => {
    const start = moment().startOf("day").format("YYYY-MM-DD");
    const end = moment().endOf("day").format("YYYY-MM-DD");
    return { start, end };
  });

  const { data, refetch, isLoading } = useBookingByRange(game.id, range);

  const [events, setEvents] = useState<ISchedule[]>([]);

  const updateEvents = (data: any) => {
    const formatted =
      data?.bookings?.map((item: any) => ({
        id: item.id,
        calendarId: item.id,
        title: item?.user?.name,
        category: "time",
        start: moment.utc(item.startTime).local().format("YYYY-MM-DDTHH:mm:ss"),
        end: moment.utc(item.endTime).local().format("YYYY-MM-DDTHH:mm:ss"),
      })) ?? [];

    setEvents(formatted);
  };

  useEffect(() => {
    if (game?.id && range.start && range.end) {
      refetch().then((res) => {
        updateEvents(res.data);
      });
    }
  }, [game?.id, range.start, range.end]);

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
      updateEvents(newData.data);
    },
    async () => {
      const newData = await refetch();
      updateEvents(newData.data);
    }
  );

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

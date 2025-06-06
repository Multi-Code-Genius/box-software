"use client";

import {
  useBookingByRange,
  useCancelBooking,
  useCreateBooking,
  useUpdateBooking,
} from "@/api/booking";
import { Venue } from "@/types/auth";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { ISchedule } from "tui-calendar";
import Calender from "../components/Calender";
import { colors } from "@/constant/content";

const BookingPage = ({ venue }: { venue: Venue }) => {
  const [range, setRange] = useState<{ start: string; end: string }>(() => {
    const start = moment().startOf("week").format("YYYY-MM-DD");
    const end = moment().endOf("week").format("YYYY-MM-DD");

    return { start, end };
  });

  const { refetch, isLoading } = useBookingByRange(venue.id, range);
  const [events, setEvents] = useState<ISchedule[]>([]);

  const updateEvents = (data: any) => {
    const formatted =
      data?.bookings?.map((item: any, index: number) => ({
        id: item.id,
        color: colors[index],
        allDay: false,
        title: item?.customer?.name,
        category: "time",
        start: moment
          .utc(item.start_time)
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD HH:mm:ss"),
        end: moment
          .utc(item.end_time)
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD HH:mm:ss"),
        mobile: item?.customer?.mobile,
        amount: item.total_amount,
      })) ?? [];

    setEvents(formatted);
  };

  useEffect(() => {
    if (venue?.id && range.start && range.end) {
      refetch().then((res) => {
        updateEvents(res.data);
      });
    }
  }, [venue?.id, range.start, range.end, refetch]);

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
      <Calender
        events={events}
        createBooking={createBooking}
        cancelBooking={cancelBooking}
        updateBooking={updateBooking}
        setRange={setRange}
        refetch={refetch}
        isLoading={isLoading}
        setEvents={setEvents}
      />
    </div>
  );
};

export default BookingPage;

"use client";

import {
  useBookingByRange,
  useCancelBooking,
  useCreateBooking,
  useUpdateBooking,
} from "@/api/booking";
import { Venue } from "@/types/auth";
import moment from "moment";
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

  const { refetch } = useBookingByRange(venue.id, range);
  const [events, setEvents] = useState<ISchedule[]>([]);

  const updateEvents = (data: any) => {
    console.log("colors", colors);

    const formatted =
      data?.bookings?.map((item: any, index: number) => ({
        id: item.id,
        color: colors[index],
        allDay: false,
        title: item?.customer?.name,
        category: "time",
        start: item.start_time,
        end: item.end_time,
        mobile: item?.customer?.mobile,
        amount: item.total_amount,
      })) ?? [];

    // recurring: {
    //   repeat: "daily",
    //   weekDays: "MO,TU,WE,TH,FR,SA,SU",
    // },

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
      />
      {/* <TuiCalendar
        events={events}
        setEvents={setEvents}
        createBooking={createBooking}
        refetch={refetch}
        isLoading={false}
        cancelBooking={cancelBooking}
        updateBooking={updateBooking}
        setRange={setRange}
      /> */}
    </div>
  );
};

export default BookingPage;
function mutate(): import("react").EffectCallback {
  throw new Error("Function not implemented.");
}

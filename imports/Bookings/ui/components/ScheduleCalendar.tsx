"use client";
import { useEffect, useMemo, useState } from "react";
import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createViewWeek } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";
import BookingForm from "./BookingForm";
import { Game } from "@/types/auth";
import { createEventModalPlugin } from "@schedule-x/event-modal";

type ScheduleCalendarProps = {
  game: Game;
};

const ScheduleCalendar = ({ game }: ScheduleCalendarProps) => {
  const [showModal, setShowModal] = useState(false);
  const eventsService = useMemo(() => createEventsServicePlugin(), []);

  const getEventColor = (game: Game) => {
    if (game.category === "Football") return "#4CAF50";
    if (game.category === "Cricket") return "#2196F3";
    if (game.category === "Basketball") return "#FF5722";
    return "#9E9E9E";
  };

  const formatTimeForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatForScheduleX = (dateString: string) => {
    const date = new Date(dateString);
    const pad = (num: number) => num.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const events = useMemo(() => {
    if (!game?.bookings) return [];
    return game.bookings.map((booking: any) => {
      const startTime = formatTimeForDisplay(booking.startTime);
      const endTime = formatTimeForDisplay(booking.endTime);

      return {
        id: booking.id,
        title: `${game.name}`,
        start: formatForScheduleX(booking.startTime),
        end: formatForScheduleX(booking.endTime),
        backgroundColor: getEventColor(game),
        description: `${startTime} - ${endTime}\n${game.description}`,
        location: game.address,
        extendedProps: {
          timeRange: `${startTime} - ${endTime}`,
        },
      };
    });
  }, [game]);

  const EventContent = ({ event }: { event: any }) => (
    <div className="flex flex-col p-1">
      <div className="font-medium">{event.title}</div>
      <div className="text-xs text-gray-600">
        {event.extendedProps.timeRange}
      </div>
    </div>
  );

  const calendar = useNextCalendarApp({
    views: [createViewWeek()],
    defaultView: "week",
    events: events,
    plugins: [eventsService, createEventModalPlugin()],
    // components: {
    //   event: EventContent,
    // },
    callbacks: {
      onEventClick: (clickedEvent) => {
        console.log("Event clicked:", clickedEvent);
      },
    },
  });

  useEffect(() => {
    if (calendar && events.length > 0) {
      calendar.events.set(events);
    }
  }, [events, calendar]);

  return (
    <div className="mt-4 h-[100vh]">
      <ScheduleXCalendar calendarApp={calendar} />
      {showModal && <BookingForm setShowModal={setShowModal} />}
    </div>
  );
};

export default ScheduleCalendar;

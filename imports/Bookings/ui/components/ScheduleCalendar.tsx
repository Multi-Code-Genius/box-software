"use client";
import { useEffect, useMemo, useState } from "react";
import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
  createViewMonthAgenda,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";
import BookingForm from "./BookingForm";
import { Game } from "@/types/auth";
import { getAllGames } from "../../api/api";
import { Frown } from "lucide-react";
import "@schedule-x/theme-default/dist/index.css";

import { createEventModalPlugin } from "@schedule-x/event-modal";
import { Label } from "@/components/ui/label";

type ScheduleCalendarProps = {
  game: Game;
};

const ScheduleCalendar = ({ game }: ScheduleCalendarProps) => {
  const [showModal, setShowModal] = useState(false);
  const eventsService = useMemo(() => createEventsServicePlugin(), []);
  const [games, setGames] = useState<Game[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getGames = async () => {
      try {
        const result = await getAllGames();
        console.log(result);
        setGames(result.games);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    getGames();
  }, []);

  const getEventColor = (game: Game) => {
    if (game.category === "Football") return "#4CAF50";
    if (game.category === "Ckicket") return "#2196F3";
    if (game.category === "Basketball") return "#FF5722";
    return "#9E9E9E";
  };

  const events = useMemo(() => {
    if (!games) return [];
    return games.flatMap(
      (game) =>
        game?.bookings?.map((booking: any) => ({
          id: booking.id,
          title: game.name,
          start: booking.startTime,
          end: booking.endTime,
          backgroundColor: getEventColor(game),
          description: game.description,
          location: game.address,
        })) || []
    );
  }, [games]);

  const calendar = useNextCalendarApp({
    views: [
      // createViewDay(),
      // createViewWeek(),
      createViewMonthGrid(),
      // createViewMonthAgenda(),
    ],
    defaultView: "month-grid",
    events: events,
    plugins: [eventsService, createEventModalPlugin()],
    callbacks: {
      onRender: () => {
        console.log("Calendar rendered with events:", events);
      },
    },
  });

  useEffect(() => {
    if (calendar && events.length > 0) {
      calendar.events.set(events);
    }
  }, [events, calendar]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-4 h-[100]">
      <ScheduleXCalendar calendarApp={calendar} />

      {showModal && <BookingForm setShowModal={setShowModal} />}
    </div>
  );
};

export default ScheduleCalendar;

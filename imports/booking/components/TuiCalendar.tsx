"use client";
import { Button } from "@/components/ui/button";
import { CreateBooking } from "@/types/vanue";
import moment from "moment";
import { useEffect, useRef } from "react";
import type { ISchedule } from "tui-calendar";
import Calendar from "tui-calendar";
import "tui-calendar/dist/tui-calendar.css";

const TuiCalendar = ({
  events,
  createBooking,
  refetch,
  isLoading,
  setEvents,
  cancelBooking,
  // updateBooking,
  setRange,
}: {
  events: ISchedule[];
  createBooking: (data: CreateBooking) => void;
  refetch: () => void;
  isLoading: boolean;
  setEvents: (events: ISchedule[]) => void;
  cancelBooking: (id: string) => void;
  // updateBooking: (id: string, data: UpdateBooking) => void;
  setRange: (range: { start: string; end: string }) => void;
}) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const calendarInstance = useRef<any>(null);

  useEffect(() => {
    if (calendarRef.current) {
      calendarInstance.current = new Calendar(calendarRef.current, {
        defaultView: "week",
        taskView: false,
        scheduleView: ["time"],
        useDetailPopup: true,
        useCreationPopup: true,
        template: {
          time: (schedule: ISchedule) => `<strong>${schedule.title}</strong>`,
        },
      });

      calendarInstance.current.createSchedules(events);
      const currentStartDate = calendarInstance.current.getDate().toDate();

      const dayOfWeek = currentStartDate.getDay();
      const difference = dayOfWeek === 0 ? 0 : -dayOfWeek;
      currentStartDate.setDate(currentStartDate.getDate() + difference);
      const currentEndDate = new Date(currentStartDate);
      currentEndDate.setDate(currentStartDate.getDate() + 6);
      const startDate = moment(currentStartDate).format("YYYY-MM-DD");
      const endDate = moment(currentEndDate).format("YYYY-MM-DD");

      setRange({ start: startDate, end: endDate });

      calendarInstance.current.on("beforeCreateSchedule", (event: any) => {
        const { start, end, title, location } = event;
        const newSchedule = {
          id: String(new Date().getTime()),
          calendarId: "1",
          title: title || "No Title",
          category: "time",
          start: start.toDate(),
          end: end.toDate(),
          location,
        };

        const startTime = moment(start.toDate()).format("hh:mm A");
        const endTime = moment(end.toDate()).format("hh:mm A");
        const date = moment(start.toDate()).format("YYYY-MM-DD");
        const gameId = localStorage.getItem("gameId");

        createBooking({
          name: title,
          number: location,
          startTime: startTime,
          endTime: endTime,
          totalAmount: 1220,
          gameId: gameId || "",
          nets: 2,
          date: date,
        });
        setEvents([...events, newSchedule]);

        calendarInstance.current.createSchedules([newSchedule]);
      });

      calendarInstance.current.on("beforeUpdateSchedule", (event: any) => {
        const { schedule, changes } = event;

        const updatedSchedule = {
          ...schedule,
          ...changes,
          start: changes.start?.toDate?.() || schedule.start,
          end: changes.end?.toDate?.() || schedule.end,
        };
        // const startTime = moment(updatedSchedule.start).format("hh:mm A");
        // const endTime = moment(updatedSchedule.end).format("hh:mm A");
        // const date = moment(updatedSchedule.start).format("YYYY-MM-DD");

        setEvents(
          events.map((item) =>
            item.id === schedule.id ? { ...item, ...updatedSchedule } : item
          )
        );

        calendarInstance.current.updateSchedule(
          schedule.id,
          schedule.calendarId,
          changes
        );

        // updateBooking(updatedSchedule.id, {
        //   startTime: startTime,
        //   endTime: endTime,
        //   date: date,
        // });
      });

      calendarInstance.current.on("beforeDeleteSchedule", (event: any) => {
        const { schedule } = event;

        cancelBooking(schedule.id);
        setEvents(events.filter((item) => item.id !== schedule.id));
        calendarInstance.current.deleteSchedule(
          schedule.id,
          schedule.calendarId
        );
      });

      const observer = new MutationObserver(() => {
        const subjectInput = document.querySelector<HTMLInputElement>(
          "#tui-full-calendar-schedule-title"
        );
        if (subjectInput) {
          subjectInput.placeholder = "Name";
          const subjectContainer = subjectInput.closest(
            ".tui-full-calendar-popup-section-item"
          );
          const icon = subjectContainer?.querySelector(
            ".tui-full-calendar-icon"
          );
          if (icon && icon.nextSibling?.nodeType === 3) {
            icon.nextSibling.textContent = "Name";
          }
        }

        const locationInput = document.querySelector<HTMLInputElement>(
          "#tui-full-calendar-schedule-location"
        );
        if (locationInput) {
          locationInput.placeholder = "Mobile";
          const locationContainer = locationInput.closest(
            ".tui-full-calendar-popup-section-item"
          );
          const icon = locationContainer?.querySelector(
            ".tui-full-calendar-icon"
          );
          if (icon && icon.nextSibling?.nodeType === 3) {
            icon.nextSibling.textContent = "Mobile";
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return () => {
        observer.disconnect();
        calendarInstance.current?.destroy();
      };
    }
  }, [events, isLoading, refetch, createBooking]);

  const handleNextWeek = () => calendarInstance.current?.next();
  const handlePrevWeek = () => calendarInstance.current?.prev();

  return (
    <div>
      <div className="flex justify-between py-4">
        <Button onClick={handlePrevWeek}>Previous Week</Button>
        <Button onClick={handleNextWeek}>Next Week</Button>
      </div>
      <div ref={calendarRef} />
    </div>
  );
};

export default TuiCalendar;

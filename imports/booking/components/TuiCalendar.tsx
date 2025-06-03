"use client";
import { useVenues } from "@/api/vanue";
import { Button } from "@/components/ui/button";
import { useVenueStore } from "@/store/venueStore";
import { CreateBooking, UpdateBooking } from "@/types/vanue";
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
  updateBooking,
  setRange,
}: {
  events: ISchedule[];
  createBooking: (data: CreateBooking) => void;
  refetch: () => void;
  isLoading: boolean;
  setEvents: (events: ISchedule[]) => void;
  cancelBooking: (id: string) => void;
  updateBooking: (input: { id: string; data: UpdateBooking }) => void;
  setRange: (range: { start: string; end: string }) => void;
}) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const calendarInstance = useRef<any>(null);
  const { data: venues } = useVenues();

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
        console.log(title);

        const newSchedule = {
          id: String(new Date().getTime()),
          calendarId: "1",
          title: title || "No Title",
          category: "time",
          start: start.toDate(),
          end: end.toDate(),
          location,
        };

        console.log(newSchedule, "newSchedule");

        const startTime = start.toDate().toISOString();
        const endTime = end.toDate().toISOString();
        const date = moment(start.toDate()).toISOString();

        const venueId = Number(localStorage.getItem("venueId"));

        const selectedVenue = venues?.venues.find(
          (g) => Number(g.id) === venueId
        );

        const hourlyPrice = selectedVenue?.hourly_price || 0;
        const bookedGrounds = selectedVenue?.grounds || 0;

        createBooking({
          name: newSchedule.title,
          phone: location,
          startTime,
          endTime,
          date,
          totalAmount: Number(hourlyPrice),
          venueId,
          bookedGrounds: Number(bookedGrounds),
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
          location: changes.location || schedule.location,
        };
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

        const venueId = Number(localStorage.getItem("venueId"));

        const selectedVenue = venues?.venues.find(
          (g) => Number(g.id) === venueId
        );

        const hourlyPrice = selectedVenue?.hourly_price || 0;
        const bookedGround = selectedVenue?.grounds || 0;

        updateBooking({
          id: updatedSchedule.id,
          data: {
            startTime: new Date(updatedSchedule.start).toISOString(),
            endTime: new Date(updatedSchedule.end).toISOString(),
            date: new Date(updatedSchedule.start).toISOString(),
            name: updatedSchedule.title,
            bookedGrounds: Number(bookedGround),
            totalAmount: hourlyPrice,
            phone: updatedSchedule.location || "",
          },
        });
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

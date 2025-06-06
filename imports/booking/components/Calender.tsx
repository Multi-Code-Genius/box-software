"use client";
import {
  colors,
  dateInputProps,
  dayInputProps,
  days,
  monthInputProps,
  months,
  ordinalList,
  repeatedData,
  responsivePopup,
  selectResponsive,
  viewSettings,
} from "@/constant/content";
import { useGetWeekDayNum } from "@/hooks/useGetWeekDayNum";
import {
  Button,
  Datepicker,
  Eventcalendar,
  formatDate,
  Input,
  MbscCalendarEvent,
  MbscDatepickerChangeEvent,
  MbscDatepickerControl,
  MbscDatepickerOptions,
  MbscDateType,
  MbscEventClickEvent,
  MbscEventCreatedEvent,
  MbscEventCreateEvent,
  MbscEventCreateFailedEvent,
  MbscEventDeletedEvent,
  MbscEventUpdateEvent,
  MbscEventUpdateFailedEvent,
  MbscPageLoadingEvent,
  MbscPopupButton,
  MbscPopupOptions,
  MbscRecurrenceRule,
  MbscResponsiveOptions,
  MbscSelectChangeEvent,
  MbscSelectedDateChangeEvent,
  Popup,
  Radio,
  RadioGroup,
  SegmentedGroup,
  SegmentedItem,
  Select,
  setOptions,
  Snackbar,
  Textarea,
  Toast,
  updateRecurringEvent,
} from "@mobiscroll/react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import moment from "moment";
import { useTheme } from "next-themes";
import { ISchedule } from "tui-calendar";
import { CreateBooking, UpdateBooking } from "@/types/vanue";
import {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

declare module "@mobiscroll/react";

const now = new Date();
const today = new Date(now.setMinutes(59));
const yesterday = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate() - 1
);

const getWeekDayNum = useGetWeekDayNum;

interface CalendarProps {
  events: ISchedule[];
  createBooking: (data: CreateBooking) => void;
  refetch: () => void;
  isLoading: boolean;
  setEvents: (events: ISchedule[]) => void;
  cancelBooking: (id: string) => void;
  updateBooking: (input: { id: string; data: UpdateBooking }) => void;
  setRange: (range: { start: string; end: string }) => void;
}

const Calender: FC<CalendarProps> = ({
  events,
  createBooking,
  refetch,
  isLoading,
  setEvents,
  cancelBooking,
  updateBooking,
  setRange,
}) => {
  const [myEvents, setMyEvents] = useState<MbscCalendarEvent[]>([]);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (events.length > 0) {
      setMyEvents(events);
    }
  }, [events]);

  setOptions({
    theme: "ios",
    themeVariant: resolvedTheme,
  });
  const [tempEvent, setTempEvent] = useState<MbscCalendarEvent>();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [anchor, setAnchor] = useState<HTMLElement>();
  const [start, startRef] = useState<Input | null>(null);
  const [end, endRef] = useState<Input | null>(null);
  const [popupEventTitle, setTitle] = useState<string | undefined>("");
  const [popupEventAmount, setAmount] = useState<string | undefined>("");
  const [popupEventDescription, setDescription] = useState<string>("");
  const [popupEventAllDay, setAllDay] = useState<boolean>(true);
  const [popupEventDate, setDate] = useState<MbscDateType[]>([]);
  const [mySelectedDate, setSelectedDate] = useState<MbscDateType>();
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [isToastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const colorPicker = useRef<Popup>(null);

  const [repeatData, setRepeatData] = useState(repeatedData);
  const [selectedRepeat, setSelectedRepeat] = useState<string>("norepeat");
  const [repeatType, setRepeatType] = useState<
    "daily" | "weekly" | "monthly" | "yearly" | undefined
  >("daily");
  const [repeatNr, setRepeatNr] = useState<number>(1);
  const [condition, setCondition] = useState<string>("never");
  const [untilDate, setUntilDate] = useState<string>();
  const [occurrences, setOccurrences] = useState<number>(10);
  const [selectedMonth, setMonth] = useState<number>(1);
  const [monthlyDays, setMonthlyDays] = useState<number[]>([1]);
  const [monthlyDay, setMonthlyDay] = useState<number>(1);
  const [yearlyDays, setYearlyDays] = useState<number[]>([1]);
  const [yearlyDay, setYearlyDay] = useState<number>(1);
  const [weekDays, setWeekDays] = useState<string[]>(["SU"]);
  const [colorPickerOpen, setColorPickerOpen] = useState<boolean>(false);
  const [colorAnchor, setColorAnchor] = useState<HTMLElement>();
  const [selectedColor, setSelectedColor] = useState("");
  const [tempColor, setTempColor] = useState<string>("");
  const [originalRecurringEvent, setOriginalRecurringEvent] =
    useState<MbscCalendarEvent>();
  const [eventOccurrence, setEventOccurrence] = useState<MbscCalendarEvent>();
  const [recurringText, setRecurringText] = useState<string>();
  const [recurringDelete, setRecurringDelete] = useState<boolean>();
  const [isRecurringEditOpen, setRecurringEditOpen] = useState<boolean>();
  const [newEvent, setNewEvent] = useState<MbscCalendarEvent>();
  const [recurringEditMode, setRecurringEditMode] = useState<
    "all" | "current" | "following"
  >("current");
  const [editFromPopup, setEditFromPopup] = useState<boolean>(false);

  const [undoEvent, setUndoEvent] = useState<MbscCalendarEvent | null>(null);
  const venueId = Number(localStorage.getItem("venueId"));

  const colorButtons = useMemo<(string | MbscPopupButton)[]>(
    () => [
      "cancel",
      {
        text: "Set",
        keyCode: "enter",
        handler: () => {
          setSelectedColor(tempColor);
          setColorPickerOpen(false);
        },
        cssClass: "mbsc-popup-button-primary",
      },
    ],
    [tempColor]
  );

  const handlePageLoading = (args: MbscPageLoadingEvent) => {
    const start = moment(args.firstDay).format("YYYY-MM-DD");
    const end = moment(args.lastDay).format("YYYY-MM-DD");
    console.log("Current view week:", start, "to", end);
    setRange({ start, end });
  };

  const handleEventCreateFailed = useCallback(
    (args: MbscEventCreateFailedEvent) => {
      if (!args.originEvent) {
        setToastMessage("Can't create event in the past");
        setToastOpen(true);
      }
    },
    []
  );

  const handleEventUpdateFailed = useCallback(
    (args: MbscEventUpdateFailedEvent) => {
      if (!args.oldEventOccurrence) {
        setToastMessage("Can't move event in the past");
        setToastOpen(true);
      }
    },
    []
  );

  const handleCloseToast = useCallback(() => {
    setToastOpen(false);
  }, []);
  const myInvalid = useMemo(
    () => [
      {
        recurring: {
          repeat: "daily",
          until: yesterday,
        },
      },
      {
        start: yesterday,
        end: today,
      },
    ],
    []
  );

  const colorResponsive: MbscResponsiveOptions<MbscPopupOptions> = useMemo(
    () => ({
      medium: {
        display: "anchored",
        touchUi: false,
        buttons: [],
      },
    }),
    []
  );

  // Set custom values to default
  const resetCustomValues = useCallback(() => {
    setRepeatType("daily");
    setRepeatNr(1);
    setCondition("never");
    setOccurrences(10);
    setMonth(1);
    setMonthlyDay(1);
    setYearlyDay(1);
    setWeekDays(["SU"]);
    setSelectedRepeat("norepeat");
    setRepeatData(repeatData.filter((item) => item.value !== "custom-value"));
  }, [repeatData]);

  const snackbarButton = useMemo(
    () => ({
      action: () => {
        setMyEvents((prevEvents) => [...prevEvents, undoEvent!]);
      },
      text: "Undo",
    }),
    [undoEvent]
  );

  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  const navigateTo = useCallback(() => {
    const rec = tempEvent!.recurring;
    const d = new Date(tempEvent!.start as string);
    let nextYear = 0;

    // Navigate the calendar to the correct view
    if (rec && rec.repeat === "yearly") {
      if (d.getMonth() + 1 > +rec.month! && d.getDay() > +rec.day!) {
        nextYear = 1;
      }
      setSelectedDate(
        new Date(d.getFullYear() + nextYear, +rec.month! - 1, +rec.day!)
      );
    } else {
      setSelectedDate(d);
    }
  }, [tempEvent]);

  const selectColor = useCallback((color: string) => {
    setTempColor(color);
  }, []);

  const changeColor = useCallback(
    (ev: MouseEvent<HTMLDivElement>) => {
      const color = ev.currentTarget.getAttribute("data-value")!;
      selectColor(color);
      if (!colorPicker.current!.s.buttons!.length) {
        setSelectedColor(color);
        setColorPickerOpen(false);
      }
    },
    [selectColor, setSelectedColor]
  );

  const openColorPicker = useCallback(
    (ev: MouseEvent<HTMLDivElement>) => {
      selectColor(selectedColor || "");
      setColorAnchor(ev.currentTarget);
      setColorPickerOpen(true);
    },
    [selectColor, selectedColor]
  );

  const deleteRecurringEvent = useCallback(() => {
    switch (recurringEditMode) {
      case "current": {
        let currentExceptions =
          (tempEvent!.recurringException as Array<string | object | Date>) ||
          [];
        currentExceptions = [...currentExceptions, tempEvent!.start!];

        const newEv = {
          ...originalRecurringEvent,
          recurringException: currentExceptions,
        };
        const index = myEvents.findIndex(
          (x) => x.id === originalRecurringEvent!.id
        );
        const newEventList = [...myEvents];

        newEventList.splice(index, 1, newEv);
        setMyEvents(newEventList);
        break;
      }
      case "following": {
        let exceptions = tempEvent!.recurringException || [];
        exceptions = [
          ...(exceptions as Array<string | object | Date>),
          tempEvent!.start,
        ];

        const newE = {
          ...originalRecurringEvent,
          recurringException: exceptions,
        };
        (newE.recurring as MbscRecurrenceRule).until = tempEvent!.start;
        const i = myEvents.findIndex(
          (x) => x.id === originalRecurringEvent!.id
        );
        const newEvList = [...myEvents];

        newEvList.splice(i, 1, newE);
        setMyEvents(newEvList);
        break;
      }
      case "all":
        setMyEvents(myEvents.filter((item) => item.id !== tempEvent!.id));
        break;
    }
    setOpen(false);
    setRecurringEditOpen(false);
  }, [myEvents, originalRecurringEvent, recurringEditMode, tempEvent]);

  const getCustomRule = useCallback(() => {
    let recurringRule: MbscRecurrenceRule = {};
    const d = editFromPopup
      ? (popupEventDate[0] as Date)
      : new Date(tempEvent!.start as string);
    const weekday = d.getDay();
    const monthday = d.getDate();
    const weekNr = getWeekDayNum(d);

    if (editFromPopup && tempEvent!.start && tempEvent!.recurring) {
      switch (selectedRepeat) {
        default:
        case "daily":
          recurringRule = {
            repeat: "daily",
          };
          break;
        case "weekly":
          recurringRule = {
            repeat: "weekly",
            weekDays: days[weekday].short,
          };
          break;
        case "monthly":
          recurringRule = {
            repeat: "monthly",
            day: monthday,
          };
          break;
        case "monthly-pos":
          recurringRule = {
            repeat: "monthly",
            weekDays: days[weekday].short,
            pos: weekNr,
          };
          break;
        case "yearly":
          recurringRule = {
            repeat: "yearly",
            day: monthday,
            month: d.getMonth() + 1,
          };
          break;
        case "yearly-pos":
          setTempEvent((e) => ({
            ...e,
            recurring: {
              repeat: "yearly",
              month: d.getMonth() + 1,
              weekDays: days[weekday].short,
              pos: weekNr,
            },
          }));
          break;
      }
    } else {
      switch (selectedRepeat) {
        case "daily":
          recurringRule = { repeat: "daily" };
          break;
        case "weekly":
          recurringRule = {
            repeat: "weekly",
            weekDays: days[d.getDay()].short,
          };
          break;
        case "monthly":
          recurringRule = { repeat: "monthly", day: d.getDate() };
          break;
        case "monthly-pos":
          recurringRule = {
            repeat: "monthly",
            weekDays: days[weekday].short,
            pos: weekNr,
          };
          break;
        case "yearly":
          recurringRule = { repeat: "yearly", month: d.getMonth() + 1 };
          break;
        case "yearly-pos":
          recurringRule = {
            repeat: "yearly",
            month: d.getMonth() + 1,
            weekDays: days[weekday].short,
            pos: weekNr,
          };
          break;
        case "weekday":
          recurringRule = { repeat: "weekly", weekDays: "MO,TU,WE,TH,FR" };
          break;
        case "custom":
        case "custom-value":
          recurringRule = {
            repeat: repeatType,
            interval: repeatNr,
          };

          switch (repeatType) {
            case "weekly":
              recurringRule.weekDays = weekDays.join(",");
              break;
            case "monthly":
              recurringRule.day = monthlyDay;
              break;
            case "yearly":
              recurringRule.day = yearlyDay;
              recurringRule.month = selectedMonth;
              break;

            default:
          }

          switch (condition) {
            case "until":
              recurringRule.until = untilDate;
              break;
            case "count":
              recurringRule.count = occurrences;
              break;
            default:
          }
          break;
        default:
      }
    }
    return recurringRule;
  }, [
    editFromPopup,
    popupEventDate,
    tempEvent,
    selectedRepeat,
    repeatType,
    repeatNr,
    condition,
    weekDays,
    monthlyDay,
    yearlyDay,
    selectedMonth,
    untilDate,
    occurrences,
  ]);

  const saveEvent = useCallback(() => {
    const newEv = {
      id: tempEvent!.id ? String(tempEvent!.id) : "",
      title: popupEventTitle,
      amount: popupEventAmount,
      description: popupEventDescription,
      start: popupEventDate[0],
      end: popupEventDate[1],
      allDay: popupEventAllDay,
      color: tempColor,
      recurring: getCustomRule(),
    };

    if (isEdit) {
      // Update the event in the list
      const index = myEvents.findIndex((x) => x.id === tempEvent!.id);
      const newEventList = [...myEvents];

      newEventList.splice(index, 1, newEv);
      setMyEvents(newEventList);

      updateBooking({
        id: tempEvent!.id ? String(tempEvent!.id) : "",
        data: {
          startTime:
            tempEvent!.start &&
            (typeof tempEvent!.start === "string" ||
              tempEvent!.start instanceof Date)
              ? new Date(tempEvent!.start).toISOString()
              : "",
          endTime:
            tempEvent!.end &&
            (typeof tempEvent!.end === "string" ||
              tempEvent!.end instanceof Date)
              ? new Date(tempEvent!.end).toISOString()
              : "",
          date:
            tempEvent!.date &&
            (typeof tempEvent!.date === "string" ||
              tempEvent!.date instanceof Date)
              ? new Date(tempEvent!.date).toISOString()
              : "2025-06-06T00:00:00Z",
          name: newEv!.title || "",
          bookedGrounds: Number(2),
          totalAmount: Number(tempEvent!.amount),
          phone: tempEvent!.mobile,
        },
      });
    } else {
      const localDate = new Date(popupEventDate[0] as Date);
      const result = moment(localDate).format("YYYY-MM-DD");
      const utcMidnight = moment.utc(result).format("YYYY-MM-DD[T]00:00:00[Z]");

      createBooking({
        name: popupEventTitle || "",
        phone: popupEventDescription,
        startTime: moment(popupEventDate[0] as Date)
          .utc()
          .format("YYYY-MM-DDTHH:mm:ss[Z]"),

        endTime: moment(popupEventDate[1] as Date)
          .utc()
          .format("YYYY-MM-DDTHH:mm:ss[Z]"),
        date: utcMidnight,
        totalAmount: Number(popupEventAmount),
        venueId: venueId,
        bookedGrounds: Number(2),
      });

      setMyEvents([...myEvents, newEv]);
    }

    if (newEv.recurring && Object.keys(newEv.recurring).length === 0) {
      delete (newEv as any).recurring;
    }

    navigateTo();
    // Close the popup
    setOpen(false);
  }, [
    tempEvent,
    popupEventTitle,
    popupEventDescription,
    popupEventDate,
    popupEventAllDay,
    getCustomRule,
    isEdit,
    navigateTo,
    myEvents,
    tempColor,
    popupEventAmount,
    createBooking,
    updateBooking,
    venueId,
  ]);

  const deleteEvent = useCallback(
    (event: MbscCalendarEvent) => {
      setMyEvents(myEvents.filter((item) => item.id !== event.id));
      setUndoEvent(event);
      setTimeout(() => {
        setSnackbarOpen(true);
      });
    },
    [myEvents]
  );

  const updateOptionDates = useCallback(
    (d: Date) => {
      const weekday = d.getDay();
      const monthday = d.getDate();
      const newData = repeatData.slice(0);
      const weekNr = getWeekDayNum(d);

      for (let i = 0; i < newData.length; ++i) {
        const item = newData[i];
        switch (item.value) {
          case "weekly":
            item.text = "Weekly on " + days[weekday].name;
            break;
          case "monthly":
            item.text = "Monthly on day " + monthday;
            break;
          case "monthly-pos":
            item.text =
              "Monthly on the " +
              ordinalList[weekNr] +
              " " +
              days[weekday].name;
            break;
          case "yearly":
            item.text =
              "Annually on " + months[d.getMonth()].text + " " + monthday;
            break;
          case "yearly-pos":
            item.text =
              "Annually on the " +
              ordinalList[weekNr] +
              " " +
              days[weekday].name +
              " of " +
              months[d.getMonth()];
            break;
          default:
        }
      }
      setRepeatData(newData);
    },
    [repeatData]
  );

  const loadPopupForm = useCallback(
    (event: MbscCalendarEvent) => {
      const startDate = new Date(event.start as string);
      setTitle(event.title);
      setAmount(event.amount);
      setDescription(event.description);
      setDate([startDate, new Date(event.end as string)]);
      setUntilDate(
        formatDate(
          "YYYY-MM-DD",
          new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate() + 1
          )
        )
      );
      setAllDay(event.allDay || false);

      const d = new Date(event.start as string);
      const weekday = d.getDay();
      const monthday = d.getDate();
      const newData = repeatData.slice(0);
      const weekNr = getWeekDayNum(d);

      // Update select texts by selected date
      for (let i = 0; i < newData.length; ++i) {
        const item = newData[i];
        switch (item.value) {
          case "weekly":
            item.text = "Weekly on " + days[weekday].name;
            break;
          case "monthly":
            item.text = "Monthly on day " + monthday;
            break;
          case "monthly-pos":
            item.text =
              "Monthly on the " +
              ordinalList[weekNr] +
              " " +
              days[weekday].name;
            break;
          case "yearly":
            item.text =
              "Annually on " + months[d.getMonth()].text + " " + monthday;
            break;
          case "yearly-pos":
            item.text =
              "Annually on the " +
              ordinalList[weekNr] +
              " " +
              days[weekday].name +
              " of " +
              months[d.getMonth()];
            break;
          default:
        }
      }

      setRepeatData(newData);

      const rec = event.recurring as MbscRecurrenceRule;

      if (rec) {
        setRepeatType(rec.repeat);
        setWeekDays(
          rec.repeat === "weekly" ? rec.weekDays!.split(",") : ["SU"]
        );
        if (rec.interval) {
          // Set custom text
          let customText = "";
          const nr = rec.interval;

          setRepeatNr(nr);

          switch (rec.repeat) {
            case "daily":
              customText = nr > 1 ? "Every " + nr + " days" : "Daily";
              break;
            case "weekly":
              customText = nr > 1 ? "Every " + nr + " weeks" : "Weekly";
              customText += " on " + rec.weekDays;
              break;
            case "monthly":
              setMonthlyDay(rec.day as number);
              customText = nr > 1 ? "Every " + nr + " months" : "Monthly";
              customText += " on day " + rec.day;
              break;
            case "yearly":
              setYearlyDay(rec.day as number);
              setMonth(rec.month as number);
              customText = nr > 1 ? "Every " + nr + " years" : "Annualy";
              customText +=
                " on " + months[+rec.month! - 1].text + " " + rec.day;
              break;
            default:
          }

          if (rec.until) {
            setCondition("until");
            setUntilDate(rec.until as string);
            customText +=
              " until " +
              formatDate("MMMM D, YYYY", new Date(rec.until as string));
          } else if (rec.count) {
            setCondition("count");
            setOccurrences(rec.count);
            customText += ", " + rec.count + " times";
          } else {
            setCondition("never");
          }

          // Add custom value
          setRepeatData([
            ...repeatData,
            { value: "custom-value", text: customText },
          ]);
          // Set custom value
          setSelectedRepeat("custom-value");
        } else if (rec.weekDays === "MO,TU,WE,TH,FR") {
          setSelectedRepeat("weekday");
        } else {
          setSelectedRepeat(rec.repeat + (rec.pos ? "-pos" : ""));
        }
      } else {
        resetCustomValues();
      }
    },
    [repeatData, resetCustomValues]
  );

  // Handle popup form changes

  const titleChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setTitle(ev.target.value);
  }, []);
  const amountChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setAmount(ev.target.value);
  }, []);

  const descriptionChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setDescription(ev.target.value);
  }, []);

  const dateChange = useCallback(
    (args: MbscDatepickerChangeEvent) => {
      const d = args.value as Date[];
      setDate(d);
      updateOptionDates(d[0]);
    },
    [updateOptionDates]
  );

  const onDeleteClick = useCallback(() => {
    if (tempEvent!.recurring) {
      setRecurringText("Delete");
      setRecurringDelete(true);
      setRecurringEditOpen(true);
    } else {
      deleteEvent(tempEvent!);
      setOpen(false);
    }
  }, [deleteEvent, tempEvent]);

  // Populate data for months
  const populateMonthDays = useCallback(
    (month: number, type: string) => {
      const day30 = [2, 4, 6, 9, 11];
      const newValues = [];

      for (let i = 1; i <= 31; i++) {
        if (
          !(i === 31 && day30.includes(month)) &&
          !(i === 30 && month === 2)
        ) {
          newValues.push(i);
        }
      }

      if (type === "monthly") {
        setMonthlyDays(newValues);
        setMonthlyDay(1);
      } else {
        setYearlyDays(newValues);
        setYearlyDay(1);
      }
    },
    [setMonthlyDays, setYearlyDays]
  );

  const repeatChange = useCallback((ev: MbscSelectChangeEvent) => {
    setSelectedRepeat(ev.value);
  }, []);

  const repeatTypeChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setRepeatType(ev.target.value as "daily" | "weekly" | "monthly" | "yearly");
  }, []);

  const repeatNrChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setRepeatNr(+ev.target.value);
  }, []);

  const conditionChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setCondition(ev.target.value);
  }, []);

  const untilDateChange = useCallback((ev: MbscDatepickerChangeEvent) => {
    setUntilDate(ev.value as string);
  }, []);

  const occurrancesChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    setOccurrences(+ev.target.value);
  }, []);

  const monthsChange = useCallback(
    (ev: MbscSelectChangeEvent) => {
      setMonth(ev.value);
      populateMonthDays(ev.value, "yearly");
    },
    [populateMonthDays]
  );

  const monthlyDayChange = useCallback((ev: MbscSelectChangeEvent) => {
    setMonthlyDay(ev.value);
  }, []);

  const yearlyDayChange = useCallback((ev: MbscSelectChangeEvent) => {
    setYearlyDay(ev.value);
  }, []);

  const weekDayChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      const value = ev.target.value;
      if (ev.target.checked) {
        setWeekDays([...weekDays, ev.target.value]);
      } else {
        setWeekDays(weekDays.filter((item) => item !== value));
      }
    },
    [weekDays]
  );

  // Scheduler options

  const handleSelectedDateChange = useCallback(
    (event: MbscSelectedDateChangeEvent) => {
      setSelectedDate(event.date);
    },
    []
  );

  const handleEventClick = useCallback(
    (args: MbscEventClickEvent) => {
      const oldEvent = args.event;
      const start = oldEvent && oldEvent.start ? oldEvent.start : null;

      // Handle recurring events
      if (start && start < now) {
        setToastMessage("Can't move past event");
        setToastOpen(true);
        return false;
      }

      const event = args.event;

      setEdit(true);
      setTempEvent({ ...args.event });

      // Recurring event
      if (event.recurring) {
        setOriginalRecurringEvent(event.original);
        setEventOccurrence({ ...event });
        loadPopupForm(event);
      } else {
        setOriginalRecurringEvent({});
        loadPopupForm(event);
      }

      setAnchor(args.domEvent.target);
      setOpen(true);
    },
    [loadPopupForm]
  );

  const handleEventUpdate = useCallback((args: MbscEventUpdateEvent) => {
    const oldEvent = args.oldEvent;
    const start = oldEvent && oldEvent.start ? oldEvent.start : null;
    const oldEventOccurrence = args.oldEventOccurrence;
    const occurrenceStart =
      oldEventOccurrence && oldEventOccurrence.start
        ? oldEventOccurrence.start
        : null;

    if ((start && start < now) || (occurrenceStart && occurrenceStart < now)) {
      return false;
    }

    const event = args.event;

    if (event.recurring) {
      setOriginalRecurringEvent(args.oldEvent);
      setTempEvent(event);
      setEventOccurrence(args.oldEventOccurrence);
      if (args.domEvent.keyCode === 46) {
        setRecurringText("Delete");
        setRecurringDelete(true);
        setRecurringEditOpen(true);
      } else {
        setRecurringText("Edit");
        setRecurringDelete(false);
        setRecurringEditOpen(true);
      }
      return false;
    }
  }, []);

  const handleEventCreate = useCallback((args: MbscEventCreateEvent) => {
    const originEvent = args.originEvent;
    if (originEvent && originEvent.recurring) {
      setNewEvent(args.event);
      return false;
    }
  }, []);

  const handleEventCreated = useCallback(
    (args: MbscEventCreatedEvent) => {
      setEdit(false);
      resetCustomValues();
      setTempEvent(args.event);
      // Fill popup form with event data
      loadPopupForm(args.event);
      setAnchor(args.target);
      // Open the popup
      setOpen(true);
    },
    [loadPopupForm, resetCustomValues]
  );

  const handleEventDeleted = useCallback(
    (args: MbscEventDeletedEvent) => {
      deleteEvent(args.event);
    },
    [deleteEvent]
  );

  const handleEventUpdated = useCallback((args: MbscEventUpdateEvent) => {
    const tempEvent = args.event;

    updateBooking({
      id: tempEvent!.id ? String(tempEvent!.id) : "",
      data: {
        startTime:
          tempEvent!.start &&
          (typeof tempEvent!.start === "string" ||
            tempEvent!.start instanceof Date)
            ? new Date(tempEvent!.start).toISOString()
            : "",
        endTime:
          tempEvent!.end &&
          (typeof tempEvent!.end === "string" || tempEvent!.end instanceof Date)
            ? new Date(tempEvent!.end).toISOString()
            : "",
        date:
          tempEvent!.date &&
          (typeof tempEvent!.date === "string" ||
            tempEvent!.date instanceof Date)
            ? new Date(tempEvent!.date).toISOString()
            : "2025-06-06T00:00:00Z",
        name: tempEvent!.title || "",
        bookedGrounds: Number(2),
        totalAmount: Number(tempEvent!.amount),
        phone: tempEvent!.mobile,
      },
    });
  }, []);

  // Datepicker options
  const controls = useMemo<MbscDatepickerControl[]>(
    () => (popupEventAllDay ? ["calendar"] : ["calendar", "time"]),
    [popupEventAllDay]
  );
  const respSetting: MbscResponsiveOptions<MbscDatepickerOptions> = useMemo(
    () =>
      popupEventAllDay
        ? {
            xsmall: {
              controls: ["date"],
            },
            medium: {
              controls: ["calendar"],
              touchUi: false,
            },
          }
        : {
            xsmall: {
              controls: ["datetime"],
            },
            medium: {
              controls: ["calendar", "time"],
              touchUi: false,
            },
          },
    [popupEventAllDay]
  );

  // Popup options
  const headerText = useMemo(
    () => (isEdit ? "Edit Booking" : "New Booking"),
    [isEdit]
  );
  const popupButtons = useMemo<(string | MbscPopupButton)[]>(() => {
    if (isEdit) {
      return [
        "cancel",
        {
          handler: () => {
            if (Object.keys(originalRecurringEvent!).length !== 0) {
              setEditFromPopup(true);
              setRecurringText("Edit");
              setRecurringDelete(false);
              setRecurringEditOpen(true);
            } else {
              saveEvent();
            }
          },
          keyCode: "enter",
          text: "Save",
          cssClass: "mbsc-popup-button-primary",
        },
      ];
    } else {
      return [
        "cancel",
        {
          handler: () => {
            saveEvent();
          },
          keyCode: "enter",
          text: "Add",
          cssClass: "mbsc-popup-button-primary",
        },
      ];
    }
  }, [isEdit, originalRecurringEvent, saveEvent]);

  const onPopupClose = useCallback(() => {
    setRepeatData(repeatData.filter((item) => item.value !== "custom-value"));
    if (!isEdit) {
      // Refresh the list, if add popup was canceled, to remove the temporary event
      setMyEvents([...myEvents]);
    }
    setEditFromPopup(false);
    setOpen(false);
  }, [isEdit, myEvents, repeatData]);

  const recurringEditButtons = useMemo<(string | MbscPopupButton)[]>(
    () => [
      "cancel",
      {
        handler: () => {
          if (recurringDelete) {
            deleteRecurringEvent();
          } else {
            if (editFromPopup) {
              tempEvent!.title = popupEventTitle;
              tempEvent!.title = popupEventAmount;

              tempEvent!.description = popupEventDescription;
              tempEvent!.start = popupEventDate[0];
              tempEvent!.end = popupEventDate[1];
              tempEvent!.allDay = popupEventAllDay;
              tempEvent!.recurring = getCustomRule();
            }

            if (recurringEditMode === "current") {
              delete tempEvent!.id;
              delete tempEvent!.recurring;
              delete tempEvent!.recurringException;
            }

            const events = updateRecurringEvent(
              originalRecurringEvent!,
              eventOccurrence!,
              editFromPopup ? null : newEvent!,
              editFromPopup ? tempEvent! : null,
              recurringEditMode
            );

            // Update event
            let newEventList = [...myEvents];
            const index = newEventList.findIndex(
              (x) => x.id === events.updatedEvent.id
            );
            newEventList[index] = events.updatedEvent;

            // Add new event
            if (events.newEvent) {
              newEventList = [...newEventList, events.newEvent];
            }

            setMyEvents(newEventList);

            setOpen(false);
            setRecurringEditOpen(false);
          }
        },
        keyCode: "enter",
        text: "Ok",
        cssClass: "mbsc-popup-button-primary",
      },
    ],
    [
      deleteRecurringEvent,
      editFromPopup,
      eventOccurrence,
      getCustomRule,
      myEvents,
      newEvent,
      originalRecurringEvent,
      popupEventAllDay,
      popupEventDate,
      popupEventDescription,
      popupEventTitle,
      popupEventAmount,
      recurringDelete,
      recurringEditMode,
      tempEvent,
    ]
  );

  const recurringEditModeChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      setRecurringEditMode(ev.target.value as "all" | "current" | "following");
    },
    []
  );

  const onRecurringEditClose = useCallback(() => {
    setRecurringEditMode("current");
    setRecurringEditOpen(false);
  }, []);

  useEffect(() => {
    populateMonthDays(1, "monthly");
    setMonthlyDay(1);
    populateMonthDays(1, "yearly");
    setYearlyDay(1);
  }, [populateMonthDays]);

  return (
    <div>
      <Eventcalendar
        className="md-disallow-past-event-creation"
        view={viewSettings}
        data={myEvents}
        clickToCreate="double"
        dragToCreate={true}
        dragToMove={true}
        dragToResize={true}
        selectedDate={mySelectedDate}
        onSelectedDateChange={handleSelectedDateChange}
        onEventClick={handleEventClick}
        onEventUpdate={handleEventUpdate}
        onEventCreate={handleEventCreate}
        onEventCreated={handleEventCreated}
        onEventDeleted={handleEventDeleted}
        onEventUpdated={handleEventUpdated}
        onEventCreateFailed={handleEventCreateFailed}
        onEventUpdateFailed={handleEventUpdateFailed}
        invalid={myInvalid}
        onPageLoading={handlePageLoading}
      />
      <Toast
        isOpen={isToastOpen}
        message={toastMessage}
        onClose={handleCloseToast}
      />
      <Popup
        display="bottom"
        contentPadding={false}
        fullScreen={true}
        scrollLock={false}
        height={500}
        headerText={headerText}
        anchor={anchor}
        buttons={popupButtons}
        isOpen={isOpen}
        onClose={onPopupClose}
        responsive={responsivePopup}
        cssClass="md-recurring-event-editor-popup"
      >
        <div className="">
          <Input
            label="Name"
            value={popupEventTitle === "New event" ? "" : popupEventTitle}
            onChange={titleChange}
          />
          <Textarea
            label="Mobile No"
            value={popupEventDescription}
            onChange={descriptionChange}
          />
        </div>
        <div className="">
          <Input ref={startRef} label="Starts" />
          <Input ref={endRef} label="Ends" />
          <Datepicker
            select="range"
            controls={controls}
            touchUi={true}
            startInput={start}
            endInput={end}
            showRangeLabels={false}
            responsive={respSetting}
            onChange={dateChange}
            value={popupEventDate}
          />
          <Select
            data={repeatData}
            label="Repeats"
            value={selectedRepeat}
            responsive={selectResponsive}
            onChange={repeatChange}
          />

          <Input
            label="Total Amount"
            value={popupEventAmount}
            onChange={amountChange}
          />
          <div onClick={openColorPicker} className="event-color-c">
            <div className="event-color-label">Color</div>
            <div
              className="event-color"
              style={{ background: selectedColor }}
            ></div>
          </div>
        </div>
        <div className="mbsc-form-group">
          {(selectedRepeat === "custom" ||
            selectedRepeat === "custom-value") && (
            <div>
              <div>
                <SegmentedGroup onChange={repeatTypeChange}>
                  <SegmentedItem value="daily" checked={repeatType === "daily"}>
                    Daily
                  </SegmentedItem>
                  <SegmentedItem
                    value="weekly"
                    checked={repeatType === "weekly"}
                  >
                    Weekly
                  </SegmentedItem>
                  <SegmentedItem
                    value="monthly"
                    checked={repeatType === "monthly"}
                  >
                    Monthly
                  </SegmentedItem>
                  <SegmentedItem
                    value="yearly"
                    checked={repeatType === "yearly"}
                  >
                    Yearly
                  </SegmentedItem>
                </SegmentedGroup>

                <div className="md-recurrence-options">
                  <span>Repeat every</span>
                  <span className="md-recurrence-input md-recurrence-input-nr">
                    <Input
                      min={1}
                      value={repeatNr.toString()}
                      onChange={repeatNrChange}
                      inputStyle="outline"
                    />
                  </span>
                  {repeatType === "daily" && <span>days</span>}
                  {repeatType === "weekly" && <span>weeks</span>}
                  {repeatType === "monthly" && (
                    <span>
                      month(s) on day
                      <span className="md-recurrence-input md-recurrence-input-nr">
                        <Select
                          data={monthlyDays}
                          value={monthlyDay}
                          onChange={monthlyDayChange}
                          inputProps={dayInputProps}
                        />
                      </span>
                    </span>
                  )}
                  {repeatType === "yearly" && (
                    <span>
                      year(s) <br />
                      on day
                      <span className="md-recurrence-input md-recurrence-input-nr">
                        <Select
                          data={yearlyDays}
                          value={yearlyDay}
                          onChange={yearlyDayChange}
                          inputProps={dayInputProps}
                        />
                      </span>
                      <span>of</span>
                      <span className="md-recurrence-input">
                        <Select
                          data={months}
                          value={selectedMonth}
                          onChange={monthsChange}
                          inputProps={monthInputProps}
                        />
                      </span>
                    </span>
                  )}

                  {repeatType === "daily" && (
                    <p className="md-recurrence-desc">
                      The event will be repeated every day or every x days,
                      depending on the value
                    </p>
                  )}
                  {repeatType === "weekly" && (
                    <p className="md-recurrence-desc">
                      The event will be repeated every x weeks on specific
                      weekdays
                    </p>
                  )}
                  {repeatType === "monthly" && (
                    <p className="md-recurrence-desc">
                      The event will be repeated every x month on specific day
                      of the month
                    </p>
                  )}
                  {repeatType === "yearly" && (
                    <p className="md-recurrence-desc">
                      The event will be repeated every x years on specific day
                      of a specific month
                    </p>
                  )}
                </div>

                {repeatType === "weekly" && (
                  <SegmentedGroup select="multiple" onChange={weekDayChange}>
                    <SegmentedItem
                      value="SU"
                      checked={weekDays.indexOf("SU") >= 0}
                    >
                      Sun
                    </SegmentedItem>
                    <SegmentedItem
                      value="MO"
                      checked={weekDays.indexOf("MO") >= 0}
                    >
                      Mon
                    </SegmentedItem>
                    <SegmentedItem
                      value="TU"
                      checked={weekDays.indexOf("TU") >= 0}
                    >
                      Tue
                    </SegmentedItem>
                    <SegmentedItem
                      value="WE"
                      checked={weekDays.indexOf("WE") >= 0}
                    >
                      Wed
                    </SegmentedItem>
                    <SegmentedItem
                      value="TH"
                      checked={weekDays.indexOf("TH") >= 0}
                    >
                      Thu
                    </SegmentedItem>
                    <SegmentedItem
                      value="FR"
                      checked={weekDays.indexOf("FR") >= 0}
                    >
                      Fri
                    </SegmentedItem>
                    <SegmentedItem
                      value="SA"
                      checked={weekDays.indexOf("SA") >= 0}
                    >
                      Sat
                    </SegmentedItem>
                  </SegmentedGroup>
                )}

                <div className="md-recurrence-ends">Ends</div>

                <div className="mbsc-form-group">
                  <RadioGroup>
                    <Radio
                      label="Never"
                      position="start"
                      description="The event will repeat indefinitely"
                      checked={condition === "never"}
                      onChange={conditionChange}
                      value="never"
                    />
                    <Radio
                      checked={condition === "until"}
                      onChange={conditionChange}
                      value="until"
                      position="start"
                    >
                      Until
                      <span className="md-recurrence-input">
                        <Datepicker
                          inputProps={dateInputProps}
                          controls={["calendar"]}
                          display="anchored"
                          touchUi={false}
                          dateFormat="YYYY-MM-DD"
                          returnFormat="iso8601"
                          value={untilDate}
                          onChange={untilDateChange}
                          onOpen={() => setCondition("until")}
                        />
                      </span>
                      <span className="mbsc-description">
                        The event will run until it reaches a specific date
                      </span>
                    </Radio>
                    <Radio
                      checked={condition === "count"}
                      onChange={conditionChange}
                      value="count"
                      position="start"
                    >
                      After
                      <span className="md-recurrence-input md-recurrence-input-nr">
                        <Input
                          inputStyle="outline"
                          value={occurrences.toString()}
                          onChange={occurrancesChange}
                        />
                        occurrences
                        <span className="mbsc-description">
                          The event will repeat until it reaches a certain
                          amount of occurrences
                        </span>
                      </span>
                    </Radio>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {isEdit && (
            <div className="mbsc-button-group">
              <Button
                className="mbsc-button-block"
                color="danger"
                variant="outline"
                onClick={onDeleteClick}
              >
                Delete event
              </Button>
            </div>
          )}
        </div>
      </Popup>

      <Popup
        display="bottom"
        contentPadding={false}
        buttons={recurringEditButtons}
        isOpen={isRecurringEditOpen}
        onClose={onRecurringEditClose}
      >
        <div className="mbsc-form-group">
          <div className="mbsc-form-group-title">
            {recurringText} recurring event
          </div>
          <RadioGroup onChange={recurringEditModeChange}>
            <Radio
              label="This event only"
              checked={recurringEditMode === "current"}
              onChange={recurringEditModeChange}
              value="current"
            />
            <Radio
              label="This and following events"
              checked={recurringEditMode === "following"}
              onChange={recurringEditModeChange}
              value="following"
            />
            <Radio
              label="All events"
              checked={recurringEditMode === "all"}
              onChange={recurringEditModeChange}
              value="all"
            />
          </RadioGroup>
        </div>
      </Popup>

      <Popup
        display="bottom"
        contentPadding={false}
        showArrow={false}
        showOverlay={false}
        anchor={colorAnchor}
        isOpen={colorPickerOpen}
        buttons={colorButtons}
        responsive={colorResponsive}
        ref={colorPicker}
      >
        <div className="crud-color-row">
          {colors.map((color, index) => {
            if (index < 5) {
              return (
                <div
                  key={index}
                  onClick={changeColor}
                  className={
                    "crud-color-c " + (tempColor === color ? "selected" : "")
                  }
                  data-value={color}
                >
                  <div
                    className="crud-color mbsc-icon mbsc-font-icon mbsc-icon-material-check"
                    style={{ background: color }}
                  ></div>
                </div>
              );
            } else return null;
          })}
        </div>
        <div className="crud-color-row">
          {colors.map((color, index) => {
            if (index >= 5) {
              return (
                <div
                  key={index}
                  onClick={changeColor}
                  className={
                    "crud-color-c " + (tempColor === color ? "selected" : "")
                  }
                  data-value={color}
                >
                  <div
                    className="crud-color mbsc-icon mbsc-font-icon mbsc-icon-material-check"
                    style={{ background: color }}
                  ></div>
                </div>
              );
            } else return null;
          })}
        </div>
      </Popup>

      <Snackbar
        isOpen={isSnackbarOpen}
        message="Event deleted"
        button={snackbarButton}
        onClose={handleSnackbarClose}
      />
    </div>
  );
};
export default Calender;

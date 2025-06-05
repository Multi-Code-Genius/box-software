import {
  MbscEventcalendarView,
  MbscPopupOptions,
  MbscResponsiveOptions,
  MbscSelectOptions,
} from "@mobiscroll/react";

export const colors = [
  "#ffeb3c",
  "#ff9900",
  "#f44437",
  "#ea1e63",
  "#9c26b0",
  "#3f51b5",
  "",
  "#009788",
  "#4baf4f",
  "#7e5d4e",
];

export const viewSettings: MbscEventcalendarView = {
  schedule: {
    type: "week",
  },
};

export const responsivePopup: MbscResponsiveOptions<MbscPopupOptions> = {
  medium: {
    display: "anchored",
    width: 510,
    fullScreen: false,
    touchUi: false,
  },
};

export const selectResponsive: MbscResponsiveOptions<MbscSelectOptions> = {
  xsmall: {
    touchUi: true,
  },
  small: {
    touchUi: false,
  },
};

export const days = [
  {
    name: "Sunday",
    short: "SU",
    checked: true,
  },
  {
    name: "Monday",
    short: "MO",
    checked: false,
  },
  {
    name: "Tuesday",
    short: "TU",
    checked: false,
  },
  {
    name: "Wednesday",
    short: "WE",
    checked: false,
  },
  {
    name: "Thursday",
    short: "TH",
    checked: false,
  },
  {
    name: "Friday",
    short: "FR",
    checked: false,
  },
  {
    name: "Saturday",
    short: "SA",
    checked: false,
  },
];

export const months = [
  {
    value: 1,
    text: "January",
  },
  {
    value: 2,
    text: "February",
  },
  {
    value: 3,
    text: "March",
  },
  {
    value: 4,
    text: "April",
  },
  {
    value: 5,
    text: "May",
  },
  {
    value: 6,
    text: "June",
  },
  {
    value: 7,
    text: "July",
  },
  {
    value: 8,
    text: "August",
  },
  {
    value: 9,
    text: "September",
  },
  {
    value: 10,
    text: "October",
  },
  {
    value: 11,
    text: "November",
  },
  {
    value: 12,
    text: "December",
  },
];

export const ordinalList: { [key: number]: string } = {
  1: "first",
  2: "second",
  3: "third",
  4: "fourth",
};

export const dayInputProps = {
  className: "custom-repeat-input custom-repeat-select-nr",
  inputStyle: "outline",
};

export const monthInputProps = {
  className: "custom-repeat-input custom-repeat-select-month",
  inputStyle: "outline",
};

export const dateInputProps = {
  className: "custom-repeat-input custom-specific-date",
  inputStyle: "outline",
};


export const repeatedData =[
    {
      value: "norepeat",
      text: "Does not repeat",
    },
    {
      value: "daily",
      text: "Daily",
    },
    {
      value: "weekly",
      text: "Weekly",
    },
    {
      value: "monthly",
      text: "Monthly",
    },
    {
      value: "monthly-pos",
      text: "Monthly",
    },
    {
      value: "yearly",
      text: "Yearly",
    },
    {
      value: "yearly-pos",
      text: "Yearly",
    },
    {
      value: "weekday",
      text: "Every weekday (Monday to Friday)",
    },
    {
      value: "custom",
      text: "Custom",
    },
  ]);
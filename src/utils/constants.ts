import { IDatePickerConfig } from "../types/DatePicker.type";

export const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];
export const PERSIAN_DAYS_SAT = ["شنبه", "یک شنبه", "دو شنبه", "سه شنبه", "چهار شنبه", "پنج شنبه", "جمعه"];
export const GEORGIAN_DAYS_START_SATURDAY = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export const datePickerDefaultConfig: IDatePickerConfig = {
  colors: {
    textColor: "black",
    grayedOutTextColor: "gray",
    primaryColor: "#7367f0",
    backgroundColor: "white",
  },
};

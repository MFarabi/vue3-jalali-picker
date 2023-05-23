import { Moment } from "jalali-moment";

export interface IDatePickerDays {
  wd: string;
  day: string;
  date: string;
  events: string[];
  jalali: string;
}

export type DatePickerWeek = Array<IDatePickerDays>;

export type DatePickerMonth = Array<DatePickerWeek>;

export interface IDatePickerConfig {
  minDate?: Moment;
  maxDate?: Moment;
  colors?: {
    primaryColor?: string;
    selectedText?: string;
    backgroundColor?: string;
    textColor?: string;
    grayedOutTextColor?: string;
  };
}

export interface IDatePickerProps {
  withoutTime?: boolean;
  /**
   * 👉🏻 time selection used when timepicker called withoutTime
   * start will return start of the day, end will return end of the day
   */
  timeSelection?: "start" | "end";
  value?: Moment;
  locale?: "en" | "fa";
  defaultDate?: Moment;
  options?: IDatePickerConfig;
  range?: { start: Moment; end: Moment };
}

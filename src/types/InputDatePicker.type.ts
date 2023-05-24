import { IDatePickerProps } from "./DatePicker.type";

export type IInputeDatePickerProps = IDatePickerProps & {
  removable: boolean;
  hideCalendarIcon: boolean;
};

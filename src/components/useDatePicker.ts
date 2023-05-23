// import moment, {Moment} from 'jalali-moment';
// import {
//     PERSIAN_MONTHS,
//     PERSIAN_DAYS_SAT,
//     GEORGIAN_DAYS_START_SATURDAY,
// } from '../utils/constants';
// import changeLocale from '../filters/changeLocale.filter';
// import {ref} from "vue";
//
// export interface IDatePickerConfig {
//     minDate?: Moment,
//     maxDate?: Moment,
//     isRange?: boolean,
//     colors?: {
//         defaultDate?: string,
//         primaryColor?: string,
//         secondaryColor?: string,
//         backgroundColor?: string,
//     },
// };
//
// export const defaultDatePickerConfig: IDatePickerConfig = {
//     colors: {
//         defaultDate: '',
//         primaryColor: '#7367f0',
//         secondaryColor: '#7367f0aa',
//         backgroundColor: 'white',
//     },
// };
//
// interface IDatePickerProps {
//     withoutTime: boolean;
//     timeSelection: 'start' | 'end' | 'none';
//     locale: 'fa' | 'en';
//     defaultDate?: Moment;
//     options: IDatePickerConfig;
//     range?: { start: Moment; end: Moment; }
// }
//
// export default function useDatePicker() {
//     const {
//         withoutTime = false,
//         timeSelection = 'none',
//         locale = 'en',
//         defaultDate,
//         options = defaultDatePickerConfig,
//         range = null
//     } = defineProps<IDatePickerProps>()
//     const selectedTime = defineModel<Moment>()
//     selectedTime.value = moment(10);
//     const rows = ref([]);
//     const mainMoment = ref(moment(props.value));
//     // const selectedTime = ref(moment(props.value));
//     const showYearPicker = ref(false);
//     const height = ref(100);
//     const showTimePicker = ref(false);
//     const configOptions = {
//         ...datePickerConfig,
//         ...props.options,
//     };
//     const {refs} = context;
//
//     // computed properties
//
//     const timeToSelect = (time) => {
//         if (!props.withoutTime) return moment(time);
//         return props.timeSelection === 'end'
//             ? moment(time).endOf('day')
//             : moment(time).startOf('day');
//     };
//
//     const isDarkTheme = () => {
//         return store.getters['appConfig/isDarkTheme'];
//     };
//
//     const changedRows = computed(() => rows.value);
//
//     // methods
//
//     const calculateHeight = () => {
//         height.value = refs.datePicker.clientHeight;
//     };
//
//     const createHolder = () => {
//         const rowsHolder = [];
//         for (let i = 0; i < 6; i += 1) {
//             rowsHolder.push(
//                 moment.weekdays().map((item, index) => {
//                     return {
//                         wd:
//                             props.local === 'en' ? item : GEORGIAN_DAYS_START_SATURDAY[index],
//                         day: '',
//                         date: '',
//                         events: [],
//                         jalali: '',
//                     };
//                 })
//             );
//         }
//         return rowsHolder;
//     };
//
//     const initializeRows = () => {
//         const rowsHolder = createHolder();
//         const isPersian = props.locale === 'fa';
//
//         const daysInShamsi = [1, 2, 3, 4, 5, 6, 0];
//         const differenceFromPickerStart = mainMoment.value
//             .clone()
//             .startOf(isPersian ? 'jMonth' : 'month')
//             .weekday();
//         const dayToReduce = isPersian
//             ? daysInShamsi[differenceFromPickerStart]
//             : differenceFromPickerStart;
//
//         const dayToIncrement = mainMoment.value
//             .clone()
//             .startOf(isPersian ? 'jMonth' : 'month')
//             .subtract(dayToReduce, 'day');
//
//         // eslint-disable-next-line no-restricted-syntax
//         for (const week of rowsHolder) {
//             // eslint-disable-next-line no-restricted-syntax
//             for (const day of week) {
//                 day.date = dayToIncrement.format('YYYY-MM-DD');
//                 day.jalali = dayToIncrement.format('jYYYY-jMM-jDD');
//                 if (
//                     dayToIncrement.format(isPersian ? 'jMM' : 'MM') !==
//                     mainMoment.value.format(isPersian ? 'jMM' : 'MM')
//                 ) {
//                     day.events.push('other-month');
//                 }
//                 dayToIncrement.add(1, 'day');
//             }
//         }
//
//         if (
//             moment(rowsHolder[4][0].date).format(isPersian ? 'jMM' : 'MM') !==
//             moment(rowsHolder[5][0].date).format(isPersian ? 'jMM' : 'MM')
//         ) {
//             rowsHolder.pop();
//         }
//
//         rows.value = rowsHolder;
//         nextTick(() => {
//             calculateHeight();
//         });
//     };
//
//     const onTimeSelect = (time) => {
//         context.emit('input', time);
//         showTimePicker.value = false;
//     };
//
//     const onChangeYearPicker = (event) => {
//         const year = +event.date.split('-')[0];
//         const month = +event.date.split('-')[1];
//         mainMoment.value.set({year});
//         mainMoment.value.set({month: month - 1});
//         selectedTime.value.set({year});
//         selectedTime.value.set({month: month - 1});
//         if (event.close) showYearPicker.value = false;
//         initializeRows();
//     };
//
//     const decreaseMonth = () => {
//         mainMoment.value.subtract(1, 'month');
//
//         initializeRows();
//     };
//
//     const increaseMonth = () => {
//         mainMoment.value.add(1, 'month');
//         initializeRows();
//     };
//
//     const onDayClick = (selectedDay) => {
//         if (
//             props.options &&
//             props.options.minDate &&
//             props.options.minDate.isValid() &&
//             moment(selectedDay)
//                 .startOf('day')
//                 .isBefore(props.options.minDate.startOf('day'))
//         ) {
//             return;
//         }
//
//         if (
//             props.options &&
//             props.options.maxDate &&
//             props.options.maxDate.isValid() &&
//             moment(selectedDay)
//                 .endOf('day')
//                 .isAfter(props.options.maxDate.endOf('day'))
//         ) {
//             return;
//         }
//
//         if (selectedDay.length !== 10) {
//             return;
//         }
//         selectedTime.value = moment(selectedDay).set({
//             hour: selectedTime.value.format('HH'),
//             minute: selectedTime.value.format('mm'),
//         });
//         context.emit('input', timeToSelect(selectedTime.value));
//         context.emit('select-time', selectedTime.value.format('YYYY-MM-DD'));
//     };
//
//     const onMonthClick = () => {
//         selectedTime.value = mainMoment.value;
//         context.emit('input', timeToSelect(selectedTime.value));
//         context.emit('select-time', selectedTime.value.format('YYYY-MM-DD'));
//     };
//
//     const updateClasses = () => {
//         try {
//             for (let i = 0; i < 6; i += 1) {
//                 if (!rows.value[i]) continue;
//                 // eslint-disable-next-line no-restricted-syntax
//                 for (const iterator of rows.value[i]) {
//                     iterator.events = iterator.events.filter(
//                         (item) => item !== 'selected'
//                     );
//                     if (selectedTime.value.format('YYYY-MM-DD') === iterator.date) {
//                         iterator.events.push('selected');
//                     }
//                 }
//             }
//         } catch (e) {
//             console.error('error on update classes in general calendar: ', e);
//         }
//     };
//
//     onMounted(() => {
//         if (
//             props.options.minDate &&
//             moment(props.options.minDate).isValid() &&
//             moment(selectedTime.value).isBefore(props.options.minDate)
//         ) {
//             context.emit(
//                 'input',
//                 timeToSelect(moment(props.options.minDate).add(1, 'minute'))
//             );
//         } else if (moment(props.value).isValid()) {
//             selectedTime.value = moment(props.value);
//         } else {
//             selectedTime.value = moment();
//         }
//         mainMoment.value = selectedTime.value.clone();
//         nextTick(() => {
//             initializeRows();
//             nextTick(() => {
//                 calculateHeight();
//             });
//         });
//     });
//
//     watch(
//         () => selectedTime.value,
//         () => {
//             initializeRows();
//             updateClasses();
//         }
//     );
//
//     watch(
//         () => props.value,
//         () => {
//             if (moment(props.value).isValid()) {
//                 selectedTime.value = moment(props.value);
//             } else {
//                 selectedTime.value = moment();
//             }
//             initializeRows();
//         }
//     );
//
//     watch(
//         () => mainMoment.value,
//         () => {
//             updateClasses();
//         }
//     );
//
//     return {
//         rows,
//         height,
//         moment,
//         onDayClick,
//         mainMoment,
//         changedRows,
//         isDarkTheme,
//         onMonthClick,
//         selectedTime,
//         changeLocale,
//         onTimeSelect,
//         decreaseMonth,
//         configOptions,
//         increaseMonth,
//         PERSIAN_MONTHS,
//         showYearPicker,
//         showTimePicker,
//         PERSIAN_DAYS_SAT,
//         onChangeYearPicker,
//     };
// }

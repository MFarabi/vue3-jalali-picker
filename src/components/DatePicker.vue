<template>
  <div v-if="mainMoment && selectedTime" ref="datePicker" class="calendar-sm calendar-sm-white">
    <YearAndMonth
      v-if="showYearPicker"
      :locale="locale"
      :height="height + 'px'"
      :value="!!mainMoment ? mainMoment.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')"
      @input="onChangeYearPicker"
    />
    <TimePicker
      v-if="showTimePicker"
      :time="selectedTime"
      :height="height + 'px'"
      active-color="green"
      @input="onTimeSelect"
    />
    <div class="calendar-sm-header">
      <button class="btn d-flex justify-content-center" type="button" @click="decreaseMonth">
        <TheChevron class="rotate" />
      </button>
      <div class="flex flex-col">
        <p class="font-16 pointer-on-hover font-500 fa-lg mb-0" @click="showYearPicker = true">
          {{
            mainMoment.isValid()
              ? locale === "fa"
                ? PERSIAN_MONTHS[parseInt(mainMoment.format("jMM")) - 1]
                : moment.months()[mainMoment.month()]
              : ""
          }}
          {{
            changeLocale(
              mainMoment.isValid() ? mainMoment.format(locale === "fa" ? "jYYYY" : "YYYY") : "",
              locale ?? "en"
            )
          }}
        </p>
        <p
          v-if="!withoutTime"
          class="text-center pointer-on-hover text-sm header-time-picker"
          @click="showTimePicker = true"
        >
          {{ changeLocale(selectedTime.format("HH-mm"), locale ?? "en") }}
        </p>
      </div>
      <button class="btn d-flex justify-content-center" type="button" @click="increaseMonth">
        <TheChevron />
      </button>
    </div>
    <!-- Event can drop on time picker -->
    <div class="calendar-sm-body">
      <div class="calendar-sm-days-header">
        <div
          v-for="item in 7"
          :key="item"
          :title="locale === 'en' ? moment.weekdays()[item - 1] : PERSIAN_DAYS_SAT[item - 1]"
          :style="{ color: options.colors?.textColor }"
        >
          {{ locale === "en" ? moment.weekdays()[item - 1][0] : PERSIAN_DAYS_SAT[item - 1][0] }}
        </div>
      </div>
      <ul class="calendar-sm-days-body p-0">
        <li v-for="(rows, rowIndex) in changedRows" :id="'row-' + rowIndex + 1" :key="rowIndex" class="crow">
          <div
            v-for="(item, index) in rows"
            :key="index"
            :class="{
              'range-picker-end': range && item.date === (range.end && range.end.format('YYYY-MM-DD')),
              'range-picker-start': range && item.date === (range.start && range.start.format('YYYY-MM-DD')),
            }"
            :style="{
              backgroundColor:
                range &&
                range.start.format('YYYY-MM-DD') !== range.end.format('YYYY-MM-DD') &&
                moment(item.date).subtract(1, 'day').isBefore(range.end.format('YYYY-MM-DD')) &&
                moment(item.date).add(1, 'day').isAfter(range.start.format('YYYY-MM-DD'))
                  ? options && options.colors!.primaryColor
                  : 'unset',
            }"
            @click.stop="onDayClick(item.date)"
          >
            <div>
              <span
                :class="{
                  'default-date': item.events.includes('defaultDate'),
                }"
                :style="{
                  color:
                    calcPickerDateColor(item.date, item.events),
                  backgroundColor:
                    item.date === (range && range.start.format(defaultGeorgianFormat)) ||
                    item.date === (range && range.end.format(defaultGeorgianFormat)) ||
                    (selectedTime && item.date === selectedTime.format('YYYY-MM-DD'))
                      ? options!.colors!.primaryColor
                      : 'unset',
                  border: item.events.includes('today') ? `2px solid ${options!.colors!.primaryColor}` : '',
                }"
                :title="item.date"
              >
                {{ changeLocale(locale === "en" ? item.date.slice(8, 10) : item.jalali.slice(8, 10), locale ?? "en") }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment, { Moment } from "jalali-moment";
import { computed, nextTick, onMounted, ref, watch } from "vue";

import TheChevron from "../components/icons/TheChevron.vue";
import YearAndMonth from "../components/YearAndMonth.vue";
import TimePicker from "../components/TimePicker.vue";

import { IDatePickerProps, DatePickerMonth, IDatePickerDays } from "../types/DatePicker.type";
import changeLocale from "../filters/changeLocale.filter";
import {
  GEORGIAN_DAYS_START_SATURDAY,
  datePickerDefaultConfig,
  PERSIAN_MONTHS,
  PERSIAN_DAYS_SAT,
} from "../utils/constants";

const defaultGeorgianFormat = "YYYY-MM-DD";

const props = withDefaults(defineProps<IDatePickerProps>(), {
  locale: "en",
  range: undefined,
  withoutTime: false,
  value: () => moment(),
  defaultDate: undefined,
  timeSelection: undefined,
  options: () => datePickerDefaultConfig,
});
const emit = defineEmits<{
  (e: "input", value: Moment): void;
  (e: "select-time", value: string): void;
}>();

const datePicker = ref<HTMLDivElement | null>(null);

const rows = ref<DatePickerMonth>([]);
const mainMoment = ref(moment(props.value ?? moment()));
const selectedTime = ref(moment(props.value ?? moment()));
const showYearPicker = ref(false);
const height = ref(100);
const showTimePicker = ref(false);

const changedRows = computed(() => rows.value);

const createHolder = () => {
  const rowsHolder = [];
  for (let i = 0; i < 6; i += 1) {
    rowsHolder.push(
      moment.weekdays().map((item, index) => {
        const day: IDatePickerDays = {
          wd: props.locale === "en" ? item : GEORGIAN_DAYS_START_SATURDAY[index],
          day: "",
          date: "",
          events: [],
          jalali: "",
        };
        return day;
      })
    );
  }
  return rowsHolder;
};

const calculateHeight = () => {
  if (datePicker.value && datePicker.value.clientHeight) height.value = datePicker.value.clientHeight;
};

const timeToSelect = (time: Moment) => {
  if (!props.withoutTime) return moment(time);
  return props.timeSelection === "end" ? moment(time).endOf("day") : moment(time).startOf("day");
};

const initializeRows = () => {
  const rowsHolder = createHolder();
  const isPersian = props.locale === "fa";

  const daysInShamsi = [1, 2, 3, 4, 5, 6, 0];
  const differenceFromPickerStart = mainMoment.value
    .clone()
    .startOf(isPersian ? "jMonth" : "month")
    .weekday();
  const dayToReduce = isPersian ? daysInShamsi[differenceFromPickerStart] : differenceFromPickerStart;

  const dayToIncrement = mainMoment.value
    .clone()
    .startOf(isPersian ? "jMonth" : "month")
    .subtract(dayToReduce, "day");

  // eslint-disable-next-line no-restricted-syntax
  for (const week of rowsHolder) {
    // eslint-disable-next-line no-restricted-syntax
    for (const day of week) {
      day.date = dayToIncrement.format("YYYY-MM-DD");
      day.jalali = dayToIncrement.format("jYYYY-jMM-jDD");

      // if current date does not have same month as selected month
      if (dayToIncrement.format(isPersian ? "jMM" : "MM") !== mainMoment.value.format(isPersian ? "jMM" : "MM")) {
        day.events.push("other-month");
      }
      // if current date is selected as default date
      if (props.defaultDate && props.defaultDate.isSame(day.date, "date")) {
        day.events.push("defaultDate");
      }
      dayToIncrement.add(1, "day");
    }
  }

  if (
    moment(rowsHolder[4][0].date).format(isPersian ? "jMM" : "MM") !==
    moment(rowsHolder[5][0].date).format(isPersian ? "jMM" : "MM")
  ) {
    rowsHolder.pop();
  }

  rows.value = rowsHolder;
  nextTick(() => {
    calculateHeight();
  });
};

const onTimeSelect = (time: Moment) => {
  selectedTime.value = time;
  emit("input", time);
  showTimePicker.value = false;
};

const onChangeYearPicker = (event: { date: string; close: boolean }) => {
  const year = +event.date.split("-")[0];
  const month = +event.date.split("-")[1];
  mainMoment.value.set({ year });
  mainMoment.value.set({ month: month - 1 });
  selectedTime.value!.set({ year });
  selectedTime.value!.set({ month: month - 1 });
  if (event.close) showYearPicker.value = false;
  initializeRows();
};

const decreaseMonth = () => {
  mainMoment.value.subtract(1, "month");
  initializeRows();
};

const increaseMonth = () => {
  mainMoment.value.add(1, "month");
  initializeRows();
};

const onDayClick = (selectedDay: string) => {
  if (
    props.options &&
    props.options.minDate &&
    props.options.minDate.isValid() &&
    moment(selectedDay).startOf("day").isBefore(props.options.minDate.startOf("day"))
  ) {
    return;
  }

  if (
    props.options &&
    props.options.maxDate &&
    props.options.maxDate.isValid() &&
    moment(selectedDay).endOf("day").isAfter(props.options.maxDate.endOf("day"))
  ) {
    return;
  }

  if (selectedDay.length !== 10) {
    return;
  }
  selectedTime.value = moment(selectedDay).set({
    hour: +selectedTime.value!.format("HH"),
    minute: +selectedTime.value!.format("mm"),
  });
  emit("input", timeToSelect(selectedTime.value));
  emit("select-time", selectedTime.value.format("YYYY-MM-DD"));
};

const updateClasses = () => {
  try {
    for (let i = 0; i < 6; i += 1) {
      if (!rows.value[i]) continue;
      for (const iterator of rows.value[i]) {
        iterator.events = iterator.events.filter((item) => item !== "selected");
        if (selectedTime.value!.format("YYYY-MM-DD") === iterator.date) {
          iterator.events.push("selected");
        }
      }
    }
  } catch (e) {
    console.error("error on update classes in general calendar: ", e);
  }
};

const calcPickerDateColor = (date: string, events: string[]) => {
  if (
    (props.range &&
      moment(date).isAfter(props.range.start.startOf("day")) &&
      moment(date).isBefore(props.range.end.endOf("day"))) ||
    date === selectedTime.value.format(defaultGeorgianFormat) ||
    events.includes("defaultDate")
  ) {
    return props.options.colors?.selectedText!;
  } else if (events.includes("other-month")) return props.options.colors?.grayedOutTextColor;
  else return props.options.colors?.textColor!;
};

onMounted(() => {
  if (
    props.options &&
    props.options.minDate &&
    moment(props.options.minDate).isValid() &&
    moment(selectedTime.value!).isBefore(props.options.minDate)
  ) {
    emit("input", timeToSelect(moment(props.options.minDate).add(1, "minute")));
  } else if (moment(props.value).isValid()) {
    selectedTime.value = moment(props.value);
  } else {
    selectedTime.value = moment();
  }
  mainMoment.value = selectedTime.value!.clone();
  nextTick(() => {
    initializeRows();
    nextTick(() => {
      calculateHeight();
    });
  });
});

watch(
  () => selectedTime.value,
  () => {
    initializeRows();
    updateClasses();
  }
);

watch(
  () => props.value,
  () => {
    if (moment(props.value).isValid()) {
      selectedTime.value = moment(props.value);
    } else {
      selectedTime.value = moment();
    }
    initializeRows();
  }
);

watch(
  () => mainMoment.value,
  () => {
    updateClasses();
  }
);
</script>

<style scoped>
@import "../assets/DatePicker.css";
</style>

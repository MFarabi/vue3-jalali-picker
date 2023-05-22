<template>
  <div
    v-if="mainMoment && selectedTime"
    ref="datePicker"
    class="calendar-sm calendar-sm-white"
  >
    <DatePickerYearAndMonth
      v-if="showYearPicker"
      :locale="locale"
      :height="height + 'px'"
      :value="
        !!mainMoment
          ? mainMoment.format('YYYY-MM-DD')
          : moment().format('YYYY-MM-DD')
      "
      @input="onChangeYearPicker"
    />
    <TimePicker
      v-if="showTimePicker"
      :time="selectedTime"
      :height="height + 'px'"
      @input="onTimeSelect"
    />
    <div class="calendar-sm-header">
      <button
        class="btn d-flex justify-content-center"
        type="button"
        @click="decreaseMonth"
      >
        <BIconChevronLeft />
      </button>
      <div class="flex flex-col">
        <p
          class="font-16 pointer-on-hover font-500 fa-lg mb-0"
          @click="showYearPicker = true"
        >
          {{
            mainMoment.isValid()
              ? locale === 'fa'
                ? PERSIAN_MONTHS[
                    parseInt(mainMoment.clone().locale(locale).format('jMM')) -
                      1
                  ]
                : moment.months()[mainMoment.month()]
              : ''
          }}
          {{
            (mainMoment.isValid()
              ? mainMoment
                  .clone()
                  .locale(locale)
                  .format(locale === 'fa' ? 'jYYYY' : 'YYYY')
              : '') | changeLocale(locale)
          }}
        </p>
        <p
          v-if="!withoutTime"
          class="text-center pointer-on-hover text-sm header-time-picker"
          @click="showTimePicker = true"
        >
          {{ selectedTime.format('HH-mm') | changeLocale(locale) }}
        </p>
      </div>
      <button
        class="btn d-flex justify-content-center"
        type="button"
        @click="increaseMonth"
      >
        <BIconChevronRight />
      </button>
    </div>
    <!-- Event can drop on time picker -->
    <div class="calendar-sm-body">
      <div class="calendar-sm-days-header">
        <div
          v-for="item in 7"
          :key="item"
          :title="
            locale === 'en'
              ? moment.weekdays()[item - 1]
              : PERSIAN_DAYS_SAT[item - 1]
          "
        >
          {{
            locale === 'en'
              ? moment.weekdays()[item - 1][0]
              : PERSIAN_DAYS_SAT[item - 1][0]
          }}
        </div>
      </div>
      <ul class="calendar-sm-days-body p-0">
        <li
          v-for="(rows, rowIndex) in changedRows"
          :id="'row-' + rowIndex + 1"
          :key="rowIndex"
          class="crow"
        >
          <div
            v-for="(item, index) in rows"
            :key="index"
            :class="{
              'range-picker-end':
                configOptions.isRange &&
                item.date === (range.end && range.end.format('YYYY-MM-DD')),
              'range-picker-start':
                configOptions.isRange &&
                item.date === (range.start && range.start.format('YYYY-MM-DD')),
            }"
            :style="{
              backgroundColor:
                configOptions.isRange &&
                range.start.format('YYYY-MM-DD') !==
                  range.end.format('YYYY-MM-DD') &&
                moment(item.date)
                  .subtract(1, 'day')
                  .isBefore(range.end.format('YYYY-MM-DD')) &&
                moment(item.date)
                  .add(1, 'day')
                  .isAfter(range.start.format('YYYY-MM-DD'))
                  ? configOptions.colors.primaryColor
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
                    item.date === range.start ||
                    item.date === range.end ||
                    (value && item.date === value.format('YYYY-MM-DD')) ||
                    item.events.includes('defaultDate') ||
                    ($store.getters['appConfig/isDarkTheme'] === 'dark' &&
                      !item.events.includes('other-month'))
                      ? 'white'
                      : item.events.includes('other-month')
                      ? 'gray'
                      : 'black',
                  backgroundColor:
                    item.date === range.start ||
                    item.date === range.end ||
                    (value && item.date === value.format('YYYY-MM-DD'))
                      ? configOptions.colors.primaryColor
                      : 'unset',
                  border: item.events.includes('today')
                    ? `2px solid ${configOptions.colors.primaryColor}`
                    : '',
                }"
                :title="item.date"
              >
                {{
                  (locale === 'en'
                    ? item.date.slice(8, 10)
                    : item.jalali.slice(8, 10)) | changeLocale(locale)
                }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { BIconChevronLeft, BIconChevronRight } from 'bootstrap-vue';
import DatePickerYearAndMonth from '@/components/pickers/date-picker/DatePickerYearAndMonth.vue';
import TimePicker from '@/components/pickers/date-picker/TimePicker.vue';
import useDatePicker, {
  datePickerConfig,
} from '@/components/pickers/date-picker/useDatePicker';
import moment from 'jalali-moment';

export default {
  name: 'GeneralCalendar',
  // components: { GeneralCalendarYear },
  components: {
    TimePicker,
    BIconChevronRight,
    BIconChevronLeft,
    DatePickerYearAndMonth,
  },
  props: {
    value: {
      type: Object,
      required: false,
      default: moment(),
    },
    withoutTime: {
      type: Boolean,
      default: false,
    },
    timeSelection: {
      type: String,
      // start, end, none
      default: 'none',
    },
    locale: {
      type: String,
      default: 'en',
    },
    defaultDate: {
      type: String,
      default: '',
    },
    options: {
      type: Object,
      default: () => datePickerConfig,
    },
    range: {
      type: Object,
      default: () => ({
        start: moment(),
        end: moment(),
      }),
    },
  },
  setup(props, context) {
    return {
      ...useDatePicker(props, context),
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/components/pickers/date-picker/DatePicker';

.calendar-sm {
  position: absolute;
  z-index: 450;
  overflow: hidden;
  min-height: 230px;
  width: 298px !important;
}

.header-time-picker {
  font-size: 12px;
  font-weight: 500;
  color: #505050;

  .dark-layout & {
    color: #cbcbcb;
  }
}

.gray-day {
  background: #9c9c9c;
  color: white;
}

.other-month {
  color: gray !important;
}

.red-day {
  background: #fc6c68;
  color: white;
}

.default-date {
  background-color: #7367f0aa !important;
}

.date-range-start {
  background-color: #7367f0 !important;
}

.date-range-end {
  background-color: #7367f0 !important;
}

.gray-border-day {
  border: 2px solid gray;
}

.hover-pointer:hover {
  cursor: pointer;
}

.calendar-sm-days-header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 12px;
}

.calendar-sm-days-header div {
  text-align: center;
}

.calendar-sm-header {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin-bottom: 27px;
  padding-top: 20px;
  color: #000;
}

div.calendar-sm-header p.small {
  display: none;
  cursor: pointer;
}

div.calendar-sm-header:hover p.small {
  display: inline-block;
}

.calendar-sm-body {
  padding: 0 15px;
}

.date-range {
  &-end {
    border-bottom-right-radius: 15px;
    border-top-right-radius: 15px;

    background-color: rgb(219, 239, 239);
    width: 38px;
    margin-right: 8px;
  }

  &-start {
    border-bottom-left-radius: 15px;
    border-top-left-radius: 15px;

    background-color: rgb(219, 239, 239);
    width: 38px;
    margin-left: 8px;
  }
}

.calendar-sm-days-body {
  .crow {
    .div {
      box-sizing: border-box;
      width: 38px !important;
      height: 38px;
      overflow: hidden;
    }
  }
}

.range-picker-end {
  border-bottom-right-radius: 100%;
  border-top-right-radius: 100%;
}

.range-picker-start {
  border-top-left-radius: 100%;
  border-bottom-left-radius: 100%;
}

// end of range picker
.range-picker-end-container {
  background-color: rgb(219, 239, 239);
  width: 38px;
  //margin-right: 4px;
}

.range-picker {
  &-span-end {
    margin-left: 4px;
  }

  &-span-start {
    margin-right: 4px;
  }

  color: white;
  background-color: rgb(103, 191, 187);
}
</style>

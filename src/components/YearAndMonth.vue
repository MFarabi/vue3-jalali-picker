<template>
  <div ref="calendar-year" class="cyp" :style="{ height }">
    <div class="cy-header">
      <BIconChevronLeft
        class="pointer-on-hover"
        @click="onChangeYearClicked(-1)"
      />
      <span class="pointer-on-hover">{{
        moment(value).format(locale === 'fa' ? 'jYYYY' : 'YYYY')
          | changeLocale(locale)
      }}</span>
      <BIconChevronRight
        class="pointer-on-hover"
        @click="onChangeYearClicked(1)"
      />
    </div>

    <div class="cy-months">
      <div
        v-for="i in 12"
        :key="i"
        :class="{
          'cy-selected':
            i - 1 ===
            (locale === 'en'
              ? selectedMonth
              : selectedMonth - 3 < 0
              ? selectedMonth + 9
              : selectedMonth - 3),
        }"
        class="cy-each-month"
        @click="onMonthClick(i - 1)"
      >
        {{
          locale === 'en'
            ? moment.monthsShort()[i - 1].toUpperCase()
            : PERSIAN_MONTHS[i - 1]
        }}
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import moment from 'jalali-moment';
import { BIconChevronLeft, BIconChevronRight } from 'bootstrap-vue';
import { PERSIAN_MONTHS } from '@/utils/const-variables';

export default Vue.extend({
  name: 'DatePickerYearAndMonth',
  components: {
    BIconChevronRight,
    BIconChevronLeft,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
    locale: {
      type: String,
      default: 'en',
    },
    height: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      moment,
      PERSIAN_MONTHS,
      selectedTime: this.value,
      selectedMonth: moment(this.value).toDate().getMonth(),
      selectedYear: new Date().getFullYear(),
    };
  },
  watch: {
    selectedYear() {
      this.$emit('input', {
        date: `${this.selectedYear}-${this.selectedMonth}`,
        close: false,
      });
    },
  },
  mounted() {
    this.$refs['calendar-year'].style.top = '0px';
  },
  methods: {
    onMonthClick(index) {
      this.selectedMonth = +index + 1;
      this.$emit('input', {
        date: `${this.selectedYear}-${
          this.locale === 'en' ? this.selectedMonth : this.selectedMonth + 3
        }`,
        close: true,
      });
    },
    // onChangeYearClicked(item: -1 | 1) {
    onChangeYearClicked(item) {
      this.selectedYear += item;
      this.$emit('input', {
        date: `${this.selectedYear}-${this.selectedMonth}`,
        close: false,
      });
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/components/pickers/date-picker/DatePicker';
@import '@/components/pickers/date-picker/PickerOverlays';
</style>

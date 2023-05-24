<template>
  <div ref="calendarYear" class="cyp" :style="{ height }">
    <div class="cy-header">
      <TheChevron class="pointer-on-hover rotate" @click="onChangeYearClicked(-1)" />
      <span class="pointer-on-hover">{{
        changeLocale(moment(value).format(locale === "fa" ? "jYYYY" : "YYYY"), locale)
      }}</span>
      <TheChevron class="pointer-on-hover" @click="onChangeYearClicked(1)" />
    </div>

    <div class="cy-months">
      <div
        v-for="i in 12"
        :key="i"
        :class="{
          'cy-selected':
            i - 1 === (locale === 'en' ? selectedMonth : selectedMonth - 3 < 0 ? selectedMonth + 9 : selectedMonth - 3),
        }"
        class="cy-each-month"
        @click="onMonthClick(i - 1)"
      >
        {{ locale === "en" ? moment.monthsShort()[i - 1].toUpperCase() : PERSIAN_MONTHS[i - 1] }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import moment from "jalali-moment";
import TheChevron from "../components/icons/TheChevron.vue";
import { PERSIAN_MONTHS } from "../utils/constants";
import { IYearAndMonthProps } from "../types/YearAndMonthPicker.type";
import { onMounted, ref, watch } from "vue";
import changeLocale from "../filters/changeLocale.filter";

const props = defineProps<IYearAndMonthProps>();

const emit = defineEmits<{
  (e: "input", value: { date: string; close: boolean }): void;
}>();

const calendarYear = ref<HTMLDivElement | null>(null);

const selectedMonth = ref(moment(props.value).toDate().getMonth());
const selectedYear = ref(new Date().getFullYear());

const onMonthClick = (index: number) => {
  selectedMonth.value = +index + 1;
  emit("input", {
    date: `${selectedYear.value}-${props.locale === "en" ? selectedMonth.value : selectedMonth.value + 3}`,
    close: true,
  });
};

const onChangeYearClicked = (item: -1 | 1) => {
  selectedYear.value += item;
  emit("input", {
    date: `${selectedYear.value}-${selectedMonth.value}`,
    close: false,
  });
};

onMounted(() => {
  if (calendarYear.value) calendarYear.value.style.top = "0px";
});

watch(
  () => selectedYear,
  () => {
    emit("input", {
      date: `${selectedYear.value}-${selectedMonth.value}`,
      close: false,
    });
  }
);
</script>

<style scoped>
@import "../assets/DatePicker.css";
@import "../assets/PickerOverlays.css";
</style>

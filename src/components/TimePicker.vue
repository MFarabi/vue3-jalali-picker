<template>
  <div ref="calendar-time" class="cyp" :style="{ height }">
    <div class="time-picker" :style="{ height }">
      <div class="hour-container">
        <div
          v-for="hour in 24"
          :key="hour"
          class="time-indicator"
          :class="{
            active:
              time.format('HH') === ((hour - 1).toString().length === 1 ? '0' + (hour - 1) : (hour - 1).toString()),
          }"
          @click="hourSelected(hour - 1)"
        >
          {{ (hour - 1).toString().length === 1 ? "0" + (hour - 1) : hour - 1 }}
        </div>
      </div>
      <div class="time-picker-separator"><p>:</p></div>
      <div class="minute-container">
        <div
          v-for="minute in 60"
          :key="minute"
          class="time-indicator"
          :class="{
            active:
              time.format('mm') ===
              ((minute - 1).toString().length === 1 ? '0' + (minute - 1) : (minute - 1).toString()),
          }"
          @click="minuteSelected(minute - 1)"
        >
          {{ (minute - 1).toString().length === 1 ? "0" + (minute - 1) : minute - 1 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Moment } from "jalali-moment";

const props = defineProps<{ height: string; time: Moment }>();

const emit = defineEmits<{
  (e: "input", value: Moment): void;
}>();

const hourSelected = (hour: number) => {
  emit("input", props.time.clone().set({ hour }));
};

const minuteSelected = (minute: number) => {
  console.log("after set minute: ", props.time.clone().set({ minute }).format());
  emit("input", props.time.clone().set({ minute }));
};
</script>

<style scoped>
@import "../assets/DatePicker.css";
@import "../assets/PickerOverlays.css";

.cyp {
  padding: 10px 0;
  top: 0;
}
.time-picker {
  display: flex;
}
.time-picker > div {
  min-height: 100%;
}
.time-picker > .hour-container {
  flex: 0 0 48%;
}
.time-picker > .time-picker-separator {
  flex: 0 0 4%;
  display: flex;
  align-items: center;
}
.time-picker > .minute-container {
  flex: 0 0 48%;
}
.hour-container,
.minute-container,
.time-picker-separator {
  height: 324px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hour-container::-webkit-scrollbar,
.minute-container::-webkit-scrollbar,
.time-picker-separator::-webkit-scrollbar {
  display: none;
}
.time-picker-separator {
  justify-content: center;
  margin-bottom: 0;
  font-size: 18px;
  font-weight: bold;
}
.time-indicator {
  width: 100%;
  padding: 10px;
  transition: background-color ease 0.5s;
  text-align: center;
  border-radius: 5px;
}
.time-indicator:hover {
  cursor: pointer;
  background-color: #7367f0;
  color: white;
}
.active {
  background-color: #7367f0;
  color: white;
}
</style>

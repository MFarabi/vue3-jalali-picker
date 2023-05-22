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
              time.format('HH') ===
              ((hour - 1).toString().length === 1
                ? '0' + (hour - 1)
                : (hour - 1).toString()),
          }"
          @click="hourSelected(hour - 1)"
        >
          {{ (hour - 1).toString().length === 1 ? '0' + (hour - 1) : hour - 1 }}
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
              ((minute - 1).toString().length === 1
                ? '0' + (minute - 1)
                : (minute - 1).toString()),
          }"
          @click="minuteSelected(minute - 1)"
        >
          {{
            (minute - 1).toString().length === 1
              ? '0' + (minute - 1)
              : minute - 1
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'DatePickerTime',
  props: {
    time: {
      required: true,
      type: Object,
    },
    height: {
      required: true,
      type: String,
    },
  },
  setup(props, context) {
    const hourSelected = (hour) => {
      const newTime = props.time.clone().set({ hour });
      context.emit('input', newTime);
    };

    const minuteSelected = (minute) => {
      const newTime = props.time.clone().set({ minute });
      context.emit('input', newTime);
    };

    return {
      hourSelected,
      minuteSelected,
    };
  },
});
</script>

<style scoped lang="scss">
@import '@/components/pickers/date-picker/DatePicker';
@import '@/components/pickers/date-picker/PickerOverlays';

.cyp {
  padding: 10px 0;
  top: 0;
}

.time-picker {
  display: flex;

  & > div {
    min-height: 100%;
  }

  & > .hour-container {
    flex: 0 0 48%;
  }

  & > .time-picker-separator {
    flex: 0 0 4%;
    display: flex;
    align-items: center;
  }

  & > .minute-container {
    flex: 0 0 48%;
  }
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

  &::-webkit-scrollbar {
    display: none;
  }
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

  &:hover {
    cursor: pointer;
    background-color: #7367f0;
    color: white;
  }
}

.active {
  background-color: #7367f0;
  color: white;
}
</style>

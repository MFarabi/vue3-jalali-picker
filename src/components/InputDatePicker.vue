<template>
  <div class="position-relative">
    <!-- <BInputGroup :id="componentId"> -->
    <div style="color: white">
      <h3>PickerId: {{ pickerId }}</h3>
      <h3>ComponentId: {{ componentId }}</h3>
      <h3>{{ pickerValue && pickerValue.format("YYYY-MM-DD") }}</h3>
    </div>
    <div :id="componentId">
      <input
        ref="input"
        :id="inputId"
        :value="formValue"
        class="datepicker-input"
        :state="!isValidInput ? false : null"
        @input="validateInput"
        @blur="onFormInput"
        @focus="show = true"
      />
      <!-- <BInputGroupAppend v-if="removable && (inputValue || pickerValue)" is-text>
        <feather-icon id="date-picker-close-button" class="cursor-pointer" icon="XIcon" size="16" @click="clearInput" />
      </BInputGroupAppend> -->
      <!-- <BInputGroupAppend v-if="!hideCalendarIcon" is-text>
        <feather-icon
          id="date-picker-close-button"
          class="cursor-pointer"
          icon="CalendarIcon"
          size="16"
          @click="show = true"
        />
      </BInputGroupAppend> -->
      <!-- </BInputGroup> -->
    </div>
    <Transition name="fade">
      <DatePicker
        v-if="show"
        v-model="pickerValue"
        v-on-click-outside="outsideClicked"
        :locale="locale"
        :options="options"
        :range="range"
        :without-time="withoutTime"
        class="absolute-date-picker"
        :default-date="defaultDate"
        style="box-shadow: 0 0 5px gray"
        @input="onInput"
        :id="pickerId"
      />
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import TheChevron from "../components/icons/TheChevron.vue";
import { vOnClickOutside } from "@vueuse/components";
import DatePicker from "./DatePicker.vue";
import moment, { Moment } from "jalali-moment";
import generateId from "../utils/uniqueId";
import { IInputeDatePickerProps } from "../types/InputDatePicker.type";
import { computed, ref, watch, withDirectives } from "vue";
const datePickerInput = ref<HTMLDivElement | null>(null);

const props = defineProps<IInputeDatePickerProps>();

const emit = defineEmits<{
  (e: "input", value: Moment | null): void;
}>();

const pickerValue = ref<Moment | null>(moment(moment(props.modelValue!).isValid() ? props.modelValue! : new Date()));
const inputValue = ref<string | null>(
  moment(props.modelValue! ?? new Date())
    .toDate()
    .toISOString()
);
const show = ref(false);
const isValidInput = ref(true);
const componentId = ref(generateId());
const pickerId = ref("picker-" + componentId.value);
const inputId = ref("input-" + componentId.value);
const input = ref<HTMLInputElement>();

const isPersian = () => props.locale === "fa";

const timeToSelect = (time: Moment) => {
  if (!props.withoutTime) return moment(time);
  return props.timeSelection === "end" ? moment(time).endOf("day") : moment(time).startOf("day");
};

const onInput = (event: Moment) => {
  pickerValue.value = moment(event);
  inputValue.value = moment(event).toDate().toISOString();
};

const format = () => {
  if (props.withoutTime) {
    return isPersian() ? "jYYYY-jMM-jDD" : "YYYY-MM-DD";
  }
  return isPersian() ? "jYYYY-jMM-jDD:HH-mm" : "YYYY-MM-DD:HH-mm";
};

const validateInput = (event: Event) => {
  // @ts-ignore
  isValidInput.value = moment(event.target!.value, format()).clone().isValid();
};

// used to handle user input in input tag
const onFormInput = (event: FocusEvent) => {
  if (event && event.target) {
    try {
      // @ts-ignore
      inputValue.value = moment(event.target.value, format()).toISOString();
      pickerValue.value = moment(inputValue.value);
    } catch (e) {}
  }
};

// used to handle what input tag should display
const formValue = computed(() => (inputValue.value ? moment(inputValue.value).format(format()) : null));

const clearInput = () => {
  inputValue.value = null;
  pickerValue.value = null;
  emit("input", null);
};

function outsideClicked(event: any) {
  // if (
  //   event &&
  //   event.srcElement &&
  //   event.srcElement.offsetParent &&
  //   event.srcElement.offsetParent.id !== componentId.value
  // ) {
  //   show.value = false;
  // }
  // if (
  //   event.srcElement.id === "date-picker-close-button" ||
  //   (event.srcElement.nearestViewportElement &&
  //     event.srcElement.nearestViewportElement.id === "date-picker-close-button") ||
  //   (event.srcElement.farthestViewportElement &&
  //     event.srcElement.farthestViewportElement.id === "date-picker-close-button") ||
  //   (event.srcElement.classList && event.srcElement.classList.contains("datepicker-input"))
  // ) {
  //   return;
  // }
  if (event.srcElement.classList.contains("cy-each-month")) return;
  if (event.srcElement.classList.contains("time-indicator")) return;
  if (
    event.srcElement.id === componentId.value ||
    event.srcElement.id === pickerId.value ||
    event.srcElement.id === inputId.value
  )
    return;
  show.value = false;
}

watch(
  () => inputValue.value,
  () => {
    try {
      if (moment(inputValue.value!, format()).format(format()) === moment(pickerValue.value!).format(format())) {
        return;
      }
      if (!moment(inputValue.value!).isValid()) return;
      pickerValue.value = moment(inputValue.value!);
      //   onFormInput(inputValue.value!);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
);

watch(
  () => props.options,
  () => {
    try {
      if (
        props.options &&
        props.options.minDate &&
        props.modelValue &&
        props.modelValue.isBefore(moment(props.options.minDate).clone().add(1, "minute"))
      ) {
        inputValue.value = moment(props.options.minDate).add(1, "minute").toISOString();
        emit("input", timeToSelect(moment(props.options.minDate).add(1, "minute")));
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
);

watch(
  () => props.options,
  () => {
    if (
      props.options &&
      props.options.minDate &&
      pickerValue.value &&
      pickerValue.value.isBefore(props.options.minDate)
    ) {
      pickerValue.value = props.options.minDate;
      inputValue.value = pickerValue.value.toISOString();
    }
  }
);

watch(
  () => pickerValue.value,
  () => {
    try {
      if (!pickerValue.value || !inputValue.value) {
        inputValue.value = null;
        pickerValue.value = null;
      } else {
        inputValue.value = pickerValue.value.toDate().toISOString();
      }
      emit("input", timeToSelect(pickerValue.value!));
      isValidInput.value = true;
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
);

watch(
  () => props.modelValue,
  () => {
    if (!moment(props.modelValue!).isValid()) return;
    if (inputValue.value && inputValue.value.length === 10) {
      inputValue.value = !props.modelValue ? null : props.modelValue.toISOString();
    }
  }
);
</script>

<style scoped>
.position-relative {
  height: 38px;
}

.absolute-date-picker {
  position: relative;
  top: 0;
  left: 0;
  z-index: 10;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

input:read-only {
  background-color: initial;
  border-color: initial;
  -webkit-tap-highlight-color: revert;
}
</style>

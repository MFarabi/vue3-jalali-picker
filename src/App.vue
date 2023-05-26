<template>
  <div class="container">
    <div>
      <InputDatePicker
        v-model="inputeDate"
        :default-date="moment()"
        :locale="'en'"
        :hide-calendar-icon="false"
        :removable="false"
        :options="{
          colors: { primaryColor: 'purple', textColor: 'black', grayedOutTextColor: 'gray', selectedText: 'white' },
        }"
      />
    </div>
    <div>
      <DatePicker
        v-model="date"
        locale="fa"
        :options="{
          colors: { primaryColor: 'purple', textColor: 'black', grayedOutTextColor: 'gray', selectedText: 'white' },
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DatePicker from "./components/DatePicker.vue";
import InputDatePicker from "./components/InputDatePicker.vue";
import moment from "jalali-moment";

const date = ref(moment());
const inputeDate = ref(moment().toISOString());
</script>

<style scoped>
@import url("https://v1.fontapi.ir/css/Yekan");
.container {
  background-color: #242424;
  height: 100vh;
  width: 100vw;
  display: flex;
  font-family: Yekan, sans-serif;
}

.container > div {
  width: 50vw;
  height: 100vh;
  display: flex;
  align-items: start;
  justify-content: start;
}
</style>

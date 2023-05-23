<template>
  <div class="container">
    <DatePicker
      v-model="date"
      locale="fa"
      :options="{
        colors: { primaryColor: 'purple', textColor: 'black', grayedOutTextColor: 'gray', selectedText: 'white' },
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DatePicker from "./components/DatePicker.vue";
import moment from "jalali-moment";

const date = ref(moment());
</script>

<style scoped>
@import url("https://v1.fontapi.ir/css/Yekan");
.container {
  background-color: #242424;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Yekan, sans-serif;
}
</style>

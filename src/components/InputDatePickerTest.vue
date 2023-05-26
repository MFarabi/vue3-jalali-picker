<template>
  <div>
    <h1 style="color: white">InputDatePicker</h1>
    <h2 style="color: white">value is: {{ value }}</h2>
    <h3 style="color: white">the date is: {{ theDate.toISOString() }}</h3>
  </div>
</template>

<script setup lang="ts">
import { Moment } from "jalali-moment";

const props = defineProps<{ value: string; theDate: Moment }>();
</script>

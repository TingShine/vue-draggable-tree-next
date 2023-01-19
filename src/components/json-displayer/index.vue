<template>
  <div class="bg-amber-100 rounded-md shadow-xl opcacity-95 p-4 text-sm">
    <h3 class="text-lg font-bold">{{ title }}</h3>
    <pre>{{ valueString }}</pre>
  </div>
</template>

<script lang="ts" setup>
import { computed, type PropType } from "vue";

const props = defineProps({
  title: {
    required: true,
    type: String as PropType<string>,
  },
  value: {
    required: true,
    type: Array as PropType<any[]>,
  },
});

const valueString = computed(() => JSON.stringify(props.value, null, 2));
</script>
<style scoped>
pre {
  text-align: start;
}
</style>

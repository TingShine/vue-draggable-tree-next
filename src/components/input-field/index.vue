<template>
  <input
    ref="inputField"
    type="text"
    class="rounded-sm py-0.5 px-2"
    :value="modelValue"
    @keyup.enter="handleChange"
    @focusout="handleChange"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "String",
  },
});

const $emit = defineEmits(["update:modelValue", "finish"]);
const handleChange = (e: Event) => {
  // @ts-ignore
  $emit("finish", e?.target?.value || props.modelValue);
};

const inputField = ref<null | Element>(null);
onMounted(() => {
  if (inputField.value) {
    // @ts-ignore
    inputField.value.focus();
  }
});
</script>

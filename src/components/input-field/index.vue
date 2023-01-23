<template>
  <!-- 文本输入框 -->
  <t-input
    v-if="type === 'String'"
    :defaultValue="modelValue"
    autofocus
    @enter="(value) => handleOperation(value, 'enter')"
    @blur="(value) => handleOperation(value, 'blur')"
    @change="(value) => handleChange(value)"
  ></t-input>
  <!-- 数字输入框 -->
  <t-input-number
    v-else-if="type === 'Number'"
    :defaultValue="modelValue"
    autofocus
    @enter="(value) => handleOperation(value, 'enter')"
    @blur="(value) => handleOperation(value, 'blur')"
    @change="(value) => handleChange(value)"
  ></t-input-number>
  <!-- 开关 -->
  <t-switch
    v-else-if="type === 'Boolean'"
    :defaultValue="true"
    size="large"
    @change="(value) => handleChange(value)"
  >
    <template #label="slotProps">
      {{ slotProps.value ? "true" : "false" }}
    </template>
  </t-switch>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import {
  Input as TInput,
  InputNumber as TInputNumber,
  Switch as TSwitch,
  type InputNumberValue,
  type InputValue,
} from "tdesign-vue-next";

const props = defineProps({
  modelValue: {
    default: "",
  },
  type: {
    type: String,
    default: "String",
  },
  autoFocus: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  blurFinish: {
    type: Boolean,
    default: true,
  },
});

const $emit = defineEmits(["update:modelValue", "finish"]);
const handleOperation = (
  value: InputValue | InputNumberValue,
  type: "enter" | "blur"
) => {
  if (type === "blur" && !props.blurFinish) {
    return;
  }
  $emit("update:modelValue", value);
  $emit("finish", value);
};

const handleChange = (value: any) => {
  $emit("update:modelValue", value);
};
</script>

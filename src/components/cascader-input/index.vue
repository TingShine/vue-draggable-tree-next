<template>
  <div>
    <t-select
      v-model="type"
      :options="options"
      placeholder="请选择值类型"
      @change="handleSelectType"
    ></t-select>
    <input-field v-if="type" :type="type"></input-field>
  </div>
</template>

<script lang="ts" setup>
import { Select as TSelect, type SelectValue } from "tdesign-vue-next";
import { ref } from "vue";
import { cascaderSelectOptions } from "@/utils/config";
import InputField from '../input-field/index.vue';

const options = ref(cascaderSelectOptions);
const type = ref("");

const handleSelectType = (value: SelectValue) => {
  // switch(value) {
  //   case 'Number'
  // }
}
</script>

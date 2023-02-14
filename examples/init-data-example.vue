<template>
  <draggable-tree :init-data="initObject" @change="handleChange" />
  <json-displayer
    title="初始化数据为对象"
    :value="displayData"
  ></json-displayer>
</template>

<script lang="ts" setup>
import DraggableTree from "../packages/components/draggable-nested-tree/index.vue";
import JsonDisplayer from "./json-displayer/index.vue";
import { ref } from "vue";

const initObject = {
  Shrek: {},
  Fiona: {
    "Prince Charming": {
      LordFarquad: "测试1",
      LordLogo: "测试2",
    },
  },
  Donkey: [],
  Yes: [],
};

const displayData = ref([]);

const handleChange = (data: any) => {
  displayData.value = data;
};
</script>

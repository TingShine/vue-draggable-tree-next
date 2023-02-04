<template>
  <draggable-tree :init-tree-data="initTreeData" @change="handleChange" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import DraggableTree from "../packages/components/draggable-nested-tree/index.vue";

const initTreeData = ref([
  {
    id: 1,
    key: "Shrek",
    children: [],
    type: "Object",
    bg: "bg-cyan-50",
  },
  {
    id: 2,
    key: "Fiona",
    type: "Object",
    children: [
      {
        id: 5,
        key: "Prince Charming",
        type: "Object",
        children: [
          {
            id: 4,
            key: "LordFarquad",
            type: "KeyValue_String",
            value: "测试1",
            children: [],
          },
          {
            id: 7,
            key: "LordLogo",
            type: "KeyValue_String",
            value: "测试2",
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    key: "Donkey",
    type: "Array",
    bg: "bg-violet-50",
    children: [],
  },
  {
    id: 6,
    key: "Yes",
    type: "Array",
    children: [],
  },
]);

const handleChange = (data: any) => {
  console.log(data);
};
</script>

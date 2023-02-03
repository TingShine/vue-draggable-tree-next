<template>
  <draggable-tree :init-data="obj" @change="handleChange" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
import DraggableTree from "./components/draggable-nested-tree/index.vue";

const handleChange = (data: any) => {
  console.log(data);
};

const obj = {
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

const list = ref([
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
</script>
<style scoped>
.button {
  margin-top: 35px;
}
.handle {
  float: left;
  padding-top: 8px;
  padding-bottom: 8px;
}
.close {
  float: right;
  padding-top: 8px;
  padding-bottom: 8px;
}
input {
  display: inline-block;
  width: 50%;
}
.text {
  margin: 20px;
}

.list-group {
}

.list-group-item {
  height: 50px;
  cursor: pointer;
}
</style>

<template>
  <draggable-tree :init-data="list" />

</template>

<script lang="ts" setup>
import { ref } from "vue";
import DraggableTree from "./components/draggable-nested-tree/index.vue";

enum Colors {
  Yellow = "yellow",
  Green = "emerald",
  Blue = "blue",
  Pink = "pink",
  Gray = "grey",
}

const list = ref([
  {
    id: 1,
    key: "Shrek",
    children: [],
    type: "Object",
    bg: 'bg-cyan-50'
  },
  {
    id: 2,
    key: "Fiona",
    type: "Array",
    children: [
      {
        id: 5,
        key: "Prince Charming",
        type: "Array",
        children: [
          {
            id: 4,
            key: "Lord Farquad",
            type: "String",
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
    bg: 'bg-violet-50',
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

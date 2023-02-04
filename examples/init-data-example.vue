<template>
  <draggable-tree :init-data="initObject" @change="handleChange" />
</template>

<script lang="ts" setup>
import DraggableTree from "../packages/components/draggable-nested-tree/index.vue";

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

const handleChange = (data: any) => {
  console.log(data);
};
</script>

# vue-draggable-tree-next

本组件是基于vue3 + [Vue.Draggable](https://github.com/SortableJS/Vue.Draggable)构建的可拖拽、可视化的JSON树，支持节点新建、复制粘贴、编辑、拖拽和删除等功能

## 特性

- 初始化数据支持对象`Object`，同时支持自定义视图
- 节点类型覆盖数值、布尔值、字符串、键值对、对象、数组和自定义
- 节点支持新增、编辑、复制粘贴和删除
- 节点可进行拖拽剪贴至其他节点下
## 演示
![display](./preview.gif)
## 安装

需要提前安装`tdesign-vue-next`，主要用于icon的使用和消息提示

```bash
npm install vue-draggable-tree-next tdesign-vue-next
```

## 示例

```vue
<template>
    <draggable-tree :init-data="initObject" @change="handleChange" />
</template>

<script lang="ts" setup>
import DraggableTree from "../packages/components/draggable-nested-tree/index.vue";
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


const handleChange = (data: any) => {
  console.log(data);
};
</script>

```
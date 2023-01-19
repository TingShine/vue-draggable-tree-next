<template>
  <nested-tree :list="treeData"></nested-tree>
  <json-displayer :value="treeData" title="对应数据"></json-displayer>
</template>

<script lang="ts">
import NestedTree from "./nested-tree.vue";
import { defineComponent, ref, onMounted, toRefs, type PropType } from "vue";
import { useColor } from "../../utils/color-random";
import JsonDisplayer from "../json-displayer/index.vue";
import { initNodeItemData } from ".";

export default defineComponent({
  name: "DraggableTree",
  components: {
    NestedTree,
    JsonDisplayer,
  },
  props: {
    initData: {
      type: Array as PropType<any[]>,
      required: true,
    },
  },
  setup(props) {
    const { initData } = toRefs(props);

    const treeData = ref<any[]>([]);
    const { getRandomColor } = useColor("bg");
    onMounted(() => {
      if (initData.value.length) {
        treeData.value = initTreeData(initData.value);
      }
    });

    const initTreeData = (arr: any[], level = 0) => {
      return arr.map((item) => {
        const newItem = { ...initNodeItemData, ...item };
        if (
          newItem.type === "Array" ||
          (newItem.type === "Object" && Array.isArray(newItem.children))
        ) {
          newItem.children = initTreeData(newItem.children, level + 1);
        }

        if (!newItem.bg) {
          newItem.bg = getRandomColor(level);
        }

        return newItem;
      });
    };

    return {
      treeData,
    };
  },
});
</script>

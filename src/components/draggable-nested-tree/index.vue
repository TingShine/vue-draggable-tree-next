<template>
  <nested-tree :list="treeData" @custom-add="handleCustomAdd"></nested-tree>
  <json-displayer :value="parsedTreeData" title="对应数据"></json-displayer>
</template>

<script lang="ts">
import NestedTree from "./nested-tree.vue";
import { defineComponent, ref, onMounted, toRefs, type PropType, computed } from "vue";
import { useColor } from "../../utils/color-random";
import JsonDisplayer from "../json-displayer/index.vue";
import { initNodeItemData, useId } from ".";
import type { INodeItem } from "./type";
import { useTreeData } from "./useParse";

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
    const { getParsedTreeData } = useTreeData()
    const { initData } = toRefs(props);

    const treeData = ref<any[]>([]);
    const parsedTreeData = computed(() => getParsedTreeData(treeData.value));

    const { getRandomColor } = useColor("bg");
    onMounted(() => {
      if (initData.value.length) {
        treeData.value = initTreeData(initData.value);
      }
    });

    const { getNewId, addId } = useId();
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

        if (!newItem.id) {
          newItem.id = getNewId();
        } else {
          const result = addId(newItem.id);
          if (!result) {
            console.warn("当前存在重复的节点id，请检查初始化数据");
          }
        }

        return newItem;
      });
    };

    const handleCustomAdd = (
      element: INodeItem,
      list: INodeItem[],
      params: any
    ) => {
      console.log(element, list, params);
    };

    return {
      treeData,
      parsedTreeData,
      handleCustomAdd,
    };
  },
});
</script>

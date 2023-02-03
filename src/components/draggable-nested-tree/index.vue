<template>
  <nested-tree :list="treeData" @custom-add="handleCustomAdd"></nested-tree>
  <json-displayer :value="parsedTreeData" title="对应数据"></json-displayer>
</template>

<script lang="ts">
import NestedTree from "./nested-tree.vue";
import {
  defineComponent,
  ref,
  onMounted,
  toRefs,
  type PropType,
  computed,
  watchEffect,
} from "vue";
import JsonDisplayer from "../json-displayer/index.vue";
import type { INodeItem } from "./type";
import { useTreeData } from ".";

export default defineComponent({
  name: "DraggableTree",
  emits: ["change", "custom-add"],
  components: {
    NestedTree,
    JsonDisplayer,
  },
  props: {
    initData: {
      type: Object as PropType<any>,
      default() {
        return {};
      },
    },
    initTreeData: {
      type: Array as PropType<any[]>,
      required: false,
    },
  },
  setup(props, { emit }) {
    const { getParsedTreeData, generateTreeData, cpmpleteTreeData } =
      useTreeData();
    const { initData, initTreeData } = toRefs(props);
    const treeData = ref<any[]>([]);
    const parsedTreeData = computed(() => getParsedTreeData(treeData.value));
    watchEffect(() => {
      if (treeData.value.length) {
        emit("change", parsedTreeData.value);
      }
    });

    onMounted(() => {
      if (initTreeData.value) {
        treeData.value = cpmpleteTreeData(initTreeData.value);
      } else {
        treeData.value = generateTreeData(initData.value);
      }
    });

    const handleCustomAdd = (
      element: INodeItem,
      list: INodeItem[],
      params: any
    ) => {
      emit("custom-add", element, list, params);
    };

    return {
      treeData,
      parsedTreeData,
      handleCustomAdd,
    };
  },
});
</script>

<template>
  <slot>
    <transition name="slide-fade">
      <div v-show="visible" class="ml-4 flex">
        <t-tooltip
          v-for="tool in toolList"
          :key="tool.name"
          :content="tool.tip"
        >
          <component
            :is="tool.component"
            class="hover:cursor-pointer hover:scale-125 mr-1 top-0 left-0 translate-y-1 font-bold text-lg"
            :class="tool.class"
            @click="handleClick(tool.event)"
          ></component>
        </t-tooltip>
      </div>
    </transition>
  </slot>
</template>

<script lang="ts" setup>
import { markRaw, type PropType, computed } from "vue";
import { Tooltip as TTooltip } from "tdesign-vue-next";
import { AddCircleIcon, Edit1Icon, DeleteIcon } from "tdesign-icons-vue-next";

const props = defineProps({
  visible: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  tools: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});
const toolBars = markRaw([
  {
    name: "AddIcon",
    component: AddCircleIcon,
    event: "add",
    tip: "新增",
    class: "text-gray-900",
  },
  {
    name: "EditIcon",
    component: Edit1Icon,
    event: "edit",
    tip: "编辑",
    class: "text-gray-900",
  },
  {
    name: "DeleteIcon",
    component: DeleteIcon,
    event: "delete",
    tip: "删除",
    class: "text-rose-600",
  },
]);
const toolList = computed(() =>
  toolBars.filter((tool) => props.tools.includes(tool.name))
);

const $emit = defineEmits(["choose"]);
const handleClick = (type: string) => {
  $emit("choose", type);
};
</script>
<style scoped>
.slide-fade-enter-active {
  transition: all 0.1s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>

<template>
  <slot>
    <transition name="slide-fade">
      <div v-show="visible" class="ml-4 flex">
        <component
          v-for="tool in toolList"
          :key="tool.name"
          :is="tool.component"
          class="hover:cursor-pointer hover:scale-125 mr-1 top-0 left-0 translate-y-1"
          @click="handleClick(tool.event)"
        ></component>
      </div>
    </transition>
  </slot>
</template>

<script lang="ts" setup>
import { markRaw, type PropType, computed } from "vue";
import EditIcon from "@/assets/icons/edit.svg";
import AddIcon from "@/assets/icons/add.svg";
import DeleteIcon from "@/assets/icons/delete.svg";

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
    component: AddIcon,
    event: "add",
  },
  {
    name: "EditIcon",
    component: EditIcon,
    event: "edit",
  },
  {
    name: "DeleteIcon",
    component: DeleteIcon,
    event: "delete",
  },
]);
const toolList = computed(() =>
  toolBars.filter((tool) => props.tools.includes(tool.name))
);

const $emit = defineEmits(["choose"]);
const handleClick = (type: string) => {
  $emit('choose', type)
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

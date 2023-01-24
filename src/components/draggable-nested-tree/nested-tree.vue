<template>
  <draggable
    v-bind="dragOptions"
    tag="div"
    :list="list"
    class="item-container"
    item-key="id"
  >
    <template #item="{ element }">
      <div
        class="item-group bg-opacity-75 rounded-md ml-4"
        @mouseenter="onMouseEnter(element)"
        @mouseleave="onMouseLeave(element)"
        :class="{ [element.bg]: !!element.isShowBg }"
      >
        <div class="p-1">
          <!-- 新增模式 -->
          <template v-if="element.temp">
            <div>
              <cascader-input
                @submit="(params) => handleAddNode(element, list, params)"
                @delete="handleDeleteNode(element, list)"
                @custom-add="
                  (params) => onCustomAdd(element, list, parentType, params)
                "
              ></cascader-input>
            </div>
          </template>
          <template v-else>
            <div
              class="flex h-8 content-center node-item text-lg"
              @mouseenter="handleMouseEnterItem(element)"
              @mouseleave="handleMouseLeaveItem(element)"
            >
              <!-- 展开收缩 -->
              <div
                v-if="
                  (element.type === 'Array' || element.type === 'Object') &&
                  element.children
                "
                class="flex vertical-center h-full mr-2 hover:cursor-pointer"
                @click="handleClick(element)"
              >
                <caret-down-small-icon
                  v-show="!element.hideChildren"
                  size="25px"
                  class="top-0 left-0 translate-y-1 hover:text-sky-600"
                />
                <caret-up-small-icon
                  v-show="!!element.hideChildren"
                  size="25px"
                  class="top-0 left-0 translate-y-1 hover:text-sky-600"
                />
              </div>

              <!-- 结点key -->
              <div class="flex hover:cursor-pointer">
                <span
                  v-if="!element.isKeyEditing"
                  @click="handleDoubleClick(element)"
                  >{{ element.key }}</span
                >
                <input-field
                  v-else
                  v-model="element.key"
                  @finish="element.isKeyEditing = false"
                ></input-field>
                <span v-if="element.type === 'Array'" class="ml-1">
                  <t-tag theme="primary" variant="light">[]</t-tag></span
                >
                <span v-else-if="element.type === 'Object'" class="ml-1">
                  <t-tag theme="primary" variant="light">{}</t-tag></span
                >
              </div>

              <!-- 值展示 -->
              <template
                v-if="element.type !== 'Array' && element.type !== 'Object'"
              >
                <div class="ml-2">
                  <span class="mr-1 text-lg font-bold">:</span>
                  <t-tag theme="primary" variant="light">
                    {{ element.type }}
                  </t-tag>
                  <span class="ml-1 text-sm">{{ element.value || "" }}</span>
                </div>
              </template>

              <!-- 工具栏 -->
              <default-tool-bar
                :tools="getToolBar(element.type)"
                :visible="element.showToolBar"
                @choose="(type) => handleChooseTool(type, element, list)"
              >
                <slot name="tools" :element="element" :parent="list"> </slot>
              </default-tool-bar>
            </div>
          </template>

          <!-- 子嵌套 -->
          <template v-if="element.type === 'Array'">
            <nested-tree
              v-show="!element.hideChildren"
              class="item-sub ml-4"
              :list="element.children"
              parent-type="Array"
              @custom-add="handleCustomAdd"
            >
              <template #tools="{ element: childElement, parent }">
                <default-tool-bar
                  :tools="getToolBar(childElement.type)"
                  :visible="childElement.showToolBar"
                  @choose="
                    (type) => handleChooseTool(type, childElement, parent)
                  "
                >
                  <slot name="tools" :element="childElement" :parent="parent">
                  </slot>
                </default-tool-bar>
              </template>
            </nested-tree>
          </template>
          <template v-else-if="element.type === 'Object'">
            <nested-tree
              v-show="!element.hideChildren"
              class="item-sub ml-4"
              :list="element.children"
              parent-type="Object"
              @custom-add="handleCustomAdd"
            >
              <template #tools="{ element: childElement, parent }">
                <default-tool-bar
                  :tools="getToolBar(childElement.type)"
                  :visible="childElement.showToolBar"
                  @choose="
                    (type) => handleChooseTool(type, childElement, parent)
                  "
                >
                  <slot name="tools" :element="childElement" :parent="parent">
                  </slot>
                </default-tool-bar>
              </template>
            </nested-tree>
          </template>
        </div>
      </div>
    </template>
  </draggable>
</template>

<script lang="ts" setup>
import Draggable from "vuedraggable";
import DefaultToolBar from "../default-toolbar/index.vue";
import InputField from "../input-field/index.vue";
import { useDoubleClick } from "../../utils/double-click";
import { reactive, type PropType, computed, ref } from "vue";
import type { INodeItem, ITempNode } from "./type";
import { CaretDownSmallIcon, CaretUpSmallIcon } from "tdesign-icons-vue-next";
import CascaderInput from "../cascader-input/index.vue";
import { initNodeItemData, useAddNode, useHover, useTool } from ".";
import { Tag as TTag, MessagePlugin } from "tdesign-vue-next";
import { useColor } from "@/utils/color-random";

const props = defineProps({
  list: {
    type: Array as PropType<any[]>,
    required: true,
  },
  parentType: {
    type: String,
    default: "",
  },
});

const $emit = defineEmits(["customAdd"]);

//
const dragDefaultOptions = reactive({
  animation: 0,
  group: "DraggableTree",
  disabled: false,
  put: true,
  ghostClass: "ghost",
});
const dragOptions = computed(() => {
  if (props.list.length === 1) {
    console.log(props.list);

    const lastItem = props.list[0];
    if (lastItem.type !== "Array" || lastItem.type !== "Object") {
      return Object.assign({ put: false }, dragDefaultOptions);
    }
  }

  return dragDefaultOptions;
});

const baseTools = ref(["EditIcon", "DeleteIcon"]);
const arrObjTools = ref(["AddIcon", "EditIcon", "DeleteIcon"]);
const getToolBar = (type: string) => {
  return type === "Array" || type === "Object"
    ? arrObjTools.value
    : baseTools.value;
};

// 点击展开收缩图标
const handleClick = (element: INodeItem) => {
  element.hideChildren = !element.hideChildren;
};

const { onCustomAdd, handleAddNode, handleCustomAdd } = useAddNode($emit);

const {
  handleMouseEnterItem,
  handleMouseLeaveItem,
  onMouseEnter,
  onMouseLeave,
} = useHover();
const { handleChooseTool, handleEditKey, handleDeleteNode } = useTool();
const { handleDoubleClick } = useDoubleClick(handleEditKey);
</script>

<style scoped>
.item-container {
}
.item {
  margin: 10px;
  border: solid black 1px;
  background-color: #fefefe;
}
</style>

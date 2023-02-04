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
        class="item-group bg-opacity-75 rounded-md"
        @mouseenter="onMouseEnter(element)"
        @mouseleave="onMouseLeave(element)"
        :class="{ [element.bg]: !!element.isShowBg }"
      >
        <div class="p-1">
          <!-- 新增模式 -->
          <template v-if="element.temp">
            <div>
              <cascader-input
                :parent-type="parentType"
                @submit="
                  (params) =>
                    handleAddNode(
                      element,
                      list,
                      Object.assign({ parentType }, params)
                    )
                "
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
                  (element.type === 'Array' ||
                    element.type === 'Object' ||
                    element.type === 'Single_Array' ||
                    element.type === 'Single_Object') &&
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
                <caret-right-small-icon
                  v-show="!!element.hideChildren"
                  size="25px"
                  class="top-0 left-0 translate-y-1 hover:text-sky-600"
                />
              </div>

              <!-- 结点key -->
              <div class="flex hover:cursor-pointer mr-2">
                <span
                  v-show="element.key"
                  @click="handleDoubleClick(element)"
                  >{{ element.key }}</span
                >
                <span
                  v-if="
                    element.type === 'Array' || element.type === 'Single_Array'
                  "
                  class="ml-1"
                >
                  <t-tag theme="primary" variant="light">
                    [
                    <span v-show="element.children.length" class="font-bold"
                      >...</span
                    >]
                  </t-tag>
                </span>
                <span
                  v-else-if="
                    element.type === 'Object' ||
                    element.type === 'Single_Object'
                  "
                  class="ml-1"
                >
                  <t-tag theme="primary" variant="light"
                    >{<span v-show="element.children.length" class="font-bold"
                      >...</span
                    >}</t-tag
                  ></span
                >
              </div>

              <!-- 值展示 -->
              <template
                v-if="
                  element.type !== 'Array' &&
                  element.type !== 'Object' &&
                  element.type !== 'Single_Array' &&
                  element.type !== 'Single_Object'
                "
              >
                <div>
                  <span v-show="element.key" class="mr-1 text-lg font-bold"
                    >:</span
                  >
                  <t-tag theme="primary" variant="light">
                    {{
                      element.type.startsWith("KeyValue_")
                        ? element.type.split("KeyValue_")[1]
                        : element.type
                    }}
                  </t-tag>
                  <span class="ml-1 text-sm">{{ element.value }}</span>
                </div>
              </template>

              <!-- 工具栏 -->
              <default-tool-bar
                v-if="element.showToolBar"
                :tools="getToolBar(element.type, copyNodeItem)"
                :visible="element.showToolBar"
                @choose="(type) => handleChooseTool(type, element, list)"
              >
                <slot name="tools" :element="element" :parent="list"> </slot>
              </default-tool-bar>
            </div>
          </template>

          <!-- 子嵌套 -->
          <template
            v-if="element.type === 'Array' || element.type === 'Single_Array'"
          >
            <nested-tree
              v-show="!element.hideChildren"
              class="item-sub ml-8"
              :list="element.children"
              parent-type="Array"
              @custom-add="handleCustomAdd"
            >
              <template #tools="{ element: childElement, parent }">
                <default-tool-bar
                  :tools="getToolBar(childElement.type, copyNodeItem)"
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
          <template
            v-else-if="
              element.type === 'Object' || element.type === 'Single_Object'
            "
          >
            <nested-tree
              v-show="!element.hideChildren"
              class="item-sub ml-8"
              :list="element.children"
              parent-type="Object"
              @custom-add="handleCustomAdd"
            >
              <template #tools="{ element: childElement, parent }">
                <default-tool-bar
                  :tools="getToolBar(childElement.type, copyNodeItem)"
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
import { useDoubleClick } from "../../utils/double-click";
import { reactive, type PropType, computed, ref } from "vue";
import type { INodeItem } from "./type";
import {
  CaretDownSmallIcon,
  CaretRightSmallIcon,
} from "tdesign-icons-vue-next";
import CascaderInput from "../cascader-input/index.vue";
import { initNodeItemData, useAddNode, useHover, useTool } from ".";
import { Tag as TTag, MessagePlugin } from "tdesign-vue-next";

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
    const lastItem = props.list[0];
    if (lastItem.type !== "Array" || lastItem.type !== "Object") {
      return Object.assign({ put: false }, dragDefaultOptions);
    }
  }

  return dragDefaultOptions;
});

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
const {
  copyNodeItem,
  getToolBar,
  handleChooseTool,
  handleEditKey,
  handleDeleteNode,
} = useTool();
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

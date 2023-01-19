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
              class="relative h-full mr-2 hover:cursor-pointer"
              @click="handleClick(element)"
            >
              <expand-more
                v-show="!element.hideChildren"
                class="top-0 left-0 translate-y-1"
              />
              <expand-less
                v-show="!!element.hideChildren"
                class="top-0 left-0 translate-y-1"
              />
            </div>

            <!-- 结点key -->
            <div class="hover:cursor-pointer">
              <span
                v-if="!element.isKeyEditing"
                @click="handleDoubleClick(element)"
                >{{ element.key }}</span
              >
              <input-field
                v-else
                :model-value="element.key"
                @finish="(value) => handleFinishEdit(element, value)"
              ></input-field>
              <span v-if="element.type === 'Array'"> []</span>
              <span v-else-if="element.type === 'Object'"> {}</span>
            </div>

            <!-- 工具栏 -->
            <default-tool-bar
              :tools="getToolBar(element.type)"
              :visible="element.showToolBar"
              @choose="(type) => handleChooseTool(type, element, list)"
            >
              <slot name="tools" :element="element" :parent="list"> </slot>
            </default-tool-bar>
          </div>

          <!-- 子嵌套 -->
          <template v-if="element.type === 'Array'">
            <nested-tree
              v-show="!element.hideChildren"
              class="item-sub ml-4"
              :list="element.children"
              parent-type="Array"
            >
              <template #tools="{ element: childElement, parent }">
                <default-tool-bar
                  :tools="getToolBar(childElement.type)"
                  :visible="childElement.showToolBar"
                  @choose="
                    (type) => handleChooseTool(type, childElement, parent)
                  "
                >
                  <slot name="tools" :element="childElement" :parent="parent"> </slot>
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
            >
              <template #tools="{ element: childElement, parent }">
                <default-tool-bar
                  :tools="getToolBar(childElement.type)"
                  :visible="childElement.showToolBar"
                  @choose="
                    (type) => handleChooseTool(type, childElement, parent)
                  "
                >
                  <slot name="tools" :element="childElement" :parent="parent"> </slot>
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
import ExpandMore from "@/assets/icons/expand-more.svg";
import ExpandLess from "@/assets/icons/expand-less.svg";
import type { INodeItem } from "./type";

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

// 判断是否叶子结点
const isLeafNode = computed(
  () =>
    props.list.length === 1 &&
    (!props.list[0].children || props.list[0].children.length === 0)
);

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

// 鼠标移入目标区域
const onMouseEnter = (element: INodeItem) => {
  element.isShowBg = true;
};

// 鼠标移出目标区域
const onMouseLeave = (element: INodeItem) => {
  element.isShowBg = false;
};

// 鼠标移入目标行
const handleMouseEnterItem = (element: INodeItem) => {
  element.showToolBar = true;
};

// 鼠标移出目标行
const handleMouseLeaveItem = (element: INodeItem) => {
  element.showToolBar = false;
};

// 点击工具栏
const handleChooseTool = (
  type: string,
  element: INodeItem,
  parentList?: INodeItem[]
) => {
  switch (type) {
    case "edit":
      handleEditKey(element);
      break;
    case "delete":
      handleDeleteNode(element, parentList);
      break;
  }
};

const handleDeleteNode = (element: INodeItem, parent: INodeItem[] = []) => {
  const index = parent.findIndex((item) => item.id === element.id);
  if (index !== -1) {
    parent.splice(index, 1);
  }
};

const handleEditKey = (element: INodeItem) => {
  element.isKeyEditing = true;
};

const { handleDoubleClick } = useDoubleClick(handleEditKey);

const handleFinishEdit = (element: INodeItem, value: string) => {
  value && (element.key = value);
  element.isKeyEditing = false;
};
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

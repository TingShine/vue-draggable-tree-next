import { useColor } from "@/utils/color-random";
import type { IAddNodeType } from "@/utils/config";
import { MessagePlugin } from "tdesign-vue-next";
import type {
  IAddNodeParams,
  IInitDataOptionalItem,
  INodeItem,
  ITempNode,
} from "./type";

export const initNodeItemData: IInitDataOptionalItem = {
  isKeyEditing: false,
  isValueEditing: false,
  showToolBar: false,
  isShowBg: false,
  hideChildren: false,
  temp: false,
  customData: {},
  children: [],
};

// 工具栏
export const useTool = () => {
  const handleDeleteNode = (element: INodeItem, parent: INodeItem[] = []) => {
    const index = parent.findIndex((item) => item.id === element.id);
    if (index !== -1) {
      parent.splice(index, 1);
    }
  };

  const handleAddNode = (element: INodeItem) => {
    const { type } = element;
    if (type === "Object" || type === "Array") {
      if (!element.children) {
        element.children = [];
      }

      const firstElement = element.children[0];
      if (firstElement && firstElement.temp) {
        return;
      }

      element.hideChildren = false
      element.children?.unshift({
        id: 20,
        temp: true,
      });
    }
  };

  const handleEditKey = (element: INodeItem) => {
    element.isKeyEditing = true;
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
      case "add":
        handleAddNode(element);
        break;
      case "delete":
        handleDeleteNode(element, parentList);
        break;
    }
  };

  return {
    handleChooseTool,
    handleEditKey,
    handleDeleteNode,
  };
};

// hover背景颜色
export const useHover = () => {
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

  return {
    onMouseEnter,
    onMouseLeave,
    handleMouseEnterItem,
    handleMouseLeaveItem,
  };
};

export const useAddNode = ($emit: Function) => {
  const onCustomAdd = (
    element: INodeItem,
    list: INodeItem[],
    parentType: "Array" | "Object",
    params: any
  ) => {
    const newParams = { ...params, ...initNodeItemData, parentType };
    handleCustomAdd(element, list, newParams);
  };

  const handleCustomAdd = (
    element: INodeItem,
    list: INodeItem[],
    params: any
  ) => {
    $emit("customAdd", element, list, params);
  };

  const handleAddNode = (
    element: ITempNode,
    list: INodeItem[],
    params: IAddNodeParams
  ) => {
    const { key, type } = params;

    if (list.some((node) => node.key === key && !node.temp)) {
      MessagePlugin.error("当前key值重复，无法添加");
      return;
    }

    switch (type) {
      case "Number":
        addBaseNode(element, params);
        break;
      case "String":
        addBaseNode(element, params);
        break;
      case "Boolean":
        addBaseNode(element, params);
        break;
      case "Array":
        addArrayOrObjectNode(element, list, params);
        break;
      case "Object":
        addArrayOrObjectNode(element, list, params);
        break;
      case "KeyValue_String":
        addKeyValueNode(element, params);
        break;
      case "KeyValue_Number":
        addKeyValueNode(element, params);
        break;
      case "KeyValue_Boolean":
        addKeyValueNode(element, params);
        break;
    }
  };

  const { getRandomColor } = useColor("bg");
  const addArrayOrObjectNode = (
    element: ITempNode,
    list: INodeItem[],
    params: any
  ) => {
    const { type, key } = params;

    if (list.some((node) => node.key === key)) {
      MessagePlugin.error("当前兄弟节点已存在相同的key值，无法添加");
      return;
    }

    Object.assign(element, {
      ...initNodeItemData,
      key,
      type,
      children: [],
      bg: getRandomColor(2),
    });
  };

  const addBaseNode = (element: ITempNode, params: IAddNodeParams) => {
    const { type, value, parentType } = params;

    if (parentType !== "Array") {
      MessagePlugin.error("当前父节点不为数组，无法添加数值节点");
      return;
    }

    switch (type) {
      case "String":
        element.value = String(value) || "";
        break;
      case "Number":
        element.value = Number(value) ?? 0;
        break;
      case "Boolean":
        element.value = !!value;
        break;
    }

    Object.assign(element, {
      ...initNodeItemData,
      type,
      bg: getRandomColor(3),
    });
  };

  const addKeyValueNode = (element: ITempNode, params: IAddNodeParams) => {
    const { parentType, type, key, value } = params;

    if (parentType !== "Object") {
      MessagePlugin.error("当前父节点不为对象，无法添加键值对");
      return;
    }

    if (!type.startsWith("KeyValue")) {
      MessagePlugin.error("当前节点不为键值对");
      return;
    }

    const realType = type.split("KeyValue_")[1];

    switch (realType) {
      case "String":
        element.value = String(value) || "";
        break;
      case "Number":
        element.value = Number(value) ?? 0;
        break;
      case "Boolean":
        element.value = !!value;
        break;
    }

    Object.assign(element, {
      ...initNodeItemData,
      type: realType,
      key,
      bg: getRandomColor(2),
    });
  };

  return {
    onCustomAdd,
    handleCustomAdd,
    handleAddNode,
  };
};

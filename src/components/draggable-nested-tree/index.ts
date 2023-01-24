import { useColor } from "@/utils/color-random";
import { MessagePlugin } from "tdesign-vue-next";
import type { IInitDataOptionalItem, INodeItem, ITempNode } from "./type";

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
    params: any
  ) => {
    console.log(element, list, params);
    const { key, type } = params;

    if (list.some((node) => node.key === key && !node.temp)) {
      MessagePlugin.error("当前key值重复，无法添加");
      return;
    }

    switch (type) {
      case "Array":
        addArrayOrObjectNode(element, params);
        break;
      case "Object":
        addArrayOrObjectNode(element, params);
        break;
    }
  };

  const { getRandomColor } = useColor("bg");
  const addArrayOrObjectNode = (element: ITempNode, params: any) => {
    const { type, key } = params;
    Object.assign(element, {
      ...initNodeItemData,
      key,
      type,
      children: [],
      bg: getRandomColor(3),
      temp: false,
    });
  };

  return {
    onCustomAdd,
    handleCustomAdd,
    handleAddNode,
  }
};

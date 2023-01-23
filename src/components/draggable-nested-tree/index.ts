import type { IInitDataOptionalItem, INodeItem } from "./type";

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

      const firstElement = element.children[0]
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
    handleDeleteNode
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

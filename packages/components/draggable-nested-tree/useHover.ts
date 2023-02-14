import type { INodeItem } from "./type";

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
import type { INodeItem } from "./type";
import { useData } from "./useData";
import { canAddChildNode } from "./useTool";

export const useMove = () => {
  const { treeData } = useData();

  const checkChildren = (parent: any[], list: any[]): false | INodeItem => {
    let parentNode = null;
    parent.some((node) => {
      if (node.children === list) {
        parentNode = node;
        return true;
      }

      if (Array.isArray(node.children) && node.children.length > 0) {
        return checkChildren(node.children, list);
      }

      return false;
    });

    return parentNode || false;
  };

  const handleMoveCallback = (evt: any): boolean => {
    const { draggedContext, relatedContext } = evt;

    if (!relatedContext.list) {
      return false;
    }
    const fromType = draggedContext.element?.type;
    const { list } = relatedContext;

    // 判断在root节点
    if (treeData.value === list) {
      return canAddChildNode(fromType, "Single_Object");
    }

    const node = checkChildren(treeData.value, list);
    if (node) {
      return canAddChildNode(fromType, node.type!);
    }

    return true;
  };

  return {
    handleMoveCallback,
  };
};

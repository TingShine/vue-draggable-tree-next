import { useColor } from "@/utils/color-random";
import { MessagePlugin } from "tdesign-vue-next";
import { ref } from "vue";
import { useId } from ".";
import type { INodeItem } from "./type";

const isArrOrObjType = (type: string): boolean =>
  ["Array", "Object", "Single_Array", "Single_Object"].includes(type);

const copyNodeItem = ref<null | INodeItem>(null);
// 工具栏
export const useTool = () => {
  const baseTools = ref(["CopyIcon", "EditIcon", "DeleteIcon"]);
  const arrObjTools = ref(["AddIcon", "CopyIcon", "EditIcon", "DeleteIcon"]);
  const getToolBar = (type: string, copyItem: null | INodeItem) => {
    const tools = isArrOrObjType(type) ? arrObjTools.value : baseTools.value;
    return copyItem ? [...tools, "PasteIcon"] : tools;
  };

  const handleDeleteNode = (element: INodeItem, parent: INodeItem[] = []) => {
    const index = parent.findIndex((item) => item.id === element.id);
    if (index !== -1) {
      parent.splice(index, 1);
    }
  };

  const handleAddNode = (element: INodeItem) => {
    const { type } = element;
    if (type && isArrOrObjType(type)) {
      if (!element.children) {
        element.children = [];
      }

      const firstElement = element.children[0];
      if (firstElement && firstElement.temp) {
        return;
      }

      element.hideChildren = false;
      const { getNewId } = useId();
      element.children?.unshift({
        id: getNewId(),
        temp: true,
      });
    }
  };

  const handleEditKey = (element: INodeItem) => {
    element.isKeyEditing = true;
  };

  const handleCopyNode = (element: INodeItem) => {
    copyNodeItem.value = element;
    element.showToolBar = false;
    MessagePlugin.success("复制成功");
  };

  const handlePasteNode = (element: INodeItem) => {
    if (!copyNodeItem.value) {
      return;
    }

    const { type: parentType } = element;
    const { type } = copyNodeItem.value!;
    const newNode = { ...copyNodeItem.value };

    if (parentType === "Array") {
      if (type?.startsWith("KeyVal")) {
        MessagePlugin.error("键值对节点无法粘贴在当前父节点下");
        return;
      }
    } else if (parentType === "Object") {
      if (type && ["String", "Number", "Boolean"].includes(type)) {
        MessagePlugin.error("基础类型节点无法粘贴在当前父节点下");
        return;
      }
    }

    const { getNewId } = useId();
    const { getRandomColor } = useColor("bg");
    Object.assign(newNode, {
      id: getNewId(),
      bg: getRandomColor(2),
    });
    element.children!.unshift(newNode);
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
      case "copy":
        handleCopyNode(element);
        break;
      case "paste":
        handlePasteNode(element);
        break;
      case "delete":
        handleDeleteNode(element, parentList);
        break;
    }
  };

  return {
    copyNodeItem,
    getToolBar,
    handleChooseTool,
    handleEditKey,
    handleDeleteNode,
  };
};

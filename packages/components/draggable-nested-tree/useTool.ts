import { useColor } from "@/utils/color-random";
import { MessagePlugin } from "tdesign-vue-next";
import { ref } from "vue";
import { useId } from ".";
import type { INodeItem, INodeItemType } from "./type";

const isArrOrObjType = (type: string): boolean =>
  ["Array", "Object", "Single_Array", "Single_Object"].includes(type);

const copyNodeItem = ref<null | INodeItem>(null);
const baseTools = ["CopyIcon", "EditIcon", "DeleteIcon"];
const arrObjTools = ["AddIcon", "CopyIcon", "EditIcon", "DeleteIcon"];

// 判断是否能添加子节点
export const canAddChildNode = (
  childType: INodeItemType,
  parentType: INodeItemType
): boolean => {
  const isParentArray = parentType === "Array" || parentType === "Single_Array";
  const isParentObject =
    parentType === "Object" || parentType === "Single_Object";

  if (!isParentArray && !isParentObject) {
    return false;
  }

  const supportChildTypes: string[] = [];
  if (isParentArray) {
    supportChildTypes.push(
      ...["String", "Number", "Boolean", "Single_Array", "Single_Object"]
    );
  } else if (isParentObject) {
    supportChildTypes.push(
      ...[
        "KeyValue_String",
        "KeyValue_Number",
        "KeyValue_Boolean",
        "Array",
        "Object",
      ]
    );
  }
  if (!supportChildTypes.includes(childType)) {
    return false;
  }

  return true;
};

// 生成新的节点
const generateNewNode = (element: INodeItem): INodeItem => {
  const { getNewId } = useId();
  const { getRandomColor } = useColor("bg");

  const newNode = {
    ...element,
    id: getNewId(),
    bg: getRandomColor(2),
  };
  if (newNode.children && newNode.children.length) {
    newNode.children = newNode.children.map((node) => generateNewNode(node));
  }

  return newNode;
};

// 工具栏
export const useTool = () => {
  // 获取工具栏列表
  const getToolBar = (type: INodeItemType, copyItem: null | INodeItem) => {
    const tools = isArrOrObjType(type) ? arrObjTools : baseTools;
    if (copyItem && canAddChildNode(copyItem.type!, type)) {
      return [...tools, "PasteIcon"]
    }

    return tools;
  };

  // 删除节点
  const handleDeleteNode = (element: INodeItem, parent: INodeItem[] = []) => {
    const index = parent.findIndex((item) => item.id === element.id);
    if (index !== -1) {
      parent.splice(index, 1);
    }
  };

  // 新增节点
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

  // 编辑节点key值
  const handleEditKey = (element: INodeItem) => {
    element.isKeyEditing = true;
  };

  // 复制节点
  const handleCopyNode = (element: INodeItem) => {
    copyNodeItem.value = element;
    element.showToolBar = false;
    MessagePlugin.success("复制成功");
  };

  // 粘贴节点
  const handlePasteNode = (element: INodeItem) => {
    if (!copyNodeItem.value) {
      return;
    }

    const { type: parentType, children } = element;
    const { type, key } = copyNodeItem.value!;

    if (!canAddChildNode(type!, parentType!)) {
      MessagePlugin.error("粘贴失败，该节点类型无法粘贴在当前父节点下");
      return;
    }

    if (
      type &&
      (type?.startsWith("KeyValue_") || ["Array", "Object"].includes(type))
    ) {
      if (children?.some((childNode) => childNode.key === key)) {
        MessagePlugin.error("粘贴失败，当前父节点已存在该key值");
        return;
      }
    }

    element.children!.unshift(generateNewNode(copyNodeItem.value));
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

import { useColor } from "@/utils/color-random";
import { initNodeItemData } from ".";
import {
  isArray,
  isBoolean,
  isNumber,
  isObject,
  isString,
} from "../../utils/is";
import type { INodeItem, INodeItemType } from "./type";
import { useId } from "./useId";

const isBaseType = (type: INodeItemType) =>
  ["String", "Number", "Boolean"].includes(type);

enum TreeDataTypeEnum {
  Array = "array",
  JSON = "json",
}

export const useTreeData = () => {
  const { getRandomColor } = useColor("bg");
  const { getNewId, addId } = useId();

  const getParsedTreeData = (
    nodeArr: INodeItem[],
    type: TreeDataTypeEnum = TreeDataTypeEnum.JSON
  ) => {
    let temp: any;
    if (type === TreeDataTypeEnum.JSON) {
      temp = {};
    } else if (type === TreeDataTypeEnum.Array) {
      temp = [];
    }

    nodeArr.forEach((node) => {
      parseTreeData(node, temp);
    });

    return temp;
  };

  const parseTreeData = (node: INodeItem, parent: any): void => {
    const { type, key, temp, value } = node;

    if (temp) {
      return;
    }

    if (type === "Object") {
      parent[key!] = {};

      if (node.children && node.children.length) {
        node.children.forEach((child) => {
          parseTreeData(child, parent[key!]);
        });
      }
    } else if (type === "Array") {
      parent[key!] = [];

      if (node.children && node.children.length) {
        node.children.forEach((child) => {
          parseTreeData(child, parent[key!]);
        });
      }
    } else if (type?.startsWith("Single_")) {
      const nodeType = type.split("Single_")[1];
      const tempAddr: any = nodeType === "Array" ? [] : {};
      parent.push(tempAddr);
      node.children?.forEach((child) => {
        parseTreeData(child, tempAddr);
      });
    } else if (type?.startsWith("KeyValue_")) {
      parent[key!] = value;
    } else if (isBaseType(type!)) {
      parent.push(value);
    }
  };

  const generateTreeData = (obj: any) => {
    return Object.keys(obj).map((key) => generateTreeNode(key, obj[key], 0));
  };

  const generateTreeNode = (
    key: string | null = null,
    value: any,
    level = 0
  ) => {
    const newNode: any = {
      ...initNodeItemData,
      bg: getRandomColor(level),
      id: getNewId(),
    };

    if (key) {
      newNode.key = key;
    }

    if (isObject(value)) {
      newNode.type = key ? "Object" : "Single_Oject";
      newNode.children = Object.keys(value).map((key) =>
        generateTreeNode(key, value[key], level + 1)
      );
    } else if (isArray(value)) {
      newNode.type = key ? "Array" : "Single_Array";
      newNode.children = value.map((item) =>
        generateTreeNode(null, item, level + 1)
      );
    } else if (isString(value)) {
      newNode.type = !key ? "String" : "KeyValue_String";
      newNode.value = value;
    } else if (isNumber(value)) {
      newNode.type = !key ? "Number" : "KeyValue_Number";
      newNode.value = value;
    } else if (isBoolean(value)) {
      newNode.type = !key ? "Boolean" : "KeyValue_Boolean";
      newNode.value = value;
    }

    return newNode;
  };

  const cpmpleteTreeData = (arr: any[], level = 0) => {
    return arr.map((item) => {
      const newItem = { ...initNodeItemData, ...item };
      if (
        ["Object", "Single_Object", "Array", "Single_Array"].includes(
          newItem.type
        ) &&
        Array.isArray(newItem.children)
      ) {
        newItem.children = cpmpleteTreeData(newItem.children, level + 1);
      }

      if (!newItem.bg) {
        newItem.bg = getRandomColor(level);
      }

      if (!newItem.id) {
        newItem.id = getNewId();
      } else {
        const result = addId(newItem.id);
        if (!result) {
          console.warn("当前存在重复的节点id，请检查初始化数据");
        }
      }

      return newItem;
    });
  };

  return {
    getParsedTreeData,
    generateTreeData,
    cpmpleteTreeData,
  };
};

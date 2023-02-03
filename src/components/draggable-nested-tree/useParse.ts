import type { INodeItem, INodeItemType } from "./type";

const isBaseType = (type: INodeItemType) =>
  ["String", "Number", "Boolean"].includes(type);

enum TreeDataTypeEnum {
  Array = "array",
  JSON = "json",
}

export const useTreeData = () => {
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

  return {
    getParsedTreeData,
  };
};

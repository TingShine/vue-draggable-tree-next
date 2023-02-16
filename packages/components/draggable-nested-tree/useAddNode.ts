import { useColor } from "@/utils/color-random";
import { MessagePlugin } from "tdesign-vue-next";
import { initNodeItemData } from ".";
import type { IAddNodeParams, INodeItem, ITempNode } from "./type";

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
      case "Object":
        addArrayOrObjectNode(element, list, params);
        break;
      case "KeyValue_String":
      case "KeyValue_Number":
      case "KeyValue_Boolean":
        addKeyValueNode(element, params);
        break;
      case "Single_Array":
      case "Single_Object":
        addSingleNode(element, params);
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

  // 添加基础节点
  const addBaseNode = (element: ITempNode, params: IAddNodeParams) => {
    const { type, value, parentType } = params;

    if (!["Array", "Single_Array"].includes(parentType!)) {
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

  // 添加键值对节点
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

    switch (type) {
      case "String":
        element.value = String(value) || "";
        break;
      case "KeyValue_String":
        element.value = String(value) || "";
        break;
      case "Number":
        element.value = Number(value) ?? 0;
        break;
      case "KeyValue_Number":
        element.value = Number(value) ?? 0;
        break;
      case "Boolean":
        element.value = !!value;
        break;
      case "KeyValue_Boolean":
        element.value = !!value;
        break;
    }

    Object.assign(element, {
      ...initNodeItemData,
      type: type,
      key,
      bg: getRandomColor(2),
    });
  };

  //添加纯数组、纯对象节点
  const addSingleNode = (element: ITempNode, params: IAddNodeParams) => {
    const { type, parentType } = params;

    if (parentType !== "Array" && parentType !== "Single_Array") {
      MessagePlugin.error(
        "父节点类型不为数组，无法添加纯数组或纯对象类型的节点"
      );
      return;
    }

    Object.assign(element, {
      ...initNodeItemData,
      type: type,
      children: [],
      bg: getRandomColor(2),
    });

    delete element.key;
  };

  return {
    onCustomAdd,
    handleCustomAdd,
    handleAddNode,
  };
};

import type { IAddNodeType } from "@/utils/config";

type NodeItemType =
  | "Array"
  | "Object"
  | "String"
  | "Number"
  | "Boolean"
  | "Custom";

export interface ITempNode extends IInitDataOptionalItem {
  id: number;
  temp: boolean;
  key?: string;
  type?: NodeItemType;
}

export interface IInitDataItem extends IInitDataOptionalItem {
  id: number;
  key: string;
  type: NodeItemType;
}

export interface IInitDataOptionalItem {
  bg?: string;
  isKeyEditing?: boolean;
  isValueEditing?: boolean;
  showToolBar?: boolean;
  isShowBg?: boolean;
  hideChildren?: boolean;
  temp?: boolean;
  customData?: Object;
  children?: Array<IInitDataItem | ITempNode>;
  value?: string | number | boolean;
}

export type INodeItem = IInitDataItem | ITempNode;

export interface IAddNodeParams {
  type: IAddNodeType;
  value: string | number | boolean;
  key?: string;
  parentType?: "Array" | "Object";
}

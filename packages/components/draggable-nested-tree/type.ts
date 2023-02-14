export type INodeItemType =
  | "Array"
  | "Object"
  | "String"
  | "Number"
  | "Boolean"
  | "KeyValue_String"
  | "KeyValue_Number"
  | "KeyValue_Boolean"
  | "Single_Array"
  | "Single_Object"
  | "Custom";

export interface ITempNode extends IInitDataOptionalItem {
  id: number;
  temp: boolean;
  key?: string;
  type?: INodeItemType;
}

export interface IInitDataItem extends IInitDataOptionalItem {
  id: number;
  key: string;
  type: INodeItemType;
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
  type: INodeItemType;
  value: string | number | boolean;
  key?: string;
  parentType?: "Array" | "Object" | "Single_Array" | "Single_Object";
}

type NodeItemType = "Array" | "Object" | "String" | "Number" | "Boolean";

export interface IInitDataItem extends IInitDataOptionalItem {
  id: number;
  key: string;
  type: NodeItemType;
  children?: INodeItem[];
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
}

export type INodeItem = IInitDataItem;

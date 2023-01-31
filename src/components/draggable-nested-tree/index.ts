export * from "./useAddNode";
export * from "./useTool";
export * from "./useHover";
export * from "./useId";

import type { IInitDataOptionalItem } from "./type";

export const initNodeItemData: IInitDataOptionalItem = {
  isKeyEditing: false,
  isValueEditing: false,
  showToolBar: false,
  isShowBg: false,
  hideChildren: false,
  temp: false,
  customData: {},
  children: [],
};

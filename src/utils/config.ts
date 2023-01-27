export type IAddNodeType = 'String' |'Number' | 'Boolean' | 'Array' | 'Object' | 'KeyValue_String' | 'KeyValue_Number' | 'KeyValue_Boolean' |'Custom'

export const cascaderSelectOptions = [
  { label: "字符串", value: "String" },
  { label: "数值", value: "Number" },
  { label: "布尔值", value: "Boolean" },
  { label: "数组", value: "Array" },
  { label: "对象", value: "Object" },
  { label: "键值对——字符串", value: "KeyValue_String" },
  { label: "键值对——数值", value: "KeyValue_Number" },
  { label: "键值对——布尔值", value: "KeyValue_Boolean" },
  { label: "自定义", value: "Custom" },
];

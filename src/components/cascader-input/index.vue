<template>
  <div class="flex items-center py-4">
    <!-- 关闭close -->
    <close-icon
      class="mr-2 hover:cursor-pointer hover:text-slate-400"
      @click="handleDelete"
    ></close-icon>
    <t-form ref="formRef" labelWidth="0" class="flex items-center">
      <!-- 类型选择 -->
      <t-select
        v-if="!form.type"
        v-model="form.type"
        :options="options"
        placeholder="请选择节点类型"
        @change="handleSelectType"
      ></t-select>
      <t-tag
        v-show="form.type"
        theme="primary"
        variant="light"
        class="mr-1 hover:cursor-pointer"
        @click="handleDoubleClick"
      >
        {{ form.type }}
      </t-tag>
      <!-- key值，仅键值对、对象出现 -->
      <div v-if="keyVisible" class="flex mr-2 items-center">
        <t-form-item name="key">
          <t-input v-model="form.key" placeholder="请输入key值"></t-input>
        </t-form-item>
        <span
          v-show="keyVisible && valueVisible"
          class="text-lg font-bold mx-1"
        >
          :
        </span>
      </div>
      <div class="flex items-center">
        <!-- value值，仅数值、字符串、布尔值、键值对出现 -->
        <input-field
          v-if="valueVisible"
          v-model="form.value"
          :type="computedType(form.type)"
        ></input-field>
        <t-button
          v-if="form.type"
          type="submit"
          class="ml-4"
          @click="handleSubmit"
          >确认</t-button
        >
      </div>
    </t-form>
  </div>
</template>

<script lang="ts" setup>
import {
  Select as TSelect,
  Tag as TTag,
  Button as TButton,
  Input as TInput,
  Form as TForm,
  FormItem as TFormItem,
  MessagePlugin,
  type SelectValue,
} from "tdesign-vue-next";
import { ref, reactive, toRaw, computed, onMounted } from "vue";
import { cascaderSelectOptions } from "@/utils/config";
import InputField from "../input-field/index.vue";
import { useDoubleClick } from "@/utils/double-click";
import { CloseIcon } from "tdesign-icons-vue-next";

const props = defineProps({
  parentType: {
    type: String,
    default: "Object",
  },
});
const options = ref<any[]>([]);
onMounted(() => {
  switch (props.parentType) {
    case "Array":
    case "Single_Array":
      options.value = cascaderSelectOptions.filter(
        (option) =>
          !option.value.startsWith("KeyValue_") &&
          !["Array", "Object"].includes(option.value)
      );
      break;
    case "Object":
    case "Single_Object":
      options.value = cascaderSelectOptions.filter(
        (option) =>
          !["String", "Number", "Boolean"].includes(option.value) &&
          !option.value.startsWith("Single_")
      );
      break;
    default:
      options.value = cascaderSelectOptions;
  }
});

const $emit = defineEmits(["delete", "submit", "customAdd"]);
const form = reactive<any>({
  key: "",
  type: "",
  value: "",
});
const keyVisible = computed(
  () =>
    form.type &&
    (["Object", "Array"].includes(form.type) ||
      form.type.startsWith("KeyValue"))
);
const valueVisible = computed(
  () =>
    form.type &&
    (["Number", "String", "Boolean"].includes(form.type) ||
      form.type.startsWith("KeyValue"))
);
const computedType = (type: string) =>
  type.startsWith("KeyValue") ? type.split("KeyValue_")[1] : type;

const handleChangeType = () => {
  form.type = "";
};
const { handleDoubleClick } = useDoubleClick(handleChangeType);

const handleSelectType = (value: SelectValue) => {
  switch (value) {
    case "Number":
    case "KeyValue_Number":
      form.value = 0;
      break;
    case "String":
    case "KeyValue_String":
      form.value = "";
      break;
    case "Boolean":
    case "KeyValue_Boolean":
      form.value = true;
      break;
    case " Custom":
      break;
  }
};

const handleSubmit = () => {
  const { key, type } = form;

  if (!type) {
    MessagePlugin.error("请选择值的类型");
    return;
  }

  if (["Object", "Array"].includes(type) || type.startsWith("KeyValue")) {
    if (!key || !/^[0-9a-zA-Z_]+$/.test(key as string)) {
      MessagePlugin.error("key值为必填项，支持英文、数字和下划线");
      return;
    }
  }

  if (form.type === "Custom") {
    handleCustomSubmit();
    return;
  }

  $emit("submit", toRaw(form));
};

const handleCustomSubmit = () => {
  $emit("customAdd", { key: form.key });
};

const handleDelete = () => {
  $emit("delete");
};
</script>

<template>
  <div class="flex items-center py-2">
    <!-- 关闭close -->
    <close-icon
      class="mr-2 hover:cursor-pointer hover:text-slate-400"
      @click="handleDelete"
    ></close-icon>
    <t-form :form="form" labelWidth="0" class="flex">
      <!-- key -->
      <div class="flex mr-2 items-center">
        <t-form-item
          name="key"
          :rules="[
            { required: true, message: 'key值为必填项' },
            {
              pattern: /$[a-zA-Z0-9_]+#/,
              message: '仅限英文字母、数字和下划线',
              trigger: 'change',
            },
          ]"
        >
          <t-input v-model="form.key" placeholder="请输入key值"></t-input>
        </t-form-item>
        <span class="text-lg font-bold mx-1">:</span>
      </div>
      <!-- value -->
      <div class="flex items-center">
        <t-select
          v-if="!form.type"
          v-model="form.type"
          :options="options"
          placeholder="请选择值类型"
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
        <input-field
          v-if="form.type"
          v-model="form.value"
          :type="form.type"
        ></input-field>
        <t-button class="ml-4" @click="handleSubmit">确认</t-button>
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
  type SelectValue,
} from "tdesign-vue-next";
import { ref, reactive, toRaw } from "vue";
import { cascaderSelectOptions } from "@/utils/config";
import InputField from "../input-field/index.vue";
import { useDoubleClick } from "@/utils/double-click";
import { CloseIcon } from "tdesign-icons-vue-next";

const $emit = defineEmits(["delete", "submit", "customAdd"]);

const form = reactive<any>({
  key: "",
  type: "",
  value: "",
});
const isKeyInputVisible = ref(true);

const options = ref(cascaderSelectOptions);

const handleChangeType = () => {
  form.type = "";
};
const { handleDoubleClick } = useDoubleClick(handleChangeType);

const handleSelectType = (value: SelectValue) => {
  switch (value) {
    case "Number":
      form.value = 0;
      break;
    case "String":
      form.value = "";
      break;
    case "Boolean":
      form.value = true;
      break;
    case " Custom":
      handleCustomSubmit();
      break;
  }
};

const handleSubmit = () => {
  console.log(form);

  $emit("submit", toRaw(form));
};

const handleCustomSubmit = () => {
  $emit("customAdd", { key: form.key });
};

const handleDelete = () => {
  $emit("delete");
};
</script>

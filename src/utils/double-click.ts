import { ref, onUnmounted } from "vue";

export const useDoubleClick = (callBack: Function) => {
  const timer = ref<any>(null);
  const onceClick = ref(false);

  const handleDoubleClick = (...args: any[]) => {
    if (onceClick.value) {
      callBack(...args);
      clearTimeout(timer.value);
      timer.value = null;
      onceClick.value = false;
    } else {
      onceClick.value = true;
      timer.value = setTimeout(() => {
        timer.value = null;
        onceClick.value = false;
      }, 300);
    }
  };

  onUnmounted(() => {
    clearTimeout(timer.value);
    timer.value = null;
  });

  return {
    handleDoubleClick,
  };
};

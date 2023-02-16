import { ref } from "vue";

const treeData = ref<any[]>([]);

export const useData = () => {
  return {
    treeData
  }
}
import { ref } from 'vue';

const idSet = new Set<number>([]);
const maxId = ref(-999);
export const useId = () => {
  const hasId = (id: number): boolean => {
    return idSet.has(id);
  };

  const getNewId = (): number => {
    maxId.value += 1;
    const newId = maxId.value;
    idSet.add(newId);

    return newId;
  };

  const addId = (id: number): boolean => {
    if (idSet.has(id)) {
      return false;
    }

    if (id > maxId.value) {
      maxId.value = id;
    }

    idSet.add(id);

    return true;
  };

  return {
    hasId,
    getNewId,
    addId,
  };
};
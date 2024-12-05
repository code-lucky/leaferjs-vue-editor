// src/stores/elementStore.ts
import { defineStore } from 'pinia';

export const useElementStore = defineStore('element', {
  state: () => ({
    elementData: null as any,
  }),
  actions: {
    setElementData(data: any) {
      this.elementData = data;
    },
  },
});
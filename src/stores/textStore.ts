import { defineStore } from 'pinia';

export const useTextStore = defineStore('text', {
    state: () => ({
      textData: null as any,
    }),
    actions: {
      setTextData(data: any) {
        this.textData = data;
      },
    },
  });
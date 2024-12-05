import { defineStore } from 'pinia';

export const useHandleStore = defineStore('handle', {
    state: () => ({
      activeTool: 'box' as string,
    }),
    actions: {
      setActiveTool(tool: string) {
        this.activeTool = tool;
      },
    },
  });
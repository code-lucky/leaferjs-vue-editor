import { defineStore } from 'pinia';

export const useHandleStore = defineStore('handle', {
    state: () => ({
      activeTool: 'box' as string,
      selectElement: null,  // 选中的元素，用于操作右键菜单
    }),
    actions: {
      setActiveTool(tool: string) {
        this.activeTool = tool;
      },
      setSelectElement(element: any) {
        this.selectElement = element;
      },
    },
  });
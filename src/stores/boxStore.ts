import { defineStore } from 'pinia';

export const useBoxStore = defineStore('box', {
    state: () => ({
        width: 1242,
        height: 1660,
        bgColor: '#ffffff',
        boxElm: null,
    }),
    actions: {
        setBoxElm(boxElm: any) {
            this.boxElm = boxElm
        }
    }
});
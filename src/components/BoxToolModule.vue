<template>
    <div class="w-[360px] h-[calc(100vh-64px)] bg-white shadow-lg p-4 flex flex-col gap-4">
        <div class="flex flex-col gap-2 w-full">
            <a-divider>尺寸</a-divider>
            <div class="w-full">
                <a-form layout="inline" :model="boxStore">
                    <a-form-item label="宽度">
                        <a-input-number v-model:value="boxStore.width" :min="0" :max="9999" />
                    </a-form-item>
                    <a-form-item label="高度">
                        <a-input-number v-model:value="boxStore.height" :min="0" :max="9999" />
                    </a-form-item>
                </a-form>
            </div>
        </div>

        <div class="flex flex-col gap-2 w-full">
            <a-divider>颜色</a-divider>
            <div class="flex items-center gap-2 w-full">
                <div class="shrink-0">背景颜色：</div>
                <ColorPicker :pickerColor="boxStore.bgColor" @changeColor="changeColor" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ColorPicker from './ColorPicker.vue'
import { useBoxStore } from '../stores/boxStore';

const changeColor = (color: string) => {
    boxStore.bgColor = color
}

const boxStore = useBoxStore()

</script>

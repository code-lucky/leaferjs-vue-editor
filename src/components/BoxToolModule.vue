<template>
    <div @click="showColorPicker = false" class="w-[360px] h-[calc(100vh-64px)] bg-white shadow-lg p-4 flex flex-col gap-4">
        <div class="flex flex-col gap-2 w-full">
            <a-divider>尺寸</a-divider>
            <div class="w-full">
                <a-form layout="inline" :model="form">
                    <a-form-item label="宽度">
                        <a-input-number v-model="form.width" :min="0" :max="9999" />
                    </a-form-item>
                    <a-form-item label="高度">
                        <a-input-number v-model="form.height" :min="0" :max="9999" />
                    </a-form-item>
                </a-form>
            </div>
        </div>

        <div class="flex flex-col gap-2 w-full">
            <a-divider>颜色</a-divider>
            <ColorPicker :pickerColor="pickerColor" @changeColor="changeColor" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ColorPicker from './ColorPicker.vue'


const pickerColor = ref('#ffffff')

const changeColor = (color: string) => {
    pickerColor.value = color
}

const form = ref({
    width: 0,
    height: 0,
})
</script>



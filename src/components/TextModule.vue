<template>
    <div class="w-[300px] h-[calc(100vh-64px)] bg-white overflow-y-auto px-4 py-2 scrollbar flex flex-col gap-4">
        <div v-for="item in list" :key="item.title" class="flex flex-col gap-2 w-full justify-center">
            <div class="flex items-center justify-between">
                <div class="text-lg font-bold">{{ item.title }}</div>
                <div class="text-gray-500 text-sm">查看更多</div>
            </div>
            <div class="w-full flex flex-wrap gap-2">
                <div v-for="(res, idx) in item.list" :key="idx" @click="handleTextClick(res.json)"
                    class="w-[84px] h-[84px] bg-gray-100 rounded-md cursor-pointer hover:scale-105 transition-all duration-300 flex items-center justify-center px-4">
                    <img :src="getAssetsFile(`text/${res.icon}`)" alt="icon">
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts" name="TextModule">
import { ref } from 'vue';
import { getAssetsFile } from '../utils/common';

const emit = defineEmits(['text-click'])

const list = ref<any[]>([
    {
        title: '默认文字',
        list: [
            {
                title: '默认文字',
                icon: 'default.png',
                json: {
                    "width": 400,
                    "height": 100,
                    "tag": "Text",
                    "fill": "#000",
                    "text": "默认文字",
                    "fontFamily": "Arial",
                    "fontSize": 68,
                    "draggable": true,
                    "editable": true,
                    "lineHeight": {
                        "type": "px",
                        "value": 100
                    },
                    "letterSpacing": {
                        "type": "px",
                        "value": 10
                    },
                    "fontWeight": "normal",
                    "stroke": "#000",
                    "strokeWidth": 0,
                    "shadow": {
                        "x": 0,
                        "y": 0,
                        "blur": 0,
                        "color": "#000"
                    },
                    "showShadow": false,
                    "rotation": 0,
                }
            }
        ]
    }
])

const handleTextClick = (json: any) => {
    emit('text-click', json)
}
</script>

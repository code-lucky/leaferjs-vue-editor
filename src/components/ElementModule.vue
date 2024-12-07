<template>
    <div class="w-[300px] h-[calc(100vh-64px)] bg-white overflow-y-auto px-4 py-2 scrollbar">
        <div v-for="item in list" :key="item.title" class="flex flex-col gap-2 w-full">
            <div class="flex items-center justify-between">
                <div class="text-lg font-bold">{{ item.title }}</div>
                <div class="text-gray-500 text-sm">查看更多</div>
            </div>
            <div class="w-full flex flex-wrap gap-2">
                <div @click="handleElementClick(res.json)" v-for="(res, idx) in item.list" :key="idx"
                    class="w-[84px] h-[84px] bg-gray-100 rounded-md cursor-pointer hover:scale-105 transition-all duration-300 flex items-center justify-center">
                    <img :src="getAssetsFile(`element/${res.icon}`)" alt="icon" class="w-[60px] h-[60px]">
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts" name="ElementModule">
import { ref } from 'vue';
import { getAssetsFile } from '../utils/common';

const emit = defineEmits<{
    (e: 'element-click', icon: string): void
}>()

const list = ref<any[]>([
    {
        title: '形状',
        list: [
            {
                title: '矩形',
                icon: 'icon-rectangle.svg',
                json: {
                    "tag": "Rect",
                    "zIndex": 0,
                    "width": 400,
                    "height": 400,
                    "draggable": true,
                    "editable": true,
                    "fill": "#000"
                }
            },
            {
                title: '圆形',
                icon: 'icon-circle.svg',
                json: {
                    "tag": "Ellipse",
                    "zIndex": 0,
                    "width": 400,
                    "height": 400,
                    "draggable": true,
                    "editable": true,
                    "fill": "#000"
                }
            },
            {
                title: '圆角矩形',
                icon: 'icon-square-rounded.svg',
                json: {
                    "tag": "Rect",
                    "zIndex": 0,
                    "width": 400,
                    "height": 400,
                    "draggable": true,
                    "editable": true,
                    "fill": "#000",
                    "cornerRadius": 20
                }
            },
            {
                title: '三角形',
                icon: 'icon-triangle.png',
                json: {
                    "tag": "Polygon",
                    "sides": 3,
                    "zIndex": 0,
                    "width": 400,
                    "height": 400,
                    "draggable": true,
                    "editable": true,
                    "fill": "#000"
                }
            },
            {
                title: '五角形状',
                icon: 'icon-star.png',
                json: {
                    "tag": "Polygon",
                    "sides": 5,
                    "zIndex": 0,
                    "width": 400,
                    "height": 400,
                    "draggable": true,
                    "editable": true,
                    "fill": "#000"
                }
            }
        ]
    }
])

const handleElementClick = (json: any) => {
    emit('element-click', json)
}
</script>

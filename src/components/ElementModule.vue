<template>
    <div class="w-[300px] h-[calc(100vh-64px)] bg-white overflow-y-auto px-4 py-2 scrollbar">
        <div v-for="item in list" :key="item.title" class="flex flex-col gap-2 w-full">
            <div class="flex items-center justify-between">
                <div class="text-lg font-bold">{{ item.title }}</div>
                <div class="text-gray-500 text-sm">查看更多</div>
            </div>
            <div class="w-full flex flex-wrap gap-2">
                <div @click="handleElementClick(res.icon)" v-for="(res,idx) in item.list" :key="idx" class="w-[84px] h-[84px] bg-gray-100 rounded-md cursor-pointer hover:scale-105 transition-all duration-300 flex items-center justify-center">
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
            },
            {
                title: '圆形',
                icon: 'icon-circle.svg',
            },
            {
                title: '椭圆',
                icon: 'icon-square-rounded.svg',
            }
        ]
    }
])

const handleElementClick = (icon: string) => {
    emit('element-click', icon)
}
</script>

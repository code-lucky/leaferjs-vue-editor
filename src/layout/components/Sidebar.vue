<template>
    <div class="h-[calc(100vh-64px)] bg-white border-r border-gray-200 w-[70px]">
        <div class="flex flex-col items-center justify-center py-4 gap-4">
            <div class="flex flex-col items-center justify-center rounded-md p-2 cursor-pointer"
                v-for="(item, index) in tabList" :class="{ 'bg-blue-500 text-white': activeKey === item.key }" :key="index"
                @click="handleTabClick(item.key)">
                <HomeOutlined />
                <div>
                {{ item.title }}
            </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="Sidebar">
import { HomeOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';

const emit = defineEmits<{
    (e: 'tab-click', key: string): void
}>()

const activeKey = ref<string>('template')

const tabList = ref<{ key: string; title: string }[]>([
    { key: 'template', title: '模板' },
    { key: 'text', title: '文字' },
    { key: 'element', title: '元素' },
])

const handleTabClick = (key: string) => {
    activeKey.value = key
    emit('tab-click', key)
}
</script>

<style scoped>
.ant-menu-vertical {
    border-inline-end: 0px !important;
}
</style>

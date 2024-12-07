<template>
    <div class="w-full">
        <a-layout class="w-full">
            <Header />
        </a-layout>
        <a-layout class="w-full h-[calc(100vh-64px)]">
            <a-layout-sider class="h-full" width="auto">
                <div class="flex">
                    <Sidebar @tab-click="handleTabClick" />
                    <TemplateModule v-if="activeKey === 'template'" />
                    <TextModule v-if="activeKey === 'text'" @text-click="handleTextClick" />
                    <ElementModule v-if="activeKey === 'element'" @element-click="handleElementClick" />
                </div>
            </a-layout-sider>
            <a-layout-content>
                <div class="h-full">
                    <router-view/>
                </div>
            </a-layout-content>
            <a-layout-sider class="h-full bg-white" width="auto">
                <TextToolModule v-if="activeTool === 'text'" />
                <BoxToolModule v-if="activeTool === 'box'" />
            </a-layout-sider>
        </a-layout>
    </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';
import TemplateModule from '../components/TemplateModule.vue';
import TextModule from '../components/TextModule.vue';
import ElementModule from '../components/ElementModule.vue';
import { computed, ref } from 'vue';
import { useElementStore } from '../stores/elementStore';
import { useTextStore } from '../stores/textStore';
import TextToolModule from '../components/TextToolModule.vue';
import BoxToolModule from '../components/BoxToolModule.vue';
import { useHandleStore } from '../stores/handleStore';
const elementStore = useElementStore()
const textStore = useTextStore()

const activeKey = ref<string>('template')

const handleStore = useHandleStore()

const activeTool = computed(() => handleStore.activeTool)


const handleTabClick = (key: string) => {
    activeKey.value = key
}

const handleElementClick = (json: any) => {
    elementStore.setElementData(json)
}

const handleTextClick = (json: any) => {
    textStore.setTextData(json)
}
</script>

<style scoped>
/* 修改滚动条宽度 */
.scrollbar::-webkit-scrollbar {
    scrollbar-width: thin !important;
    scrollbar-color: #bebfc1 transparent !important;
    border-radius: 10px !important;
    padding: 0 10px !important;
}

.scrollbar::-webkit-scrollbar {
    width: 8px !important;
    height: 8px !important;
}

.scrollbar::-webkit-scrollbar-thumb {
    background-color: #bebfc1 !important;
    border-radius: 10px !important;
}

.scrollbar::-webkit-scrollbar-track {
    background: transparent !important;
    border-radius: 10px !important;
}
</style>

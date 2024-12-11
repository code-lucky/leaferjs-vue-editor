<template>
    <div class="w-[240px] h-[calc(100vh-64px)] bg-white shadow-lg p-4 flex flex-col gap-4">
        <div class="flex flex-col gap-2">
            <div class="text-md text-[#4e4e4e]">对齐方式</div>
            <div class="flex gap-2 flex-wrap">
                <div v-for="item in alignList" :key="item.value">
                    <a-tooltip placement="top">
                        <template #title>
                            <span>{{ item.label }}</span>
                        </template>
                        <div
                            class="hover:bg-gray-100 rounded-md cursor-pointer flex items-center justify-center w-6 h-6">
                            <Icon :icon="item.icon" class="w-4 h-4" />
                        </div>
                    </a-tooltip>
                </div>
            </div>
        </div>
        <div class="flex flex-col gap-2">
            <div class="text-md text-[#4e4e4e]">设置</div>
            <div class="flex gap-2 flex-wrap">
                <div class="flex items-center gap-2 bg-gray-100 rounded-md px-2 py-1">
                    <div class="w-[20px] text-center text-gray-500">W</div>
                    <input v-model="formData.width" type="number"
                        class="w-[50px] h-[30px] bg-gray-100 rounded-md outline-none" />
                </div>

                <div class="flex items-center gap-2 bg-gray-100 rounded-md px-2 py-1">
                    <div class="w-[20px] text-center text-gray-500">H</div>
                    <input v-model="formData.height" type="number"
                        class="w-[50px] h-[30px] bg-gray-100 rounded-md outline-none" />
                </div>

                <div class="flex items-center gap-2 bg-gray-100 rounded-md px-2 py-1">
                    <div class="w-[20px] text-center text-gray-500">X</div>
                    <input v-model="formData.x" type="number"
                        class="w-[50px] h-[30px] bg-gray-100 rounded-md outline-none" />
                </div>

                <div class="flex items-center gap-2 bg-gray-100 rounded-md px-2 py-1">
                    <div class="w-[20px] text-center text-gray-500">Y</div>
                    <input v-model="formData.y" type="number"
                        class="w-[50px] h-[30px] bg-gray-100 rounded-md outline-none" />
                </div>

                <div class="flex items-center gap-2 bg-gray-100 rounded-md px-2 py-1 active:border-blue-500">
                    <div class="w-[20px] text-center text-gray-500">
                        <Icon icon="hugeicons:angle-01" />
                    </div>
                    <input v-model="formData.rotate" type="number"
                        class="w-[50px] h-[30px] bg-gray-100 rounded-md outline-none" />
                </div>
            </div>
        </div>

        <div class="flex flex-col gap-2 pr-4">
            <div class="flex flex-col gap-2">
                <div class="text-md text-[#4e4e4e]">文字</div>
                <div class="flex gap-2 flex-wrap">
                    <div class="w-full">
                        <a-select v-model:value="formData.fontFamily" class="w-full" size="large"
                            @change="handleChangeFontFamily">
                            <a-select-option value="1">Arial</a-select-option>
                            <a-select-option value="2">宋体</a-select-option>
                            <a-select-option value="3">微软雅黑</a-select-option>
                        </a-select>
                    </div>

                    <div class="w-full flex items-center gap-2">
                        <a-input-number v-model:value="formData.fontSize" class="flex-1" size="large" />
                        <a-popover v-model:open="showColorPicker" trigger="click" title="" placement="left">
                            <template #content>
                                <div class="w-[220px] mt-2 z-9999 h-[338px]" @click.stop>
                                    <ColorPicker @changeColor="changeColor" style="width: 100%;" />
                                </div>
                            </template>
                            <div class="w-[40px] h-[40px] rounded-md flex items-center justify-center border border-[#333] cursor-pointer"
                                :style="{ backgroundColor: formData.fill }">
                                <Icon icon="mingcute:font-line" :color="handleColor(formData.fill)" />
                            </div>
                        </a-popover>
                    </div>
                </div>
            </div>
            <div class="w-full h-[40px] border border-gray-300 rounded-md flex items-center justify-center">
                <a-tooltip placement="top" v-for="(item, index) in textEditList" :key="item.value">
                    <template #title>
                        <span>{{ item.label }}</span>
                    </template>
                    <div class="flex items-center gap-2 cursor-pointer w-[calc(100%/5)] h-[20px] justify-center border-r border-gray-300"
                        :class="index === textEditList.length - 1 ? 'border-r-0' : ''">
                        <Icon :icon="item.icon" />
                    </div>
                </a-tooltip>
            </div>
            <div class="w-full h-[40px] border border-gray-300 rounded-md flex items-center justify-center">
                <a-tooltip placement="top" v-for="(item, index) in horizontalAlignList" :key="item.value">
                    <template #title>
                        <span>{{ item.label }}</span>
                    </template>
                    <div class="flex items-center gap-2 cursor-pointer w-[calc(100%/4)] h-[20px] justify-center border-r border-gray-300"
                        :class="index === horizontalAlignList.length - 1 ? 'border-r-0' : ''">
                        <Icon :icon="item.icon" />
                    </div>
                </a-tooltip>
            </div>
            <div class="flex flex-col gap-2 w-full">
                <div class="flex items-center gap-2 bg-gray-100 rounded-md py-1 h-[40px] w-full px-2">
                    <div class="shrink-0 text-center text-gray-500 text-xs">行高</div>
                    <input type="number" v-model="formData.lineHeight.value"
                        class="bg-gray-100 rounded-md outline-none w-full" length="3" />
                    <div class="text-gray-500 text-sm">px</div>
                </div>
                <div class="flex items-center gap-2 bg-gray-100 rounded-md py-1 h-[40px] w-full px-2">
                    <div class="shrink-0 text-center text-gray-500 text-xs">字间距</div>
                    <input type="number" v-model="formData.letterSpacing.value"
                        class="bg-gray-100 rounded-md outline-none w-full" length="3" />
                    <div class="text-gray-500 text-sm">px</div>
                </div>
            </div>
        </div>


        <div class="flex flex-col gap-2 pr-4">
            <div class="text-md text-[#4e4e4e]">描边</div>
            <div class="flex gap-2">
                <div class="flex items-center gap-2 bg-gray-100 rounded-md py-1 h-[40px] flex-1 px-2">
                    <div class="shrink-0 text-center text-gray-500 text-xs">尺寸</div>
                    <input type="number" v-model="formData.strokeWidth"
                        class="bg-gray-100 rounded-md outline-none w-full" length="3" />
                    <!-- <div class="text-gray-500 text-sm">px</div> -->
                </div>
                <a-popover v-model:open="showStrokeColorPicker" trigger="click" title="" placement="left">
                    <template #content>
                        <div class="w-[220px] mt-2 z-9999 h-[338px]" @click.stop>
                            <ColorPicker @changeColor="changeStrokeColor" style="width: 100%;" />
                        </div>
                    </template>
                    <div class="flex items-center gap-2 rounded-md py-1 h-[40px] w-[40px] flex-shrink-0 justify-center cursor-pointer border border-gray-300"
                        :style="{ backgroundColor: formData.stroke }" @click="showStrokeColorPicker = true">
                        <Icon icon="iconoir:color-wheel" :color="handleColor(formData.stroke)" />
                    </div>
                </a-popover>
            </div>
        </div>


        <div class="flex flex-col gap-2 pr-4">
            <div class="text-md text-[#4e4e4e]">投影</div>
            <div class="flex gap-2">
                <div class="flex items-center gap-2 bg-gray-100 rounded-md py-1 h-[40px] flex-1 px-2">
                    <div class="shrink-0 text-center text-gray-500 text-xs">角度</div>
                    <input type="number" class="bg-gray-100 rounded-md outline-none w-full" length="3" />
                    <div class="text-gray-500 text-sm">px</div>
                </div>
                <!-- <div class="flex items-center gap-2 rounded-md py-1 h-[40px] w-[40px] flex-shrink-0 justify-center cursor-pointer border border-gray-300">
                    <Icon icon="iconoir:color-wheel" />
                </div> -->
            </div>
            <div class="flex gap-2">
                <div class="flex items-center gap-2 bg-gray-100 rounded-md py-1 h-[40px] flex-1 px-2">
                    <div class="shrink-0 text-center text-gray-500 text-xs">距离</div>
                    <input type="number" class="bg-gray-100 rounded-md outline-none w-full" length="3" />
                    <div class="text-gray-500 text-sm">px</div>
                </div>
            </div>
            <div class="flex gap-2">
                <div class="flex items-center gap-2 bg-gray-100 rounded-md py-1 h-[40px] flex-1 px-2">
                    <div class="shrink-0 text-center text-gray-500 text-xs">模糊度</div>
                    <input type="number" class="bg-gray-100 rounded-md outline-none w-full" length="3" />
                    <div class="text-gray-500 text-sm">px</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useTextStore } from '@/stores/textStore'
import { useHandleStore } from '@/stores/handleStore'
import { computed, ref, watch } from 'vue';
import { ColorPicker } from 'vue-color-kit'

const textStore = useTextStore()
const handleStore = useHandleStore()

const formData = computed(() => textStore.formData)

const showColorPicker = ref(false)
const showStrokeColorPicker = ref(false)

const changeColor = (color: any) => {
    formData.value.fill = color.hex
}

const changeStrokeColor = (color: any) => {
    formData.value.stroke = color.hex
}

// 监听formData的变化
watch(formData, (newVal) => {
    console.log(newVal)
    handleStore.selectElement.set({
        ...handleStore.selectElement.toJSON(),
        ...newVal
    })
}, {
    deep: true,
})

// const alignList = [
//     width: 100,
//     height: 100,
//     x: 0,
//     y: 0,
//     rotate: 0,
//     fontFamily: 'Arial',
//     fontSize: 16,
//     fontWeight: 'normal',
//     color: '#FFF',
// })

const alignList = [
    {
        label: '左对齐',
        value: 'left',
        icon: 'solar:align-left-bold',
    },
    {
        label: '水平居中对齐',
        value: 'horizontal-center',
        icon: 'solar:align-horizontal-center-bold',
    },
    {
        label: '右对齐',
        value: 'right',
        icon: 'solar:align-right-bold',
    },
    {
        label: '顶对齐',
        value: 'top',
        icon: 'solar:align-top-bold',
    },
    {
        label: '垂直居中对齐',
        value: 'vertical-center',
        icon: 'solar:align-vertical-center-bold',
    },
    {
        label: '底对齐',
        value: 'bottom',
        icon: 'solar:align-bottom-bold',
    },
    {
        label: '水平平均分布',
        value: 'horizontal-average',
        icon: 'solar:align-horizonta-spacing-bold',
    },
    {
        label: '垂直平均分布',
        value: 'vertical-average',
        icon: 'solar:align-vertical-spacing-bold',
    },
]

// 水平对齐
const horizontalAlignList = [
    {
        label: '左对齐',
        value: 'left',
        icon: 'solar:align-left-bold',
    },
    {
        label: '水平居中对齐',
        value: 'horizontal-center',
        icon: 'solar:align-horizontal-center-bold',
    },
    {
        label: '右对齐',
        value: 'right',
        icon: 'solar:align-right-bold',
    },
    {
        label: '水平平均分布',
        value: 'horizontal-average',
        icon: 'solar:align-horizonta-spacing-bold',
    }
]

// 垂直对齐
const verticalAlignList = [
    {
        label: '顶对齐',
        value: 'top',
        icon: 'solar:align-top-bold',
    },
    {
        label: '垂直居中对齐',
        value: 'vertical-center',
        icon: 'solar:align-vertical-center-bold',
    },
    {
        label: '底对齐',
        value: 'bottom',
        icon: 'solar:align-bottom-bold',
    },
    {
        label: '垂直平均分布',
        value: 'vertical-average',
        icon: 'solar:align-vertical-spacing-bold',
    }
]

// 文字编辑方式
const textEditList = [
    {
        label: '加粗',
        value: 'bold',
        icon: 'mingcute:bold-line',
    },
    {
        label: '斜体',
        value: 'italic',
        icon: 'mingcute:italic-line',
    },
    {
        label: '下划线',
        value: 'underline',
        icon: 'mingcute:underline-line',
    },
    {
        label: '删除线',
        value: 'delete-line',
        icon: 'mingcute:delete-line',
    },
    {
        label: '文字竖版',
        value: 'single-line',
        icon: 'mingcute:font-line',
    }
]


const handleChangeFontFamily = (value: string) => {
    console.log(value)
}


// 处理颜色，如果颜色是深色则用白色，否则用黑色
const handleColor = (color: string) => {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? '#000' : '#fff'
}
</script>

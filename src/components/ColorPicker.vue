<template>
    <div class="w-full">
        <a-popover v-model:open="showColorPicker" trigger="click" title="" placement="bottom">
            <template #content>
                <div class="w-[220px] mt-2 z-9999 h-[338px]" @click.stop>
                    <ColorPicker @changeColor="changeColor" style="width: 100%;" />
                </div>
            </template>
            <div @click.stop="showColorPicker = !showColorPicker"
                class="w-[40px] h-[40px] rounded-md border-2 border-gray-300 cursor-pointer flex items-center justify-center">
                <div class="w-[30px] h-[30px] rounded-md flex items-center justify-center"
                    :style="{ backgroundColor: pickerColor }">
                    <img v-if="['#ffffff', '#fff', 'rgba(255, 255, 255, 1)', '#FFFFFF', '#FFF'].includes(pickerColor)"
                        src="@/assets/icons/arr-down-back.svg" alt="arrow" class="w-[24px] h-[24px] ">
                    <img v-else src="@/assets/icons/arr-down.svg" alt="arrow" class="w-[24px] h-[24px] ">
                </div>
            </div>
        </a-popover>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { ColorPicker } from 'vue-color-kit'
import 'vue-color-kit/dist/vue-color-kit.css'

const props = defineProps<{
    pickerColor: string,
}>()

const pickerColor = ref(props.pickerColor)
const showColorPicker = ref(false)

const emit = defineEmits(['changeColor'])

const changeColor = (color: any) => {
    const { r, g, b, a } = color.rgba
    pickerColor.value = `rgba(${r}, ${g}, ${b}, ${a})`
    emit('changeColor', pickerColor.value)
}

// 添加事件监听器以在点击外部时关闭颜色选择器
const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.color-picker-container')) {
        showColorPicker.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})


</script>
<style scoped>
.expand-enter-active,
.expand-leave-active {
    transition: height 0.5s ease;
}

.expand-enter,
.expand-leave-to {
    height: 0;
    overflow: hidden;
}

.expand-enter-to,
.expand-leave {
    height: 338px;
    /* Ensure this matches the final height of your element */
}
</style>
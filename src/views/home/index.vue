<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { App, Rect, PointerEvent, Image, Box, Text, WatchEvent, Event } from 'leafer-ui'
import '@leafer-in/text-editor'
import { Ruler } from 'leafer-x-ruler'
import '@leafer-in/view'
import { useThrottle, getAssetsFile } from '../../utils/common'
import { useElementStore } from '../../stores/elementStore';
import { useTextStore } from '../../stores/textStore';
import { useHandleStore } from '../../stores/handleStore';
const handleStore = useHandleStore()
const elementStore = useElementStore()

const elementData = computed(() => elementStore.elementData);

const textStore = useTextStore()
const textData = computed(() => textStore.textData);

// 监听点击了元素
watch(elementData, (newVal: any) => {
    if (!newVal) return;
    const assetPath = getAssetsFile(`element/${newVal}`);
    const image = new Image({
        width: 100,
        height: 100,
        url: assetPath,
        draggable: true,
        editable: true,
        x: box.width ? box.width / 2 - 50 : 0,
        y: box.height ? box.height / 2 - 50 : 0,
    });
    box.add(image);

    image.on(PointerEvent.TAP, (event: Event) => {
        console.log(image)
        handleStore.setActiveTool('image')
        event.stop()
    })

    // 重置elementData
    elementStore.setElementData(null)
});

watch(textData, (newVal: any) => {
    if (!newVal) return;

    console.log(newVal)

    // 添加文字
    const text = Text.one(
        {
            ...newVal,
            width: 100,
            height: 30,
            x: box.width ? box.width / 2 - 40 : 0,
            y: box.height ? box.height / 2 - 15 : 0,
            textAlign: 'center',
        }
    )

    text.on(PointerEvent.TAP, (event: Event) => {
        console.log('text tap')
        handleStore.setActiveTool('text')
        event.stop()
    })

    box.add(text)

    // 重置textData
    textStore.setTextData(null)
})

let app: App
let box: Box

const toolList = ref<{ icon: string; title: string; type: string }[]>([
    {
        icon: 'icons/icon-undo.svg',
        title: '撤销',
        type: 'undo',
    },
    {
        icon: 'icons/icon-redo.svg',
        title: '重做',
        type: 'redo',
    },
    {
        icon: 'icons/icon-zoom-in.svg',
        title: '放大',
        type: 'zoomIn',
    },
    {
        icon: 'icons/icon-zoom-out.svg',
        title: '缩小',
        type: 'zoomOut',
    },
])

onMounted(() => {
    app = new App({
        view: 'leafer-view',
        tree: {},
        editor: {},
        sky: {},
        ground: {
            type: 'design',
        },
        zoom: { min: 1, max: 256 },
        wheel: {
            zoomMode: 'mouse',
        },
    })
    const ruler = new Ruler(app)


    // 启用、禁用  
    ruler.enabled = true

    box = new Box({
        width: 400,
        height: 500,
        fill: '#FFF',
        draggable: true,
        editable: true,
        overflow: 'hide',
    })

    app.tree.add(box)



    // 画一个文字
    // const text = new Text({
    //     text: '默认文字',
    //     editable: true,
    //     draggable: true,
    //     textAlign: 'center',
    //     fontSize: 28,
    //     fontFamily: 'Arial',
    //     fill: 'rgb(254,74,44)',
    //     fontWeight: 'bold',
    //     letterSpacing: 1.2
    // })

    // console.log(text.toJSON())

    // text.export('png', { pixelRatio: 2 }).then((res: any) => {
    //     console.log(res)
    // })

    // box.add(text)


    // 防抖
    const handleSize = useThrottle(handleSizeChange, 100)

    handleSize(app)

    // 监听页面尺寸变化
    window.addEventListener('resize', () => handleSize(app))


    box.on(PointerEvent.TAP, (event: Event) => {
        console.log('box tap')
        handleStore.setActiveTool('box')
        event.stop()
    })

    box.on(WatchEvent.DATA, (e: WatchEvent) => {
        console.log('box watch tap', e)
    })
})

const handleSizeChange = (app: App) => {
    setTimeout(() => {
        app.tree.zoom('fit', 200)
    }, 100)
}

const handleToolClick = (type: string) => {
    console.log(type)
    if (type === 'undo') {

    } else if (type === 'redo') {

    } else if (type === 'zoomIn') {
        app.tree.zoom('in')
    } else if (type === 'zoomOut') {
        app.tree.zoom('out')
    }
}
</script>

<template>
    <div id="leafer-view" class="w-full h-full relative">
        <div
            class="h-[50px] bg-white absolute bottom-[20px] right-[20px] rounded-[10px] min-w-[180px] flex gap-2 items-center px-4 z-9999">
            <div v-for="item in toolList" :key="item.title"
                class="flex items-center justify-center px-2 cursor-pointer hover:bg-gray-100 rounded-[5px] h-[40px]"
                @click="handleToolClick(item.type)">
                <img :src="getAssetsFile(item.icon)" alt="icon" class="w-[20px] h-[20px]">
            </div>
        </div>
    </div>
</template>

<style scoped></style>
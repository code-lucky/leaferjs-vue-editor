<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { App, KeyEvent, PointerEvent, Image, Box, Text, WatchEvent, Event } from 'leafer-ui'
import '@leafer-in/text-editor'
import { Ruler } from 'leafer-x-ruler'
import '@leafer-in/view'
import { useThrottle, getAssetsFile } from '../../utils/common'
import { useElementStore } from '../../stores/elementStore';
import { useTextStore } from '../../stores/textStore';
import { useHandleStore } from '../../stores/handleStore';
import { useBoxStore } from '../../stores/boxStore'
import ContextMenu from '@/components/ContextMenu.vue'

type SelectableElement = {
    destroy: () => void;
    clone: () => SelectableElement;
    toJSON: () => any;
    zIndex: number;
    parent: { children: SelectableElement[] };
};

const handleStore = useHandleStore() as {
    selectElement: SelectableElement | null,
    activeTool?: string, // Add this line
}
const elementStore = useElementStore()

const elementData = computed(() => elementStore.elementData);

const textStore = useTextStore()
const textData = computed(() => textStore.textData);


// 监听box尺寸变化
const boxStore = useBoxStore()
const boxWidth = computed(() => boxStore.width)
const boxHeight = computed(() => boxStore.height)
const boxBgColor = computed(() => boxStore.bgColor)
watch(boxWidth, (newVal: number) => {
    // 修改box尺寸
    box.width = newVal
})

watch(boxHeight, (newVal: number) => {
    // 修改box尺寸
    box.height = newVal
})

watch(boxBgColor, (newVal: string) => {
    // 修改box背景颜色
    box.fill = newVal
})

// 监听点击了元素
watch(elementData, (newVal: any) => {
    if (!newVal) return;
    // const assetPath = getAssetsFile(`element/${newVal}`);
    
    console.log(newVal)

    const element = {
        ...newVal,
        x: box.width ? box.width / 2 - 200 : 0,
        y: box.height ? box.height / 2 - 200 : 0,
    }

    box.add(element);

    // 重置elementData
    elementStore.setElementData(null)
});

watch(textData, (newVal: any) => {
    if (!newVal) return;
    // 添加文字
    const text = new Text(
        {
            ...newVal,
            width: 400,
            height: 100,
            x: box.width ? box.width / 2 - 200 : 0,
            y: box.height ? box.height / 2 - 250 : 0,
            textAlign: 'center',
            zIndex: 0,
        }
    )
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
        zoom: { min: 0.1, max: 256 },
        wheel: {
            zoomMode: 'mouse',
        },
    })
    const ruler = new Ruler(app)


    // 启用、禁用  
    ruler.enabled = true

    box = new Box({
        width: 1242,
        height: 1660,
        fill: '#FFF',
        draggable: true,
        editable: true,
        overflow: 'hide',
    })

    app.tree.add(box)



    // 画一个圆角矩形
    // const rect = new Polygon({
    //     width: 400,
    //     height: 400,
    //     fill: '#000',
    //     editable: true,
    //     draggable: true,
    //     x: box.width ? box.width / 2 - 200 : 0,
    //     y: box.height ? box.height / 2 - 200 : 0,
    //     zIndex: 0,
    //     sides: 3
    // })
    // rect.export('png', 1).then(result => {
    //     console.log(result.data)
    // })

    // box.add(rect)

    // 防抖
    const handleSize = useThrottle(handleSizeChange, 100)

    handleSize(app)

    // 监听页面尺寸变化
    window.addEventListener('resize', () => handleSize(app))


    box.on(PointerEvent.TAP, (event: Event) => {
        // console.log('box tap', event.target)
        if (event.target === box) {
            console.log('box tap');
            handleStore.activeTool = 'box';
        } else if (event.target instanceof Text) {
            console.log('text tap');
            handleStore.activeTool = 'text';
        } else if (event.target instanceof Image) {
            console.log('image tap');
            handleStore.activeTool = 'image';
        }
        menuVisible.value = false
        handleStore.selectElement = event.target as unknown as SelectableElement
        event.stop()
    })

    box.on(PointerEvent.MENU_TAP, (event: PointerEvent) => {
        console.log('box menu tap', event.target)
        if (event.target instanceof Box) {
            return
        }
        handleStore.selectElement = event.target as unknown as SelectableElement
        const { x, y } = event;
        menuPosition.value.x = x;
        menuPosition.value.y = y;
        menuVisible.value = true;
    })

    // box.on(KeyEvent.UP, (event: KeyEvent) => {
    //     console.log('box hold', event)
    // })

    box.on(WatchEvent.DATA, (e: WatchEvent) => {
        console.log('box watch tap', e)
    })

    document.addEventListener('click', handleClickOutside)


    // 监听键盘事件
    document.addEventListener('keydown', (event: KeyboardEvent) => {
        // 点击删除
        if (event.key === 'Delete') {
            if (handleStore.selectElement && !(handleStore.selectElement instanceof Box)) {
                handleStore.selectElement.destroy()
            }
        }

        // 组合键
        if (event.ctrlKey && event.key === 'z') {
            console.log('撤销')
        }

        // ctrl + c
        if (event.ctrlKey && event.key === 'c') {
            console.log('复制')
            if (handleStore.selectElement) {
                const copyElement = handleStore.selectElement.toJSON()
                // 随机偏移
                const randomX = Math.floor(Math.random() * 130)
                const randomY = Math.floor(Math.random() * 130)
                const data = {
                    ...copyElement,
                    x: copyElement.x + randomX,
                    y: copyElement.y + randomY,
                }
                
                // 复制到剪切板
                navigator.clipboard.writeText(JSON.stringify(data))
            }
        }

        // ctrl + v
        if (event.ctrlKey && event.key === 'v') {
            console.log('粘贴')
            // 从剪切板粘贴
            navigator.clipboard.readText().then(text => {
                console.log(text)
                const data = JSON.parse(text)
                box.add(data)
            })
        }
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

const menuVisible = ref(false)
const menuPosition = ref({ x: 0, y: 0 })

// 隐藏菜单
const onContextMenu = () => {
    menuVisible.value = false;
};

// 处理菜单操作
const handleMenuAction = (action: string) => {
    console.log('菜单操作:', action);
    menuVisible.value = false;

    if (action === 'delete') {
        console.log('删除图形功能待实现');
        // 删除选中的元素
        if (handleStore.selectElement) {
            handleStore.selectElement.destroy()
            return
        }
    }

    // 复制
    if (action === 'copy') {
        console.log('复制图形功能待实现');
        if (handleStore.selectElement) {
            const copyElement = handleStore.selectElement.toJSON()
            // 获取随机数130以内
            const randomX = Math.floor(Math.random() * 130)
            const randomY = Math.floor(Math.random() * 130)
            box.add(
                {
                    ...copyElement,
                    x: copyElement.x + randomX,
                    y: copyElement.y + randomY,
                }
            )
        }
    }

    // 上移一层
    if (action === 'move-up') {
        console.log('上移一层功能待实现');
        if (handleStore.selectElement) {
            handleStore.selectElement.zIndex++
        }
    }

    if (action === 'move-down') {
        console.log('下移一层功能待实现');
        if (handleStore.selectElement) {
            handleStore.selectElement.zIndex--
        }
    }

    // 移到顶层
    if (action === 'move-top') {
        if (handleStore.selectElement) {
            let maxZIndex = handleStore.selectElement.parent.children.reduce((max, element) => {
                return element.zIndex > max ? element.zIndex : max;
            }, 0);

            handleStore.selectElement.zIndex = maxZIndex + 1;

            console.log(maxZIndex)
        }
    }

    // 移到底层
    if (action === 'move-bottom') {
        if (handleStore.selectElement) {
            handleStore.selectElement.zIndex = 0
        }
    }
};

const handleClickOutside = (event: MouseEvent) => {
    const menuElement = document.querySelector('.context-menu-selector'); // 替换为实际的上下文菜单选择器
    if (menuElement && !menuElement.contains(event.target as Node)) {
        menuVisible.value = false;
    }
};

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
    <div id="leafer-view" class="w-full h-full relative" @contextmenu.prevent="onContextMenu">
        <div
            class="h-[50px] bg-white absolute bottom-[20px] right-[20px] rounded-[10px] min-w-[180px] flex gap-2 items-center px-4 z-9999">
            <div v-for="item in toolList" :key="item.title"
                class="flex items-center justify-center px-2 cursor-pointer hover:bg-gray-100 rounded-[5px] h-[40px]"
                @click="handleToolClick(item.type)">
                <img :src="getAssetsFile(item.icon)" alt="icon" class="w-[20px] h-[20px]">
            </div>
        </div>

        <ContextMenu v-if="menuVisible" :x="menuPosition.x" :y="menuPosition.y" @menu-action="handleMenuAction" />

    </div>
</template>

<style scoped></style>
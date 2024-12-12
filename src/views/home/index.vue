<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { App, PointerEvent, Image, Box, Text, WatchEvent, Event, DragEvent, MoveEvent, ResizeEvent, boundsType } from 'leafer-ui'
import '@leafer-in/text-editor'
import { Ruler } from 'leafer-x-ruler'
import '@leafer-in/view'
import { useThrottle, getAssetsFile } from '../../utils/common'
import { useElementStore } from '../../stores/elementStore';
import { useTextStore } from '../../stores/textStore';
import { useHandleStore } from '../../stores/handleStore';
import { useBoxStore } from '../../stores/boxStore'
import ContextMenu from '@/components/ContextMenu.vue'

// 添加Text的属性
class CustomText extends Text {
    get __tag() { return 'CustomText' }
}

CustomText.registerUI()
// 添加属性，并指定属性处理器
CustomText.addAttr('showShadow', false, boundsType)

// end

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
    console.log(newVal)
    // 添加文字
    const text = new CustomText(
        {
            ...newVal,
            x: box.width ? box.width / 2 - newVal.width / 2 : 0,
            y: box.height ? box.height / 2 - newVal.height / 2 : 0,
            textAlign: 'center',
            zIndex: 0,
            showShadow: false,
        }
    )

    if (newVal.showShadow) {
        text.shadow = {
            x: 0,
            y: 0,
            blur: 0,
            color: '#000'
        }
    } else {
        text.shadow = undefined
    }

    console.log('text...',text.toJSON())

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
        tree: {
            type: 'design',
        },
        editor: {},
        sky: {
            type: 'design',
        },
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
        id: 'main',
        width: 1242,
        height: 1660,
        fill: '#FFF',
        draggable: false,
        editable: true,
        overflow: 'hide',
    })

    app.tree.add(box)

    // 防抖
    const handleSize = useThrottle(handleSizeChange, 100)

    handleSize(app)

    // 监听页面尺寸变化
    window.addEventListener('resize', () => handleSize(app))


    box.on(PointerEvent.TAP, (event: Event) => {
        // console.log('box tap', event.target)
        handleStore.selectElement = event.target as unknown as SelectableElement
        if (event.target === box) {
            console.log('box tap');
            handleStore.activeTool = 'box';
        } else if (event.target instanceof Text) {
            console.log('text tap');
            const textData = event.target.toJSON()
            console.log(textData)
            textStore.setFormData(textData)

            handleStore.activeTool = 'text';
        } else if (event.target instanceof Image) {
            console.log('image tap');
            handleStore.activeTool = 'image';
        }
        menuVisible.value = false

        event.stop()
    })

    // 监听拖动
    box.on(DragEvent.DRAG, (event: DragEvent) => {
        if (handleStore.selectElement && handleStore.selectElement instanceof Text) {
            console.log('text drag', event.target.x, event.target.y)

            // 修改text的x和y
            handleStore.selectElement.x = event.target.x
            handleStore.selectElement.y = event.target.y

            // 获取JSON
            const textData = handleStore.selectElement.toJSON()
            console.log(textData)
            textStore.setFormData(textData)
        }
    })

    // 监听移动
    box.on(MoveEvent.MOVE, (event: MoveEvent) => {
        console.log('box move', event)
    })

    // 监听尺寸变化
    box.on(ResizeEvent.RESIZE, (event: ResizeEvent) => {
        console.log('box resize', event)
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
    boxStore.setBoxElm(box)
    setTimeout(() => {
        app.tree.zoom('fit', 200)

        // setTimeout(() => {
        //     setSkyPosition(app)
        // }, 100)

    }, 100)
}

// const setSkyPosition = (app: App) => {
//     // 获取整个app的宽高
//     const appWidth = app.width ? app.width : 0
//     const appHeight = app.height ? app.height : 0

//     // 获取app.tree的x和y
//     const appTreeX = app.tree.x ? app.tree.x : 0
//     const appTreeY = app.tree.y ? app.tree.y : 0

//     // 获取app.tree的scale
//     const appTreeScale = app.tree.scale ? Number(app.tree.scale) : 1
//     console.log('app tree scale', appTreeScale)

//     // 获取app.tree下的main的width和height
//     const mainWidth = app.tree.children.find((child: any) => child.id === 'main')?.width ? app.tree.children.find((child: any) => child.id === 'main')?.width : 0
//     const mainHeight = app.tree.children.find((child: any) => child.id === 'main')?.height ? app.tree.children.find((child: any) => child.id === 'main')?.height : 0

//     const mainScaleWidth = mainWidth ? mainWidth * appTreeScale : 0
//     const mainScaleHeight = mainHeight ? mainHeight * appTreeScale : 0

//     app.sky.children.forEach((child: any) => {
//         if (child.id === 'left') {
//             child.x = appTreeX ? appTreeX - 4 - 10 : 0
//             child.y = appTreeY ? appHeight / 2 : 0
//         } else if (child.id === 'right') {
//             child.x = appTreeX ? appTreeX + mainScaleWidth + 10 : 0
//             child.y = appTreeY ? appHeight / 2 : 0
//         } else if (child.id === 'top') {
//             child.x = appTreeX ? appWidth / 2 : 0
//             child.y = appTreeY ? appTreeY - 4 - 10 : 0
//         } else if (child.id === 'bottom') {
//             child.x = appTreeX ? appWidth / 2 : 0
//             child.y = appTreeY ? appTreeY + mainScaleHeight + 10 : 0
//         }

//         let initialX = 0;
//         let initialY = 0;

//         // 开始拖动，获取初始值
//         child.on(MoveEvent.START, (event: MoveEvent) => {
//             console.log('sky start', event);
//             initialX = event.x;
//             initialY = event.y;
//         });

//         // 拖动事件
//         child.on(DragEvent.DRAG, useThrottle((event: MoveEvent) => {
//             console.log('sky drag', event);

//             // 计算移量，考虑缩放
//             const scale = app.tree.scale ? Number(app.tree.scale) : 1;
//             const offsetX = (event.x - initialX) / scale;
//             const offsetY = (event.y - initialY) / scale;

//             // 判断是哪个方向
//             if (child.id === 'right') {
//                 // 计算box的宽度，偏移量不一定是距离
//                 const boxWidth = box.width ? box.width : 0;
//                 box.width = boxWidth + offsetX;
//                 child.x = initialX + offsetX * scale;
//             } else if (child.id === 'bottom') {
//                 const boxHeight = box.height ? box.height : 0;
//                 box.height = boxHeight + offsetY;
//                 child.y = initialY + offsetY * scale;
//             }
//         }, 50));

//         // 按住拖动
//         child.on(PointerEvent.DOWN, (event: PointerEvent) => {
//             console.log('sky long press', event)
//             initialX = event.x
//             initialY = event.y
//             // 长按时，变色
//             child.fill = 'blue'
//         })

//         // 松开时，恢复颜色
//         child.on(PointerEvent.UP, (event: PointerEvent) => {
//             console.log('sky up', event)
//             child.fill = '#333'
//         })
//     })

//     setTimeout(() => {
//         app.tree.zoom('fit', 200)
//     }, 100)
// }

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
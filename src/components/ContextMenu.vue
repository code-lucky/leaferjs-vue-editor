<template>
  <div class="context-menu" :style="{ top: `${y}px`, left: `${x}px` }" @click.stop>
    <!-- <div class="menu-item" @click="onAction('edit')">Edit</div>
      <div class="menu-item" @click="onAction('delete')">Delete</div> -->
    <div v-for="item in list" :key="item.key" class="menu-item" @click="onAction(item.key)">
      <div class="text-xs text-white">{{ item.label }}</div>
      <div class="text-xs text-white">{{ item.shortcut }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { getAssetsFile } from '../utils/common';
const props = defineProps({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
});

const list = ref([
  {
    key: 'move-up',
    icon: 'icon-copy',
    label: '上移一层',
    shortcut: 'Ctrl + Up'
  },
  {
    key: 'move-down',
    icon: 'icon-copy',
    label: '下移一层',
    shortcut: 'Ctrl + Down'
  },
  {
    key: 'move-top',
    icon: 'icon-copy',
    label: '移到顶层',
    shortcut: 'Ctrl + Shift + Up'
  },
  {
    key: 'move-bottom',
    icon: 'icon-copy',
    label: '移到底层',
    shortcut: 'Ctrl + Shift + Down'
  },
  {
    key: 'copy',
    icon: 'icon-copy',
    label: '复制',
    shortcut: 'Ctrl + C'
  },
  {
    key: 'delete',
    icon: 'icon-trash',
    label: '删除',
    shortcut: 'Delete'
  }
])

const emits = defineEmits(['menu-action']);

const onAction = (action) => {
  emits('menu-action', action);
};
</script>

<style>
.context-menu {
  position: absolute;
  background: #333;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 1000;
  display: flex;
  border-radius: 4px;
  width: 200px;
  flex-direction: column;
}

.menu-item {
  width: 100%;
  padding: 5px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}

.menu-item:hover {
  background-color: #444;
  border-radius: 4px;
}
</style>
<template>
    <div
      class="context-menu"
      :style="{ top: `${y}px`, left: `${x}px` }"
      @click.stop
    >
      <div class="menu-item" @click="onAction('edit')">Edit</div>
      <div class="menu-item" @click="onAction('delete')">Delete</div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  });

  const list = ref([
    {
      key: 'copy',
      icon: 'icon-copy',
    },
    {
      key: 'delete',
      icon: 'icon-trash',
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
    background: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 10px;
    z-index: 1000;
    display: flex;
    border-radius: 4px;
  }
  
  .menu-item {
    padding: 5px;
    cursor: pointer;
  }
  
  .menu-item:hover {
    background-color: #f0f0f0;
    border-radius: 4px;
  }
  </style>
  
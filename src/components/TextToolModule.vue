<template>
    <div class="w-[300px] h-[calc(100vh-64px)] bg-white shadow-lg p-4">
        <div class="flex flex-col gap-2">
            <a-divider>文本</a-divider>
            <a-row>
                <a-col :span="12">
                    <a-input v-model:value="form.text" />
                </a-col>
                <a-col :span="1"></a-col>
                <a-col :span="9">
                    <a-input-number v-model:value="form.fontSize" :min="0" :max="9999" />
                </a-col>
            </a-row>
        </div>
    </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
    text: '',
    fontSize: 16,
})

</script>

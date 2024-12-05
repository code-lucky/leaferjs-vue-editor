<template>
    <div class="w-[300px] h-[calc(100vh-64px)] bg-white overflow-y-auto grid grid-cols-2 gap-4 px-4 py-2 scrollbar">
        <div class="w-[120px] h-[150px] bg-gray-100 rounded-md cursor-pointer hover:scale-105 transition-all duration-300"
            v-for="i in 20"></div>
    </div>
</template>
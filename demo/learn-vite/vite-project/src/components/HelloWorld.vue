<template>
    <h1>{{ msg }}</h1>

    <h1 @click="onSciChange">{{ data.scientist }}</h1>

    <p>
        <a href="https://vitejs.dev/guide/features.html" target="_blank">
            Vite Documentation
        </a>
        |
        <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
    </p>

    <button type="button" @click="state.count++">
        count is: {{ state.count }}
    </button>
    <p>
        Edit
        <code>components/HelloWorld.vue</code> to test hot module replacement.
    </p>
</template>

<script setup>
import { defineProps, reactive, inject } from 'vue'

defineProps({
    msg: String
})


const state = reactive({ count: 0 })
let data = reactive({
    scientist: ''
})

data.scientist = inject('scientist')

function onSciChange(e) {
    console.log(data.scientist)
    data.scientist = 'jackey'
}
</script>

<style scoped>
a {
    color: #42b983;
}
</style>

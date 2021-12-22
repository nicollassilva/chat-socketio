<template>
    <span v-if="!message.deleted" :class="['msg', message.me && 'me']">
        <div class="renderImage" v-viewer>
            <img :src="message.content">
        </div>
        <span class="hours">{{ message.time }}</span>
    </span>
</template>
<script>
export default {
    props: ['message']
}
</script>
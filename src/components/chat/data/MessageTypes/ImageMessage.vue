<template>
    <span v-if="!message.deleted" :class="['msg', message.me && 'me']">
        <div class="renderImage" v-viewer>
            <img :src="message.content">
        </div>
        <message-options :userConnected="userConnected" :message="message" />
        <span class="hours">{{ message.time }}</span>
    </span>
</template>
<script>
import MessageOptions from '../MessageHandler/MessageOptions.vue'

export default {
    components: { MessageOptions },
    props: ['message', 'userConnected']
}
</script>
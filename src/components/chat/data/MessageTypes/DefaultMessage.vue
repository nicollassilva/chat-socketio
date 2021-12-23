<template>
    <div v-if="message">
        <div v-if="!message.deleted" :class="['msg', message.me && 'me']">
            {{ message.content }}
            <message-options :userConnected="userConnected" :message="message" />
            <span class="hours">{{ message.time }}</span>
        </div>
        <span :class="['msg', 'text-danger', 'font-weight-bold', message.me && 'me']" v-else>
            <i class="fas fa-ban mr-2"></i>Essa mensagem foi deletada.
        </span>
    </div>
</template>
<script>
import MessageOptions from "../MessageHandler/MessageOptions.vue"

export default {
    components: { MessageOptions },

    props: ['message', 'userConnected'],
}
</script>
<template>
    <div class="menu" v-if="menuOptions !== null && menuOptions === message.id">
        <li v-if="message.me">Dados da mensagem</li>
        <li>Responder</li>
        <li>Encaminhar mensagem</li>
        <li>Favoritar mensagem</li>
        <li @click="sendDeleteMessage(message)">Apagar mensagem</li>
    </div>
</template>
<script>
export default {
    name: "ChatOptions",

    props: {
        menuOptions: {
            default: null,
            required: true
        },

        message: {
            type: Object,
            default: () => {},
            required: true
        },

        user: Number
    },

    methods: {
        sendDeleteMessage(message) {
            window.chatEventBus.$emit('ChatModal', {
                type: 'deleteMessage',
                data: message,
                user: this.user
            });
        },
    }
}
</script>
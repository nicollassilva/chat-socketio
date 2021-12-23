<template>
    <div class="options" @click="toggleOptions(message)">
        <i class="fas fa-chevron-down"></i>
        <transition name="fade">
            <div class="menu" v-if="menuOptions">
                <li v-if="message.me">Dados da mensagem</li>
                <li>Responder</li>
                <li>Encaminhar mensagem</li>
                <li>Favoritar mensagem</li>
                <li @click="sendDeleteMessage(message)">Apagar mensagem</li>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    props: ['message', 'userConnected'],

    data() {
        return {
            menuOptions: false
        }
    },
    
    methods: {
        sendDeleteMessage(message) {
            window.chatEventBus.$emit('ChatModal', {
                type: 'deleteMessage',
                data: message,
                user: this.userConnected.id
            });
        },

        toggleOptions() {
            this.menuOptions = !this.menuOptions
        },
    }
}
</script>
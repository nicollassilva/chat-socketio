<template>
    <div v-if="message">
        <div v-if="!message.deleted" :class="['msg', message.me && 'me']">
            {{ message.content }}
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
            <span class="hours">{{ message.time }}</span>
        </div>
        <span :class="['msg', 'text-danger', 'font-weight-bold', message.me && 'me']" v-else>
            <i class="fas fa-ban mr-2"></i>Essa mensagem foi deletada.
        </span>
    </div>
</template>
<script>
export default {
    props: ['message'],

    updated() {
        console.log(this.message)
    },

    data() {
        return {
            menuOptions: false,
            userConnected: {}
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
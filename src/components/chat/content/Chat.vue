<template>
    <div class="chat" v-if="visibility">
        <div class="topbar">{{ userChat.name }}</div>
        <div class="messages" v-if="Array.isArray(messages) && chatMessage.length > 0">
            <transition-group name="fade">
                <div :class="['message', msg.me && 'me']" v-for="msg in chatMessage" :key="msg.id">
                    <span :class="['msg', msg.me && 'me']">
                        {{ msg.message }}
                        <div class="options" @click="toggleOptions(msg)">
                            <i class="fas fa-chevron-down"></i>
                            <transition name="fade">
                                <div class="menu" v-if="menuOptions !== null && menuOptions === msg.id">
                                    <li v-if="msg.me">Dados da mensagem</li>
                                    <li>Responder</li>
                                    <li>Encaminhar mensagem</li>
                                    <li>Favoritar mensagem</li>
                                    <li @click="deleteMessage(msg)">Apagar mensagem</li>
                                </div>
                            </transition>
                        </div>
                        <span class="hours">{{ msg.time }}</span>
                    </span>
                </div>
            </transition-group>
        </div>
        <div class="messages" v-else>
            <div class="message me">
                <span class="msg me">Mande uma mensagem abaixo para começar o chat com <b>{{ userChat.name }}</b>.</span></div>
        </div>
        <div class="input">
            <input class="input-message" @keyup.enter="enterMessage" :placeholder="`Digite algo para ${userChat.name}`">
        </div>
    </div>
</template>
<script>

export default {
    name: "Chat",

    data() {
        return {
            myUser: null,
            visibility: false,
            userChat: [],
            messages: [],
            menuOptions: null,
            date: new Date
        }
    },

    computed: {
        chatMessage() {
            let filter = this.messages.length > 0 && this.messages.filter(e => e.users && e.users.includes(this.myUser.id) && e.users.includes(this.userChat.id));

            return Array.isArray(filter) && filter.length > 0 ? filter[0].historic : [];
        }
    },

    mounted() {
        setTimeout(() => this.myUser = window.chatEventBus.user, 1000);

        window.chatEventBus.$on('chat', event => {
            if(event.name && event.id) {
                if(this.userChat.name != event.name) {
                    this.userChat = event
                    this.visibility = true
                }
            }
        });

        window.chatEventBus.$on('receivePrivateMessage', event => {
            this.pushMessage(event);
        });

        window.chatEventBus.$on('userDisconnect', event => {
            console.log(event)
        });
    },

    updated() {
        this.adjustContainerScroll();
    },

    methods: {

        deleteMessage(message) {
            window.chatEventBus.$emit('Modal', {
                type: 'deleteMessage',
                data: message
            });
        },

        toggleOptions(msg) {
            this.menuOptions = this.menuOptions != msg.id ? msg.id : null;
        },

        enterMessage(event) {
            let inputMessage = event.target.value

            if(inputMessage.length < 1) return;

            this.sendPrivateMessage(inputMessage);
            event.target.value = '';
        },

        sendPrivateMessage(message) {
            let messageObj = {
                from: this.myUser.id,
                to: this.userChat.id,
                message,
                time: `${this.date.getHours()}:${this.date.getMinutes()}`
            };

            console.log(messageObj)

            window.chatEventBus.$emit('sendPrivateMessage', messageObj);
            this.pushMessage(messageObj);
        },

        checkMessage(from, to) {
            return !!this.messages.filter(e => e.users && e.users.includes(from) && e.users.includes(to)).length;
        },

        pushMessage(data) {
            if(this.checkMessage(data.to, data.from)) {
                this.messages.forEach(chat => {
                    if(chat.users.includes(data.from) && chat.users.includes(data.to)) {
                        chat.historic.push(this.messageFormat(data));
                    }
                });
            } else {
                this.saveChat(data);
            }
        },

        messageFormat(data) {
            return {
                message: data.message,
                time: data.time,
                id: Math.floor(Math.random() * 100000 + 1),
                me: (data.from === this.myUser.id)
            };
        },

        saveChat(data) {
            this.messages.push({
                users: [data.from, data.to],
                historic: [this.messageFormat(data)]
            });
        },

        adjustContainerScroll() {
            let container = document.querySelector('.chat .messages');
            
            container.scrollTo(0, container.scrollHeight);
        }
    }
}
</script>
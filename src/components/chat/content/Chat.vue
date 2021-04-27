<template>
    <div class="chat" v-if="visibility">
        <div class="topbar">{{ userConnected.name }}</div>
        <div class="messages" v-if="Array.isArray(chats) && chatMessage.length > 0">
            <transition-group name="fade">
                <div :class="['message', message.me && 'me']" v-for="message in chatMessage" :key="message.id">
                    <span :class="['msg', message.me && 'me']">
                        {{ message.content }}
                        <div class="options" @click="toggleOptions(message)">
                            <i class="fas fa-chevron-down"></i>
                            <transition name="fade">
                                <div class="menu" v-if="menuOptions !== null && menuOptions === message.id">
                                    <li v-if="message.me">Dados da mensagem</li>
                                    <li>Responder</li>
                                    <li>Encaminhar mensagem</li>
                                    <li>Favoritar mensagem</li>
                                    <li @click="deleteMessage(message)">Apagar mensagem</li>
                                </div>
                            </transition>
                        </div>
                        <span class="hours">{{ message.time }}</span>
                    </span>
                </div>
            </transition-group>
        </div>
        <div class="messages" v-else>
            <div class="message me">
                <span class="msg me">Mande uma mensagem abaixo para começar o chat com <b>{{ userConnected.name }}</b>.</span></div>
        </div>
        <div class="input">
            <input class="input-message" @keyup.enter="storeMessage" :placeholder="`Digite algo para ${userConnected.name}`">
        </div>
    </div>
</template>
<script>
import ChatEngine from '../data/ChatEngine';

export default {
    name: "Chat",

    data() {
        return {
            userConnected: null,
            visibility: false,
            messages: [],
            userChat: [],
            chats: [],
            menuOptions: null
        }
    },

    computed: {
        chatMessage() {
            let chatInstance = this.getChatInstance();

            if(!chatInstance) return;

            return chatInstance.messages;
        }
    },

    mounted() {
        window.chatEventBus.$on('chat', event => {
            if(!event.name && !event.id) return;

            this.initChat(event);
            this.setUser(event);
        });

        window.chatEventBus.$on('receivePrivateMessage', event => {
            let senderUser = event.from;

            this.initChat(senderUser);
            this.storeMessage(event, false, senderUser.id);
        });

        window.chatEventBus.$on('userDisconnect', event => {
            console.log(event)
        });

        window.chatEventBus.$on('deleteMessage', event => this.deleteMessage(event, true));
    },

    updated() {
        this.adjustContainerScroll();
    },

    methods: {

        setUser(user) {
            if(!this.userConnected) {
                this.userConnected = user;
                this.visibility = true;
                return;
            }

            if(this.userConnected.id != user.id) {
                this.userConnected = user;
                this.visibility = true;
            }
        },

        storeMessage(event, inputEvent = true, senderUser = null) {
            let message = inputEvent ? event.target.value : event;

            if(inputEvent) {
                if(message.length < 1) return;

                event.target.value = '';
            }

            let newMessage = this.getChatInstance(senderUser).store(message, !inputEvent);

            if(inputEvent) this.privateMessageEmit(newMessage);
        },

        privateMessageEmit(message) {
            window.chatEventBus.$emit('sendPrivateMessage', {
                from: window.chatEventBus.user,
                to: this.userConnected.id,
                ...message
            });
        },

        getChatInstance(userId = null) {
            if(!this.userConnected && !userId) return;

            if(!userId) userId = this.userConnected.id;
            
            return this.chats.find(chat => chat.userConnected.id === userId);
        },

        initChat(userObject) {
            let chatStarted = this.getChatInstance(userObject.id);

            if(chatStarted) return;

            this.chats.push(
                new ChatEngine(userObject)
            );
        },

        toggleOptions(message) {
            this.menuOptions = this.menuOptions != message.id ? message.id : null;
        },

        adjustContainerScroll() {
            let container = document.querySelector('.chat .messages');
            
            container.scrollTo(0, container.scrollHeight);
        }
    }
}
</script>
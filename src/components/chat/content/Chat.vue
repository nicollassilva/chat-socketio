<template>
    <div>
        <input type="file" accept="image/*" ref="imageLoader" id="image-loader" style="display: none">
        <div class="chat" v-if="visibility">
            <div class="topbar">{{ userConnected.name }}</div>
            <div class="messages" v-if="Array.isArray(chats) && chatMessage.length > 0">
                <transition-group name="fade">
                    <div :class="['message', message.me && 'me']" v-for="message in chatMessage" :key="message.id">
                        <template v-if="!message.image">
                            <span v-if="!message.deleted" :class="['msg', message.me && 'me']">
                                {{ message.content }}
                                <div class="options" @click="toggleOptions(message)">
                                    <i class="fas fa-chevron-down"></i>
                                    <transition name="fade">
                                        <div class="menu" v-if="menuOptions !== null && menuOptions === message.id">
                                            <li v-if="message.me">Dados da mensagem</li>
                                            <li>Responder</li>
                                            <li>Encaminhar mensagem</li>
                                            <li>Favoritar mensagem</li>
                                            <li @click="sendDeleteMessage(message)">Apagar mensagem</li>
                                        </div>
                                    </transition>
                                </div>
                                <span class="hours">{{ message.time }}</span>
                            </span>
                            <span :class="['msg', 'text-danger', 'font-weight-bold', message.me && 'me']" v-else>
                                <i class="fas fa-ban mr-2"></i>Essa mensagem foi deletada.
                            </span>
                        </template>
                        <template v-else>
                            <span v-if="!message.deleted" :class="['msg', message.me && 'me']">
                                <div class="renderImage">
                                    <img :src="message.content">
                                </div>
                                <span class="hours">{{ message.time }}</span>
                            </span>
                            <span :class="['msg', 'text-danger', 'font-weight-bold', message.me && 'me']" v-else>
                                <i class="fas fa-ban mr-2"></i>Essa imagem foi deletada.
                            </span>
                        </template>
                    </div>
                </transition-group>
            </div>
            <div class="messages" v-else>
                <div class="message me">
                    <span class="msg me">Mande uma mensagem abaixo para começar o chat com <b>{{ userConnected.name }}</b>.</span></div>
            </div>
            <div class="input">
                <div class="options-message">
                    <button class="send-image" @click="openFile()"><i class="far fa-image"></i></button>
                </div>
                <textarea class="input-message" @keyup.13.exact="storeMessage($event.target)" ref="input" :placeholder="`Digite algo para ${userConnected.name}`"></textarea>
                <button class="enter-message" @click="storeMessage($refs.input)"><i class="far fa-paper-plane"></i></button>
            </div>
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
            this.initChat(event.from);
            this.storeMessage(event, false, event.from.id);
        });

        window.chatEventBus.$on('renderImage', event => {
            this.initChat(event.from);
            this.storeImageMessage(event.from, event.buffer);
        })

        window.chatEventBus.$on('userDisconnect', event => {
            console.log(event)
        });

        window.chatEventBus.$on('deleteMessageForMe', event => this.deleteMessage(event));

        this.addImageFileLoaderListener();
    },

    updated() {
        this.adjustContainerScroll();
    },

    methods: {
        addImageFileLoaderListener() {
            this.$refs.imageLoader.onchange = (evt) => {
                let target = evt.target || window.event.srcElement,
                    files = target.files;
                
                if (FileReader && files && files.length) {
                    let imageFileReader = new FileReader();
                    imageFileReader.readAsDataURL(files[0]);

                    imageFileReader.onload = (e) => {
                        window.chatEventBus.$emit('sendImage', { to: this.userConnected.id, from: window.chatEventBus.user, buffer: e.target.result });

                        this.$refs.imageLoader.value = '';
                        return;
                    };
                }
            };
        },

        openFile() {
            this.$refs.imageLoader.click();
        },

        sendDeleteMessage(message) {
            window.chatEventBus.$emit('ChatModal', {
                type: 'deleteMessage',
                data: message,
                user: this.userConnected.id
            });
        },

        deleteMessage(event) {
            this.getChatInstance().update(event.id, 'deleted', true);
        },

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

        storeImageMessage(senderUser, image) {
            this.getChatInstance(senderUser.id).store(image, true, true);
        },

        storeMessage(event, inputEvent = true, senderUser = null) {
            let message = inputEvent ? event.value : event;

            if(inputEvent) {
                if(message.length < 1) return;

                event.value = '';
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

            console.log(userObject)

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
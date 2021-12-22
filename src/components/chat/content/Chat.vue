<template>
    <div>
        <input type="file" accept="image/*" ref="imageLoader" id="image-loader" style="display: none">
        <div class="chat" v-if="visibility">
            <div class="topbar">{{ userConnected.name }}</div>
            <div class="messages" v-if="Array.isArray(chats) && chatMessage.length > 0">
                <transition-group name="fade">
                    <div :class="['message', message.me && 'me']" v-for="message in chatMessage" :key="message.id">
                        <template v-if="!message.image">
                            <DefaultMessage :message="message" />
                        </template>
                        <template v-else>
                            <ImageMessage :message="message" v-if="!message.deleted" />
                            <DeletedMessage :message="message" v-else />
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
                    <button class="send-image"><i class="far fa-smile"></i></button>
                </div>
                <textarea class="input-message" @keyup.13.exact="storeMessage($event.target)" ref="input" :placeholder="`Digite algo para ${userConnected.name}`"></textarea>
                <button class="enter-message" @click="storeMessage($refs.input)"><i class="far fa-paper-plane"></i></button>
            </div>
        </div>
    </div>
</template>
<script>
import ChatEngine from '../data/ChatEngine';
import ImageMessage from '../data/MessageTypes/ImageMessage';
import DefaultMessage from '../data/MessageTypes/DefaultMessage';

export default {
    name: "Chat",

    components: { DefaultMessage, ImageMessage },

    data() {
        return {
            userConnected: null,
            visibility: false,
            messages: [],
            userChat: [],
            chats: [],
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
        window.chatEventBus.$on('userDisconnected', event => this.userDisconnected(event));

        this.addImageFileLoaderListener();
    },

    updated() {
        this.adjustContainerScroll();
    },

    methods: {
        userDisconnected(user) {
            if(this.userConnected.id == user.id) {
                this.storeMessage({content: 'Esse usuário desconectou!'})
            }
        },

        addImageFileLoaderListener() {
            this.$refs.imageLoader.onchange = (evt) => {
                let target = evt.target || window.event.srcElement,
                    files = target.files;
                
                if (FileReader && files && files.length) {
                    let imageFileReader = new FileReader();
                    imageFileReader.readAsDataURL(files[0]);

                    imageFileReader.onload = (e) => {
                        let imageBuffer = e.target.result

                        window.chatEventBus.$emit('sendImage', { to: this.userConnected.id, from: window.chatEventBus.user, buffer: imageBuffer });
                        this.storeImageMessage(this.userConnected, imageBuffer, false)

                        this.$refs.imageLoader.value = '';
                        return;
                    };
                }
            };
        },

        openFile() {
            this.$refs.imageLoader.click();
        },

        deleteMessage(message) {
            this.getChatInstance().update(message.id, 'deleted', true);
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

        storeImageMessage(senderUser, image, receivedImage = true) {
            this.getChatInstance(senderUser.id).store(image, receivedImage, true);
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

            if(chatStarted) return;

            this.chats.push(
                new ChatEngine(userObject)
            );
        },

        adjustContainerScroll() {
            let container = document.querySelector('.chat .messages');
            
            container.scrollTo(0, container.scrollHeight);
        }
    }
}
</script>
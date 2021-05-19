<template>
    <div>
        <div class="principalscreen">
            <Menu v-if="redirect" :users="usersConnected" />
            <Chat />
            <ChatModal />
        </div>
    </div>
</template>
<script>
import Menu from "./content/Menu.vue"
import Chat from "./content/Chat.vue"
import IOClient from 'socket.io-client';
import ChatModal from './helpers/ChatModal.vue'
import Objects from '../../socket/functions/Objects.js'

export default {
    name: "PrincipalScreen",
    components: { Menu, Chat, ChatModal },
    data() {
        return {
            redirect: false,
            socket: {},
            usersConnected: []
        }
    },
    created() {
        this.initSocket();

        this.socket.on('myData', event => (window.chatEventBus.user = event, this.redirect = true));
        this.socket.on('receivePrivateMessage', event => window.chatEventBus.$emit('receivePrivateMessage', event));
        this.socket.on('deleteMessage', event => window.chatEventBus.$emit('deleteMessageForMe', event));

        window.chatEventBus.$on('sendPrivateMessage', event => this.socket.emit('sendPrivateMessage', event));

        window.chatEventBus.$on('deleteMessageForAll', event => {
            window.chatEventBus.$emit('deleteMessageForMe', event);
            this.socket.emit('deleteMessage', event);
        });
    },
    
    mounted() { 
        this.watchSocketEvents();
    },

    methods: {

        initSocket() {
            this.socket = IOClient('http://localhost:3000', { transports: ['websocket'] });
            this.socket.emit('userConnected', window.chatEventBus.username);
        },

        watchSocketEvents() {
            this.socket.on('connected', event => {
                this.usersConnected = event.reverse();
            })

            this.socket.on('userDisconnected', event => {
                window.chatEventBus.$emit('userDisconnected', event);

                let usersConnected = Objects.removeByAttribute(this.usersConnected, 'id', event.id);

                if(usersConnected.success) {
                    this.usersConnected = usersConnected.object;
                }
            });
        }
    }
}
</script>
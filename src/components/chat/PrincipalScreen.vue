<template>
    <div>
        <div class="principalscreen">
            <MenuBar v-if="redirect" :users="usersConnected" />
            <Chat />
            <ChatModal />
        </div>
    </div>
</template>
<script>
import IOClient from 'socket.io-client';
import MenuBar from "./content/MenuBar.vue"
import Chat from "./content/Chat.vue"
import Objects from '../../socket/functions/Objects.js'
import ChatModal from './helpers/ChatModal.vue'

export default {
    name: "PrincipalScreen",
    components: { MenuBar, Chat, ChatModal },
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

        window.chatEventBus.$on('sendPrivateMessage', event => {
            this.socket.emit('sendPrivateMessage', event);
        });

        this.socket.on('receivePrivateMessage', event => {
            window.chatEventBus.$emit('receivePrivateMessage', event);
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
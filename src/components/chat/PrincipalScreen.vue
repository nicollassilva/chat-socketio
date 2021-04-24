<template>
    <div>
        <div class="principalscreen">
            <PeoplesGroups v-if="redirect" :users="usersConnected" />
            <Chat />
        </div>
    </div>
</template>
<script>
import io from 'socket.io-client';
import PeoplesGroups from "./content/PeoplesGroups.vue"
import Chat from "./content/Chat.vue"
import Objects from '../../socket/functions/Objects.js'

export default {
    name: "PrincipalScreen",
    components: { PeoplesGroups, Chat },
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
        this.watchConnects();
    },

    methods: {

        initSocket() {
            this.socket = io('http://localhost:3000', { transports: ['websocket'] });
            this.socket.emit('userConnected', window.chatEventBus.username);
        },

        watchConnects() {
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
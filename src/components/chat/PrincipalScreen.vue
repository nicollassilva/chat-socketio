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
        this.socket = io('http://localhost:3000', { transports: ['websocket'] })
        this.socket.emit('userConnected', window.chatEventBus.username)
        this.socket.on('myInfo', event => (window.chatEventBus.user = event, this.redirect = true))

        window.chatEventBus.$on('private-message', event => {
            this.socket.emit('sendPrivateMessage', event)
        })

        this.socket.on('receivePrivateMessage', event => {
            window.chatEventBus.$emit('receive-private-message', event)
        })
    },
    mounted() { 
        this.watchConnects()
    },
    methods: {
        watchConnects() {
            this.socket.on('connected', event => {
                this.usersConnected = event.reverse()
            })
        }
    }
}
</script>
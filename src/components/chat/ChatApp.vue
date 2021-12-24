<template>
    <div>
        <div class="principalscreen">
            <Menu :connectedUsers="usersConnected" />
            <Chat />
            <ChatModal />
        </div>
    </div>
</template>
<script>
import Menu from "./content/Menu.vue"
import Chat from "./content/Chat.vue"
import Socket from '../../core/Socket'
import ChatModal from './helpers/ChatModal.vue'

export default {
    name: "ChatApp",

    components: { Menu, Chat, ChatModal },

    data() {
        return {
            socket: {},
            canShowMenu: false,
            usersConnected: []
        }
    },

    created() {
        this.socket = Socket.create('http://localhost:3000')

        // Emissão do evento pro socket retornar os dados do usuário
        window.chatEventBus.$on('fireToGetSocketUserData', userObject => {
            this.socket.emit('getSocketUserData', userObject)
        })

        // Atualizar a lista de usuários quando um usuário logar/deslogar
        window.chatEventBus.$on('userList', userList => {
            this.usersConnected = userList
        })

        // this.socket.on('receivePrivateMessage', event => window.chatEventBus.$emit('receivePrivateMessage', event));
        // this.socket.on('deleteMessage', event => window.chatEventBus.$emit('deleteMessageForMe', event));
        // this.socket.on('receiveImage', event => window.chatEventBus.$emit('renderImage', event));

        window.chatEventBus.$on('sendPrivateMessage', event => this.socket.emit('sendPrivateMessage', event));

        window.chatEventBus.$on('deleteMessageForAll', event => {
            window.chatEventBus.$emit('deleteMessageForMe', event);
            this.socket.emit('deleteMessage', event);
        });

        window.chatEventBus.$on('sendImage', event => {
            this.socket.emit('sendImage', { image: true, ...event });
        })
    },

    methods: {

    }
}
</script>
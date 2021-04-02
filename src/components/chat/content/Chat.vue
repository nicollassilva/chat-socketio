<template>
    <div class="chat" v-if="visibility">
        <div class="topbar">{{ userChat.name }}</div>
        <div class="messages" v-if="Array.isArray(messages) && chatMessage.length > 0">
            <div :class="['message', msg.me && 'me']" v-for="msg in chatMessage" :key="msg.id"><span>{{ msg.message }}</span></div>
        </div>
        <div class="messages" v-else>
            <div class="message me">Enter a message below and start your chat with {{ userChat.name }}</div>
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
            messages: []
        }
    },
    computed: {
        chatMessage() {
            let filter = this.messages.length > 0 && this.messages.filter(e => e.users && e.users.includes(this.myUser.id) && e.users.includes(this.userChat.id))
            return Array.isArray(filter) && filter.length > 0 ? filter[0].chatHistoric : []
        }
    },
    mounted() {
        setTimeout(() => this.myUser = window.chatEventBus.user, 1000)

        window.chatEventBus.$on('chat', event => {
            if(event.name && event.id) {
                if(this.userChat.name != event.name) {
                    this.userChat = event
                    this.visibility = true
                }
            }
        })

        window.chatEventBus.$on('receive-private-message', event => {
            this.pushMessage(event)
        })
    },
    updated() {
        this.adjustContainerScroll()
    },
    methods: {
        enterMessage(event) {
            if(event.target.value.length < 1) return

            let object = { from: this.myUser.id, to: this.userChat.id, message: event.target.value }
            window.chatEventBus.$emit('private-message', object)
            this.pushMessage(object)
            event.target.value = ''
        },

        checkMessage(from, to) {
            return !!this.messages.filter(e => e.users && e.users.includes(from) && e.users.includes(to)).length
        },

        pushMessage(data) {
            if(this.checkMessage(data.to, data.from)) {
                this.messages.forEach(e => {
                    if(e.users.includes(data.from) && e.users.includes(data.to)) {
                        e.chatHistoric.push({
                            message: data.message,
                            id: Math.floor(Math.random() * 100000 + 1),
                            me: (data.from === this.myUser.id)
                        })
                    }
                })
            } else {
                this.messages.push({
                users: [data.from, data.to],
                chatHistoric: [{
                        message: data.message,
                        id: Math.floor(Math.random() * 100000 + 1),
                        me: (data.from === this.myUser.id)
                    }]
                })
            }
        },

        adjustContainerScroll() {
            let container = document.querySelector('.chat .messages')
            
            container.scrollTo(0, container.scrollHeight)
        }
    }
}
</script>
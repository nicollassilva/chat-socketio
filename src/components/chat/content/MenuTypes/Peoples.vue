<template>
    <div class="peoples">
        <transition-group v-if="connectedUsers.length > 1" name="fade">
        <div class="my-2" v-for="user in connectedUsers" :key="user._id">
            <div class="people" v-if="userConnected._id != user._id" @click="openChat(user)">
                <div class="status online"></div>{{ user._name }}
            </div>
        </div>
        </transition-group>
        <div class="people empty" v-else @click.stop>Somente você está online :(</div>
    </div>
</template>
<script>
export default {
    name: "Peoples",
    
    props: {
        connectedUsers: {
            type: Array,
            required: true,
            default: () => []
        }
    },

    data() {
        return {
            userConnected: window.user
        }
    },

    mounted() {
        document.addEventListener('click', event => {
            if(event.target && event.target.classList.contains('people')) {
                this.removeActiveForElement('.people.active')
                event.target.classList.toggle('active')
            }
        })
    },

    methods: {
        openChat(user) {
            // user.name && user.name != this.user.name
            if(user.name) {
                window.chatEventBus.$emit('chat', { ...user })
            }
        },

        removeActiveForElement(className) {
            let element = document.querySelector(className)

            if(element) {
                element.classList.remove('active')
            }
        }
    }
}
</script>
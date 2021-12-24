<template>
    <div>
        <Login v-if="!isConnected"/>
        
        <transition name="fade">
            <ChatApp v-if="isConnected" />
        </transition>
    </div>
</template>

<script>
import Login from "./components/Login.vue";
import ChatApp from "./components/chat/ChatApp.vue";

export default {
    name: "Index",

    components: {
        Login, ChatApp
    },

    data() {
        return {
            isConnected: false
        }
    },

    mounted() {
        window.chatEventBus.$on('userEntering', userObject => {
            this.$set(this, 'isConnected', true)

            this.$nextTick(() => {
                window.chatEventBus.$emit('fireToGetSocketUserData', userObject)
            })
        })
    }
};
</script>
<template>
    <div>
        <Main v-if="username == ''"/>
        <transition name="fade">
        <PrincipalScreen v-if="username != ''" />
        </transition>
    </div>
</template>

<script>
import Main from "./components/Main.vue";
import PrincipalScreen from "./components/chat/PrincipalScreen.vue";

export default {
    name: "ChatInit",
    components: {
        Main, PrincipalScreen
    },
    data() {
        return {
            user: window.chatEventBus.username
        }
    },
    computed: {
        username() {
            return window.chatEventBus.username
        }
    }
};
</script>
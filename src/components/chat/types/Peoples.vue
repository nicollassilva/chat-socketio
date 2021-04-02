<template>
    <div class="peoples">
        <transition-group v-if="users.length > 1" name="fade">
        <div class="my-2" v-for="userConnected in users" :key="userConnected.id">
            <div class="people" v-if="userConnected.id != user.id" @click="chat(userConnected)">
                <div class="status online"></div>{{ userConnected.name }}
            </div>
        </div>
        </transition-group>
        <div class="people" v-else @click.stop>Only you are online for now</div>
    </div>
</template>
<script>
export default {
    name: "Peoples",
    props: { users: Array },
    data() {
        return {
            user: window.chatEventBus.user
        }
    },
    mounted() {
        document.addEventListener('click', event => {
            if(event.target && event.target.classList.contains('people')) {
                removeActiveClass('.people.active')
                event.target.classList.toggle('active')
            }
        })

        function removeActiveClass(className) {
            let element = document.querySelector(className)

            if(element) element.classList.remove('active')
        }
    },
    methods: {
        chat(user) {
            // user.name && user.name != this.user.name
            if(user.name) {
                window.chatEventBus.$emit('chat', { ...user })
            }
        }
    }
}
</script>
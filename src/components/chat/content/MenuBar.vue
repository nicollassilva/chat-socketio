<template>
    <div class="menu-peoples-groups">
        <div class="displayWelcome d-flex">
            Welcome, {{ user.name }}
        </div>
        <div class="buttons">
            <div class="button active" @click="changeMenu('users')" data-toggle="tooltip" title="Friends"><i class="fas fa-user-friends"></i></div>
            <div class="button" @click="changeMenu('groups')" data-toggle="tooltip" title="Groups">
                <i class="fas fa-users"></i>
                <div class="createGroup" data-toggle="tooltip" title="New" @click.stop="createGroup()"><i class="fas fa-plus"></i></div>
            </div>
        </div>
        <Peoples v-if="activeMenu == 'users'" :users="users" />
        <Groups v-else :groups="groups" />
    </div>
</template>
<script>
import Peoples from '../types/Peoples.vue'
import Groups from '../types/Groups.vue'

export default {
    name: "PeoplesGroups",
    props: {
        users: Array
    },
    components: { Peoples, Groups },
    data() {
        return {
            user: window.chatEventBus.user,
            activeMenu: 'users',
            groups: [
                {
                    name: 'Grupo da Zoeira',
                    id: 151516
                }
            ]
        }
    },
    mounted() {
        document.addEventListener('click', event => {
            if(event.target && event.target.classList.contains('button')) {
                removeActiveClass('.button.active')
                event.target.classList.toggle('active')
            }
        })

        function removeActiveClass(className) {
            let element = document.querySelector(className)

            if(element) element.classList.remove('active')
        }
    },
    methods: {
        changeMenu(menu) {
            if(menu != this.activeMenu) this.activeMenu = menu
        },

        createGroup() {
            console.log('criar grupo')
        }
    }
}
</script>
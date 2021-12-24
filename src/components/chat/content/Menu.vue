<template>
    <div class="menu-peoples-groups" v-if="visible">
        <div class="displayWelcome d-flex">
            Welcome, {{ user.name() }}
        </div>
        <div class="buttons">
            <div class="button active" @click="changeMenu('connectedUsers')" data-toggle="tooltip" title="Friends"><i class="fas fa-user-friends"></i></div>
            <div class="button" @click="changeMenu('groups')" data-toggle="tooltip" title="Groups">
                <i class="fas fa-users"></i>
                <div class="createGroup" data-toggle="tooltip" title="New" @click.stop="createGroup()"><i class="fas fa-plus"></i></div>
            </div>
        </div>
        <Peoples v-if="menuActiveIs('connectedUsers')" :connectedUsers="connectedUsers" />
        <Groups v-else :groups="groups" />
    </div>
</template>
<script>
import Groups from './MenuTypes/Groups.vue'
import Peoples from './MenuTypes/Peoples.vue'

export default {
    name: "Menu",

    props: {
        connectedUsers: Array
    },

    components: { Peoples, Groups },

    data() {
        return {
            user: {},
            visible: false,
            activeMenu: 'connectedUsers',
            groups: [
                {
                    name: 'Grupo da Zoeira',
                    id: 151516
                }
            ]
        }
    },
    
    mounted() {
        window.chatEventBus.$on('userDataUpdated', () => {
            this.user = window.user
            this.visible = true
        })

        document.addEventListener('click', event => {
            if(!event.target || !event.target.classList.contains('button')) return

            this.removeActiveClass('.button.active')
            event.target.classList.toggle('active')
        })
    },
    methods: {
        changeMenu(menu) {
            if(menu != this.activeMenu) {
                this.activeMenu = menu
            }
        },

        menuActiveIs(menu) {
            return this.activeMenu === menu
        },

        createGroup() {
            console.log('criar grupo')
        },

        removeActiveClass(className) {
            let element = document.querySelector(className)

            if(element) element.classList.remove('active')
        }
    }
}
</script>
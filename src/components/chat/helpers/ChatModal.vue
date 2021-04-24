<template>
    <transition name="fade">
        <div class="chat-modal" @click.self="close" v-if="visible">
            <div class="box-modal">
                <span class="title">{{ getTitle() }}</span>
            </div>
        </div>
    </transition>
</template>
<script>
export default {
    data() {
        return {
            visible: false,
            modalOpened: null,
            modalData: null
        }
    },

    mounted() {
        window.chatEventBus.$on('Modal', event => {
            if(event.type != this.modalOpened) {
                this.modalOpened = event.type
                this.modalData = event.data
                this.visible = true
            }
        });
    },

    methods: {
        close() {
            this.visible = !this.visible;
            this.resetModal();
        },

        resetModal() {
            this.modalOpened = null;
            this.modalData = null;
        },

        getTitle() {
            let title = '';

            switch(this.modalOpened) {
                case 'deleteMessage':
                    title = 'Apagar mensagem';
                    break;
            }

            return title;
        }
    }
}
</script>
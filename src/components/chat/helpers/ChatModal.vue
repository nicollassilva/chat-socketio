<template>
    <transition name="fade">
        <div class="chat-modal" @click.self="close" v-if="visible">
            <div class="box-modal">
                <span class="title">{{ getTitle() }}</span>
                <div class="buttons">
                    <button @click="deleteMessage(true)" v-if="isModal('deleteMessage') && modalData.me" class="danger">Apagar para todos</button>
                    <button @click="deleteMessage()" v-if="isModal('deleteMessage')" class="danger">Apagar para mim</button>
                    <button @click="close" v-if="isModal('deleteMessage')" class="inline danger">Cancelar</button>
                </div>
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
        window.chatEventBus.$on('ChatModal', event => {
            if(event.type != this.modalOpened) {
                this.modalOpened = event.type;
                this.modalData = { ...event.data, user: event.user };
            }
            this.visible = true;
        });
    },

    methods: {
        deleteMessage(forAll = false) {
            if(forAll) {
                window.chatEventBus.$emit('deleteMessageForAll', this.modalData);
            } else {
                window.chatEventBus.$emit('deleteMessageForMe', this.modalData);
            }
            
            this.close();
        },

        isModal(modal) {
            return this.modalOpened === modal;
        },

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
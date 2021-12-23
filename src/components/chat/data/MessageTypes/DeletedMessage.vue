<template>
    <div class="msg">
        <div :class="['text-danger', 'font-weight-bold', message.me && 'me']">
            <i class="fas fa-ban mr-2"></i>Essa imagem foi deletada.
        </div>
    </div>
</template>
<script>
export default {
    props: ['message']
}
</script>
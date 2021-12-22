<template>
    <span :class="['msg', 'text-danger', 'font-weight-bold', message.me && 'me']">
        <i class="fas fa-ban mr-2"></i>Essa imagem foi deletada.
    </span>
</template>
<script>
export default {
    props: ['message']
}
</script>
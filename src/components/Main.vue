<template>
     <div>
          <div class="login">
               <span>Digite seu nome e entre no chat!</span>
               <p>Pra entrar aqui, você só precisa digitar seu nome aqui em baixo, e assim, já está liberado para bater um papo conosco.</p>
               <input type="text" autocomplete="off" @keyup.enter="submit" name="name" v-model="name" placeholder="Digite aqui (enter para prosseguir)" autofocus />
          </div>
          <div class="waves"></div>
     </div>
</template>

<script>
export default {
     name: "Main",
     props: {
          msg: String,
     },
     data() {
          return {
               name: ''
          }
     },
     methods: {
          submit() {
               window.chatEventBus.username = this.name
          }
     }
};
</script>

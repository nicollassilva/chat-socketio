<template>
     <div>
          <div class="login">
               <span>Digite seu nome e entre no chat!</span>
               <p>Pra entrar aqui, você só precisa digitar seu nome aqui em baixo, e assim, já está liberado para bater um papo conosco.</p>
               <input type="text" autocomplete="off" @keyup.enter="enterOnChat" name="name" v-model="name" placeholder="Digite aqui (enter para prosseguir)" autofocus />
          </div>
          <div class="waves"></div>
     </div>
</template>

<script>
import User from '../core/User'

export default {
     name: "Login",
     props: {
          msg: String,
     },
     data() {
          return {
               name: ''
          }
     },
     methods: {
          enterOnChat() {
               if(!this.name.length) return
               
               let newUser = new User({ name: this.name })

               window.chatEventBus.$emit('userEntering', newUser)
          }
     }
};
</script>

import Vue from "vue";
import ChatInit from "./ChatInit.vue";
import "./assets/css/app.scss";

require('./bootstrap');

/**
 * Event bus
 */
window.chatEventBus = new Vue({
    data: {
        username: ''
    }
});

Vue.config.productionTip = false;

window.$('body').tooltip({
  selector: '[data-toggle="tooltip"]',
  boundary: 'window'
})


new Vue({
     render: (h) => h(ChatInit),
}).$mount("#app");

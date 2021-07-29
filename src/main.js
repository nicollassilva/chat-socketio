import Vue from "vue";
import Viewer from 'v-viewer';
import "./assets/css/app.scss";
import 'viewerjs/dist/viewer.css'
import ChatInit from "./ChatInit.vue";

require('./bootstrap');

Vue.use(Viewer);

Viewer.setDefaults({
  navbar: false,
  title: false,
  tooltip: false,
  movable: false,
  zoomable: false,
  scalable: false
});

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

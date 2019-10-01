// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import Navigation from './components/Navigation.vue'
import Header from './components/Header.vue'
import Portfolio from './components/Portfolio.vue'
import Playground from './components/Playground.vue'
import About from './components/About.vue'
import Contact from './components/Contact.vue'
import Footer from './components/Footer.vue'
import Modals from './components/Modals.vue'

Vue.config.productionTip = false;

Vue.component('Navigation', Navigation);
Vue.component('Header', Header);
Vue.component('Portfolio', Portfolio);
Vue.component('Playground', Playground);
Vue.component('About', About);
Vue.component('Contact', Contact);
Vue.component('Footer', Footer);
Vue.component('Modals', Modals);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});

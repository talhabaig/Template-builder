import Vue from 'vue'
import App from './App.vue'
import router from './router'
import CKEditor from '@ckeditor/ckeditor5-vue2'
import '@ckeditor/ckeditor5-build-classic'

Vue.config.productionTip = false

// Register CKEditor globally
Vue.use(CKEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

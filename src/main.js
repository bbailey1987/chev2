import Vue from "vue";
import BootstrapVue from 'bootstrap-vue';
import App from "./App.vue";
import router from "./router";
import store from "./store";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import axios from 'axios';
import { default as Adal, AxiosAuthHttp } from 'vue-adal';

Vue.config.productionTip = false;
const graphApiBase = 'https://graph.windows.net';
const graphApiResource = '00000002-0000-0000-c000-000000000000';

Vue.use(Adal, {
  config: {
    tenant: 'cscportal.onmicrosoft.com',
    //tenant: 'b7b2e3ae-aef1-419f-8d62-c214de959210',
    clientId: '9fa43858-7c2a-457a-ab78-1055447a52e6',
    //clientId: '9fa43858-7c2a-457a-ab78-1055447a52e6',
    redirectUri: 'http://localhost:3000',
    cacheLocation: 'localStorage'
  },
  requireAuthOnInitialize: true,
  router: router
});

Vue.use({
  install (vue, opts = {}) {
    // Configures an axios http client with a interceptor to auto-acquire tokens
    vue.prototype.$graphApi = AxiosAuthHttp.createNewClient({
      // Required Params
      axios: axios,
      resourceId: graphApiResource, // Resource id to get a token against

      // Optional Params
      router: router, // Enables a router hook to auto-acquire a token for the specific resource

      baseUrl: graphApiBase, // Base url to configure the client with

      onTokenSuccess (http, context, token) { // Token success hook
        // When an attempt to retrieve a token is successful, this will get called.
        // This enables modification of the client after a successful call.
        if (context.user) {
          // Setup the client to talk with the Microsoft Graph API
          http.defaults.baseURL = `${graphApiBase}/${context.user.profile.tid}`
        }
      },

      onTokenFailure (error) { // Token failure hook
        // When an attempt to retrieve a token is not successful, this will get called.
        console.log(error)
      }
    })
  }
})

Vue.use(BootstrapVue);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

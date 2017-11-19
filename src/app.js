import $ from 'jquery'
import Vue from 'vue'

import AppComponent from './components/app.vue';
import store from './store'

window.Store = store;
// import icons from 'ionicons/dist/'

// import styles from './styles/style.scss'
$(() => {
    new Vue({
        el: '#app',
        store,
        components: {
            'app-component': AppComponent
        }
    });
});

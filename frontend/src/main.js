import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import HomeView from './views/HomeView.vue';
import EventView from './views/EventView.vue';
import './style.css';
var router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'home', component: HomeView },
        { path: '/events/:id(\\d+)', name: 'event', component: EventView, props: function (route) { return ({ id: Number(route.params.id) }); } },
    ],
    scrollBehavior: function () { return ({ top: 0 }); },
});
createApp(App).use(router).mount('#app');

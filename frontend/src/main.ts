import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import HomeView from './views/HomeView.vue'
import EventView from './views/EventView.vue'
import NotFoundView from './views/NotFoundView.vue'
import './style.css'

/** Ждёт, пока probe() вернёт truthy-значение (афиша грузится асинхронно), но не дольше timeout. */
function waitFor<T>(probe: () => T | null | undefined | false, timeout = 2000): Promise<T | null> {
  return new Promise((resolve) => {
    const startedAt = Date.now()
    const tick = () => {
      const result = probe()
      if (result) resolve(result)
      else if (Date.now() - startedAt >= timeout) resolve(null)
      else setTimeout(tick, 50)
    }
    tick()
  })
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/events/:id(\\d+)', name: 'event', component: EventView, props: (route) => ({ id: Number(route.params.id) }) },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
  // Раньше здесь всегда было { top: 0 }: якоря шапки прокручивали страницу наверх вместо
  // раздела, «Назад» терял позицию в списке, а смена категории подбрасывала страницу.
  async scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      await waitFor(() => document.documentElement.scrollHeight >= savedPosition.top + window.innerHeight)
      return savedPosition
    }
    if (to.hash) {
      // Подборки и площадки появляются после загрузки событий — ждём нужный раздел.
      const section = await waitFor(() => document.getElementById(decodeURIComponent(to.hash.slice(1))))
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return false
    }
    if (to.path === from.path) return false
    return { top: 0 }
  },
})

createApp(App).use(router).mount('#app')

<template>
  <header class="site-header">
    <div class="header-main page-frame">
      <RouterLink class="brand" to="/">АФИША</RouterLink>
      <span class="city-label"><span class="pin-icon">⌖</span> Сургут <span class="chevron">⌄</span></span>
      <nav class="main-nav" aria-label="Основная навигация">
        <RouterLink to="/">События</RouterLink><SectionLink hash="#calendar">Календарь</SectionLink><SectionLink hash="#venues">Площадки</SectionLink><a href="#about">Журнал</a><a href="#organizers">Организаторам</a>
      </nav>
      <button class="header-icon search-shortcut" type="button" aria-label="Перейти к поиску" @click="focusSearch">⌕</button>
      <span class="header-icon bookmark-shortcut" aria-hidden="true">♧</span>
      <span class="login-label"><span class="user-icon">○</span> Войти</span>
      <button class="mobile-menu" type="button" :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">{{ menuOpen ? '×' : '☰' }}</button>
    </div>
    <div class="category-nav-wrap" :class="{ 'mobile-open': menuOpen }">
      <nav class="category-nav page-frame" aria-label="Категории">
        <!-- Активность считаем сами: router-link-active не учитывает ?category=, и на главной
             подсвечивались сразу все категории. -->
        <RouterLink v-for="item in navCategories" :key="item.value" :to="item.value === ALL_CATEGORIES ? '/' : { path: '/', query: { category: item.value } }" :class="{ 'is-active': activeCategory === item.value }" :aria-current="activeCategory === item.value ? 'page' : undefined" active-class="" exact-active-class="">{{ item.label }}</RouterLink>
        <span class="pushkin-pill">▣ ПУШКИНСКАЯ КАРТА</span>
      </nav>
    </div>
  </header>
  <main><RouterView /></main>
  <footer class="site-footer" id="about">
    <div class="page-frame footer-grid">
      <div class="footer-brand"><RouterLink class="brand" to="/">АФИША</RouterLink><p>Культурный гид и удобный сервис бронирования билетов на главные события в Сургуте.</p><span class="footer-city">⌖ СУРГУТ, ХМАО-ЮГРА</span></div>
      <div><h3>КАТЕГОРИИ</h3><SectionLink hash="#categories">Все события</SectionLink><SectionLink hash="#calendar">Умный поиск и даты</SectionLink><SectionLink hash="#venues">Театры и залы</SectionLink><SectionLink hash="#editorial">Редакционные гиды</SectionLink></div>
      <div><h3>КУЛЬТУРА</h3><SectionLink hash="#venues">Сургутский муздрамтеатр</SectionLink><SectionLink hash="#venues">Филармония</SectionLink><SectionLink hash="#venues">Художественный музей</SectionLink><a href="#about">О сервисе</a></div>
      <div id="organizers"><h3>СЕРВИС И B2B</h3><a href="#organizers">Для организаторов</a><a href="#about">Возврат билетов</a><a href="#about">Помощь и оплата</a><a href="#about">Частые вопросы</a></div>
    </div>
    <div class="page-frame footer-bottom"><span>© {{ year }} АФИША. Сервис бронирования билетов на культурные события в Сургуте.</span><span>Конфиденциальность　 Пользовательское соглашение</span></div>
  </footer>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SectionLink from './components/SectionLink.vue'
import { ALL_CATEGORIES } from './types/event'

const route = useRoute()
const router = useRouter()
const menuOpen = ref(false)
const year = new Date().getFullYear()
const navCategories = [
  { label: 'Все события', value: ALL_CATEGORIES },
  { label: 'Театр', value: 'Театр' },
  { label: 'Концерты', value: 'Концерт' },
  { label: 'Кино', value: 'Кино' },
  { label: 'Выставки', value: 'Выставка' },
  { label: 'Детям', value: 'Детям' },
  { label: 'Лекции и мастер-классы', value: 'Мастер-класс' },
]
const activeCategory = computed(() => {
  if (route.name !== 'home') return null
  const value = route.query.category
  return typeof value === 'string' && value ? value : ALL_CATEGORIES
})

// Мобильное меню закрывается после выбора категории или перехода на другую страницу.
watch(() => route.fullPath, () => { menuOpen.value = false })

async function focusSearch() {
  // Поиск есть только на главной: со страницы события сначала переходим туда.
  if (route.name !== 'home') await router.push('/')
  await nextTick()
  document.querySelector<HTMLInputElement>('#event-search')?.focus()
}
</script>

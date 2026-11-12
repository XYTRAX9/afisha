<template>
  <header class="site-header">
    <div class="header-main page-frame">
      <RouterLink class="brand" to="/">АФИША</RouterLink>
      <span class="city-label"><span class="pin-icon">⌖</span> Сургут <span class="chevron">⌄</span></span>
      <nav class="main-nav" aria-label="Основная навигация">
        <RouterLink to="/">События</RouterLink><a href="#calendar">Календарь</a><a href="#venues">Площадки</a><a href="#about">Журнал</a><a href="#organizers">Организаторам</a>
      </nav>
      <button class="header-icon search-shortcut" type="button" aria-label="Перейти к поиску" @click="focusSearch">⌕</button>
      <span class="header-icon bookmark-shortcut" aria-hidden="true">♧</span>
      <span class="login-label"><span class="user-icon">○</span> Войти</span>
      <button class="mobile-menu" type="button" aria-label="Открыть меню" @click="menuOpen = !menuOpen">{{ menuOpen ? '×' : '☰' }}</button>
    </div>
    <div class="category-nav-wrap" :class="{ 'mobile-open': menuOpen }">
      <nav class="category-nav page-frame" aria-label="Категории">
        <RouterLink class="all-events" to="/">Все события</RouterLink>
        <RouterLink to="/?category=Театр">Театр</RouterLink><RouterLink to="/?category=Концерт">Концерты</RouterLink><RouterLink to="/?category=Кино">Кино</RouterLink><RouterLink to="/?category=Выставка">Выставки</RouterLink><RouterLink to="/?category=Детям">Детям</RouterLink><a href="#categories">Лекции и мастер-классы</a>
        <span class="pushkin-pill">▣ ПУШКИНСКАЯ КАРТА</span>
      </nav>
    </div>
  </header>
  <main><RouterView /></main>
  <footer class="site-footer" id="about">
    <div class="page-frame footer-grid">
      <div class="footer-brand"><RouterLink class="brand" to="/">АФИША</RouterLink><p>Культурный гид и удобный сервис бронирования билетов на главные события в Сургуте.</p><span class="footer-city">⌖ СУРГУТ, ХМАО-ЮГРА</span></div>
      <div><h3>КАТЕГОРИИ</h3><a href="#categories">Все события</a><a href="#events">Умный поиск и даты</a><a href="#events">Театры и залы</a><a href="#events">Редакционные гиды</a></div>
      <div><h3>КУЛЬТУРА</h3><a href="#venues">Сургутский муздрамтеатр</a><a href="#venues">Филармония</a><a href="#venues">Художественный музей</a><a href="#about">О сервисе</a></div>
      <div id="organizers"><h3>СЕРВИС И B2B</h3><a href="#organizers">Для организаторов</a><a href="#about">Возврат билетов</a><a href="#about">Помощь и оплата</a><a href="#about">Частые вопросы</a></div>
    </div>
    <div class="page-frame footer-bottom"><span>© 2025 АФИША. Сервис бронирования билетов на культурные события в Сургуте.</span><span>Конфиденциальность　 Пользовательское соглашение</span></div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const menuOpen = ref(false)
function focusSearch() { document.querySelector<HTMLInputElement>('#event-search')?.focus() }
</script>

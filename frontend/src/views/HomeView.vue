<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EventCard from '../components/EventCard.vue'
import EventDialog from '../components/EventDialog.vue'
import { createEvent, deleteEvent, getEvents, updateEvent } from '../api'
import type { EventItem, EventPayload } from '../types/event'
import { categories } from '../types/event'

const route = useRoute()
const router = useRouter()
const events = ref<EventItem[]>([])
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const query = ref('')
const category = ref('Все события')
const fromDate = ref('')
const toDate = ref('')
const dialogOpen = ref(false)
const editing = ref<EventItem | null>(null)
const activeDate = ref('Все даты')
const featured = computed(() => events.value.slice(0, 3))
const venues = computed(() => [...new Set(events.value.map((event) => event.venue))].slice(0, 4))
function localDateValue(value: Date) {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
}

async function loadEvents() {
  loading.value = true
  error.value = ''
  try {
    events.value = await getEvents({ q: query.value, category: category.value, date_from: fromDate.value, date_to: toDate.value })
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Не удалось загрузить события'
  } finally { loading.value = false }
}

watch([query, category, fromDate, toDate], () => { void loadEvents() })
watch(() => route.query.category, (value) => { category.value = typeof value === 'string' ? value : 'Все события' }, { immediate: true })
onMounted(loadEvents)

function applyPreset(preset: string) {
  activeDate.value = preset
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (preset === 'Сегодня') { fromDate.value = localDateValue(today); toDate.value = fromDate.value }
  else if (preset === 'Завтра') { const day = new Date(today); day.setDate(day.getDate() + 1); fromDate.value = localDateValue(day); toDate.value = fromDate.value }
  else if (preset === 'На выходных') {
    const saturday = new Date(today)
    saturday.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7 || 7))
    const sunday = new Date(saturday)
    sunday.setDate(saturday.getDate() + 1)
    fromDate.value = localDateValue(saturday)
    toDate.value = localDateValue(sunday)
  } else if (preset === 'Ближайший месяц') {
    const end = new Date(today)
    end.setMonth(end.getMonth() + 1)
    fromDate.value = localDateValue(today)
    toDate.value = localDateValue(end)
  } else if (preset === 'Все даты') { fromDate.value = ''; toDate.value = '' }
}
function openCreate() { editing.value = null; dialogOpen.value = true }
function openEdit(event: EventItem) { editing.value = event; dialogOpen.value = true }
async function saveEvent(payload: EventPayload) {
  saving.value = true
  error.value = ''
  try {
    if (editing.value) await updateEvent(editing.value.id, payload)
    else await createEvent(payload)
    dialogOpen.value = false
    await loadEvents()
  } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Не удалось сохранить событие' }
  finally { saving.value = false }
}
async function removeEvent(event: EventItem) {
  if (!window.confirm(`Удалить событие «${event.title}»?`)) return
  try { await deleteEvent(event.id); await loadEvents() }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Не удалось удалить событие' }
}
function choose(event: EventItem) { void router.push({ name: 'event', params: { id: event.id } }) }
function resetFilters() { query.value = ''; category.value = 'Все события'; fromDate.value = ''; toDate.value = ''; activeDate.value = 'Все даты'; void router.replace({ query: {} }) }
function scrollToEvents() { document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' }) }
</script>

<template>
  <div class="page-frame home-view">
    <section class="hero-panel">
      <div class="hero-copy"><p class="eyebrow">СЕЗОН 2025 / 2026 · СУРГУТ</p><h1>Найдите событие по душе</h1><p>Культура, музыка и живые впечатления — рядом с вами в Сургуте. Билеты на главные сцены города без наценок и очередей.</p></div>
      <div class="search-form" role="search"><span class="search-mark" aria-hidden="true">⌕</span><input id="event-search" v-model.trim="query" type="search" placeholder="Спектакль, концерт, фильм, площадка…" aria-label="Поиск событий"><label class="search-date"><span>▦</span><input v-model="fromDate" type="date" aria-label="Дата события" @change="toDate = fromDate"></label><select v-model="category" aria-label="Категория"><option>Все события</option><option v-for="item in categories" :key="item">{{ item }}</option></select><button class="button primary-button search-button" type="button" @click="loadEvents">Найти события <span>→</span></button></div>
      <div class="hero-notes"><span>◉ Проверенные площадки</span><span>▣ Электронный билет за 30 секунд</span><span>◎ Оплата Пушкинской картой</span><span class="available-note">Событий рядом: <strong>{{ events.length }}</strong></span></div>
    </section>

    <section id="categories" class="category-section">
      <div class="section-kicker-row"><p class="eyebrow">КАТЕГОРИИ И ЖАНРЫ</p><span>Быстрый фильтр каталога</span></div>
      <div class="chip-row"><button v-for="item in ['Все события', ...categories]" :key="item" class="category-chip" :class="{ selected: category === item }" type="button" @click="category = item">{{ item }}</button></div>
    </section>

    <section v-if="featured.length" class="editorial-section">
      <div class="section-heading"><div><p class="eyebrow">КУЛЬТУРНЫЙ ВЫБОР</p><h2>Подборки редакции</h2><p>Рекомендации культурных обозревателей Сургута на ближайшие дни</p></div><button class="text-link" type="button" @click="scrollToEvents">Вся афиша <span>→</span></button></div>
      <div class="editorial-grid"><button v-for="(event, index) in featured" :key="event.id" class="editorial-card" type="button" @click="choose(event)"><img :src="event.image_url" :alt="event.title"><span class="editorial-shade"></span><span class="editorial-label">{{ index === 0 ? 'СЕГОДНЯ · ВЫБОР РЕДАКЦИИ' : index === 1 ? 'БЛИЖАЙШИЕ ДНИ' : 'СЕМЕЙНЫЙ ВЫХОД' }}</span><span class="editorial-title">{{ index === 0 ? 'Сегодня в Сургуте' : index === 1 ? 'Планы на выходные' : 'Куда сходить в городе' }}</span><span class="editorial-caption">{{ event.title }}</span></button></div>
    </section>

    <section id="calendar" class="events-section">
      <div class="section-heading events-heading"><div><p class="eyebrow">КАЛЕНДАРЬ АФИШИ</p><h2>Ближайшие события</h2></div><button class="button secondary-button add-event" type="button" @click="openCreate"><span>＋</span> Добавить событие</button></div>
      <div class="event-tools"><div class="date-chips"><button v-for="preset in ['Все даты', 'Сегодня', 'Завтра', 'На выходных', 'Ближайший месяц']" :key="preset" class="date-chip" :class="{ active: activeDate === preset }" type="button" @click="applyPreset(preset)">{{ preset }}</button></div><span class="sort-select">Показываем ближайшие события</span></div>
      <div v-if="error" class="notice error-notice" role="alert"><span>Не удалось выполнить запрос: {{ error }}</span><button type="button" @click="loadEvents">Повторить</button></div>
      <div v-if="loading" class="loading-state" role="status"><span class="spinner"></span><span>Загружаем афишу…</span></div>
      <div v-else-if="events.length" class="event-grid"><EventCard v-for="event in events" :key="event.id" :event="event" @select="choose" @edit="openEdit" @remove="removeEvent" /></div>
      <div v-else-if="!error" class="empty-state"><span class="empty-mark">⌕</span><h3>Пока ничего не нашлось</h3><p>Попробуйте изменить запрос или выбрать другую категорию.</p><button class="button secondary-button" type="button" @click="resetFilters">Сбросить фильтры</button></div>
      <div v-if="events.length" class="results-meta">Показано {{ events.length }} {{ events.length === 1 ? 'событие' : 'событий' }} в Сургуте</div>
    </section>

    <section v-if="venues.length" id="venues" class="venues-section"><div class="section-heading"><div><p class="eyebrow">КУЛЬТУРНЫЕ ПРОСТРАНСТВА</p><h2>Главные площадки города</h2><p>Организаторы, которые создают культурный ландшафт Сургута</p></div></div><div class="venue-grid"><article v-for="(venue, index) in venues" :key="venue" class="venue-card"><div class="venue-image" :class="`venue-image-${index + 1}`"><img :src="`/venues/venue-${String(index + 1).padStart(2, '0')}.jpg`" :alt="venue" loading="lazy"></div><h3>{{ venue }}</h3><p>Сургут, ХМАО-Югра</p><span class="venue-count">{{ events.filter((event) => event.venue === venue).length }} события в афише <b>→</b></span></article></div></section>
    <section class="newsletter"><div><p class="eyebrow">ЕЖЕНЕДЕЛЬНЫЙ КУЛЬТУРНЫЙ ДАЙДЖЕСТ</p><h2>Не пропускайте премьеры и гастроли в Сургуте</h2><p>Подборка событий, концертов и выставок на выходные — без спама и лишних писем.</p></div><div class="newsletter-form"><input type="email" placeholder="Ваш e-mail адрес" aria-label="Ваш e-mail адрес"><button class="button primary-button" type="button" disabled title="Подписка появится в следующих версиях">Подписаться</button><small>Подписка недоступна в MVP</small></div></section>
    <EventDialog :open="dialogOpen" :event="editing" :busy="saving" @close="dialogOpen = false" @save="saveEvent" />
  </div>
</template>

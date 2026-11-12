<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import EventDialog from '../components/EventDialog.vue'
import { deleteEvent, getEvent, updateEvent } from '../api'
import type { EventItem, EventPayload } from '../types/event'
import { formatEventDate } from '../types/event'

const props = defineProps<{ id: number }>()
const router = useRouter()
const event = ref<EventItem | null>(null)
const loading = ref(true)
const error = ref('')
const editing = ref(false)
const saving = ref(false)

async function load() {
  loading.value = true
  error.value = ''
  try { event.value = await getEvent(props.id) }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Не удалось загрузить событие' }
  finally { loading.value = false }
}
onMounted(load)
watch(() => props.id, load)
async function save(payload: EventPayload) {
  if (!event.value) return
  saving.value = true
  try { event.value = await updateEvent(event.value.id, payload); editing.value = false }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Не удалось сохранить событие' }
  finally { saving.value = false }
}
async function remove() {
  if (!event.value || !window.confirm(`Удалить событие «${event.value.title}»?`)) return
  try { await deleteEvent(event.value.id); await router.push('/') }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Не удалось удалить событие' }
}
</script>

<template>
  <div class="page-frame detail-page">
    <p class="breadcrumbs"><RouterLink to="/">Главная</RouterLink><span>›</span><span>{{ event?.category || 'Событие' }}</span><span>›</span><span>{{ event?.title || 'Загрузка' }}</span></p>
    <div v-if="loading" class="loading-state"><span class="spinner"></span><span>Загружаем событие…</span></div>
    <div v-else-if="error && !event" class="empty-state"><h2>Событие недоступно</h2><p>{{ error }}</p><RouterLink class="button secondary-button" to="/">Вернуться к афише</RouterLink></div>
    <template v-else-if="event">
      <div v-if="error" class="notice error-notice" role="alert">{{ error }}</div>
      <section class="event-detail-hero">
        <div class="detail-poster-wrap"><img v-if="event.image_url" :src="event.image_url" :alt="event.title" class="detail-poster"><div v-else class="detail-poster poster-placeholder">АФИША</div></div>
        <div class="event-detail-info"><span class="eyebrow">{{ event.category.toUpperCase() }} · {{ event.age_limit }} · СЕЗОН 2025–2026</span><h1>{{ event.title }}</h1><p class="event-detail-lead">{{ event.description }}</p><div class="detail-summary"><div><span>▦ ДАТА И ВРЕМЯ</span><strong>{{ formatEventDate(event.starts_at) }}</strong></div><div><span>⌖ ПЛОЩАДКА</span><strong>{{ event.venue }}</strong></div><div><span>◉ СТОИМОСТЬ</span><strong>{{ event.price ? `от ${event.price.toLocaleString('ru-RU')} ₽` : 'Бесплатно' }}</strong></div></div><div class="detail-management"><button class="button primary-button" type="button" @click="editing = true">Редактировать событие</button><button class="button danger-button" type="button" @click="remove">Удалить событие</button></div></div>
      </section>
      <section class="detail-body"><div><p class="eyebrow">О СОБЫТИИ</p><h2>Впечатления, которые остаются с вами</h2><p>{{ event.description }}</p><p>Событие пройдет в пространстве {{ event.venue }}. Адрес: {{ event.address }}.</p></div><aside class="venue-info"><p class="eyebrow">МЕСТО ПРОВЕДЕНИЯ</p><h3>{{ event.venue }}</h3><p>{{ event.address }}</p><span>Информация предоставлена организатором</span></aside></section>
    </template>
    <EventDialog :open="editing" :event="event" :busy="saving" @close="editing = false" @save="save" />
  </div>
</template>

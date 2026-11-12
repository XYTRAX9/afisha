<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import type { EventItem, EventPayload } from '../types/event'
import { ageLimits, categories, fromCityDateTimeInput, toCityDateTimeInput } from '../types/event'

const props = defineProps<{ open: boolean; event?: EventItem | null; busy?: boolean; error?: string }>()
const emit = defineEmits<{ close: []; save: [payload: EventPayload] }>()
const emptyForm = (): EventPayload => ({ title: '', category: 'Концерт', description: '', venue: '', address: 'Сургут, ХМАО-Югра', starts_at: '', price: 0, image_url: '', age_limit: '0+' })
const form = reactive<EventPayload>(emptyForm())
const dateError = ref('')
const title = computed(() => props.event ? 'Редактировать событие' : 'Новое событие')
// Категория события, созданного через API, может отсутствовать в списке: без неё select
// оказался бы пустым и не дал сохранить форму.
const categoryOptions = computed(() => {
  const current = props.event?.category
  return current && !categories.includes(current) ? [...categories, current] : categories
})

watch(() => [props.open, props.event] as const, () => {
  const event = props.event
  dateError.value = ''
  Object.assign(form, event ? {
    title: event.title, category: event.category, description: event.description, venue: event.venue,
    // Поле datetime-local показывает время Сургута. Раньше сюда попадало UTC-время,
    // которое при сохранении читалось как местное, и событие сдвигалось на −5 часов.
    address: event.address, starts_at: toCityDateTimeInput(event.starts_at),
    price: event.price, image_url: event.image_url, age_limit: event.age_limit,
  } : emptyForm())
}, { immediate: true })

// Фокус в первое поле при открытии: клавиатура работает сразу, Esc закрывает форму.
const titleInput = ref<HTMLInputElement | null>(null)
watch(() => props.open, async (open) => {
  if (!open) return
  await nextTick()
  titleInput.value?.focus()
}, { immediate: true })

function submit() {
  const startsAt = fromCityDateTimeInput(form.starts_at)
  if (!startsAt) { dateError.value = 'Укажите дату и время в формате ГГГГ-ММ-ДДTЧЧ:ММ'; return }
  dateError.value = ''
  emit('save', { ...form, starts_at: startsAt })
}

// Закрываем по клику на подложку, только если нажатие тоже началось на ней: иначе выделение
// текста в поле с отпусканием кнопки мыши за краем формы закрывало её и стирало введённое.
let pressStartedOnBackdrop = false
function onBackdropPointerDown(event: PointerEvent) {
  pressStartedOnBackdrop = event.target === event.currentTarget
}
function onBackdropClick(event: MouseEvent) {
  if (pressStartedOnBackdrop && event.target === event.currentTarget) emit('close')
  pressStartedOnBackdrop = false
}
</script>

<template>
  <div v-if="open" class="dialog-backdrop" @pointerdown="onBackdropPointerDown" @click="onBackdropClick" @keydown.esc="emit('close')">
    <section class="dialog event-form" role="dialog" aria-modal="true" aria-labelledby="event-form-title">
      <div class="dialog-heading"><div><span class="eyebrow">АФИША · СУРГУТ</span><h2 id="event-form-title">{{ title }}</h2></div><button class="icon-button" type="button" aria-label="Закрыть" @click="emit('close')">×</button></div>
      <form class="form-grid" @submit.prevent="submit">
        <label class="field full-field">Название события<input ref="titleInput" v-model.trim="form.title" required minlength="2" maxlength="180" placeholder="Например, Симфония тайги"></label>
        <label class="field">Категория<select v-model="form.category" required><option v-for="category in categoryOptions" :key="category">{{ category }}</option></select></label>
        <label class="field">Возрастное ограничение<select v-model="form.age_limit"><option v-for="age in ageLimits" :key="age">{{ age }}</option></select></label>
        <label class="field">Дата и время (по Сургуту)<input v-model="form.starts_at" type="datetime-local" required></label>
        <label class="field">Цена, ₽<input v-model.number="form.price" type="number" min="0" max="10000000" required></label>
        <label class="field">Площадка<input v-model.trim="form.venue" required minlength="2" maxlength="180"></label>
        <label class="field">Адрес<input v-model.trim="form.address" required minlength="2" maxlength="240"></label>
        <label class="field full-field">Ссылка на изображение<input v-model.trim="form.image_url" type="text" inputmode="url" maxlength="600" placeholder="https://… или /events/poster.jpg"></label>
        <label class="field full-field">Описание<textarea v-model.trim="form.description" required minlength="10" maxlength="5000" rows="4"></textarea></label>
        <div v-if="dateError" class="notice error-notice full-field form-error" role="alert">{{ dateError }}</div>
        <div v-else-if="error" class="notice error-notice full-field form-error" role="alert">Не удалось сохранить событие: {{ error }}</div>
        <div class="form-footer full-field"><button class="button secondary-button" type="button" @click="emit('close')">Отмена</button><button class="button primary-button" type="submit" :disabled="busy">{{ busy ? 'Сохраняем…' : 'Сохранить событие' }}</button></div>
      </form>
    </section>
  </div>
</template>

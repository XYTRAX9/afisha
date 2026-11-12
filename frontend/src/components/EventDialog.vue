<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { EventItem, EventPayload } from '../types/event'
import { categories } from '../types/event'

const props = defineProps<{ open: boolean; event?: EventItem | null; busy?: boolean }>()
const emit = defineEmits<{ close: []; save: [payload: EventPayload] }>()
const form = reactive({ title: '', category: 'Концерт', description: '', venue: '', address: 'Сургут, ХМАО-Югра', starts_at: '', price: 0, image_url: '', age_limit: '0+' })
const title = computed(() => props.event ? 'Редактировать событие' : 'Новое событие')

watch(() => [props.open, props.event] as const, () => {
  const event = props.event
  Object.assign(form, event ? {
    title: event.title, category: event.category, description: event.description, venue: event.venue,
    address: event.address, starts_at: new Date(event.starts_at).toISOString().slice(0, 16),
    price: event.price, image_url: event.image_url, age_limit: event.age_limit,
  } : { title: '', category: 'Концерт', description: '', venue: '', address: 'Сургут, ХМАО-Югра', starts_at: '', price: 0, image_url: '', age_limit: '0+' })
}, { immediate: true })

function submit() {
  const startsAt = new Date(form.starts_at)
  emit('save', { ...form, starts_at: startsAt.toISOString() })
}
</script>

<template>
  <div v-if="open" class="dialog-backdrop" @click.self="emit('close')">
    <section class="dialog event-form" role="dialog" aria-modal="true" :aria-labelledby="'event-form-title'">
      <div class="dialog-heading"><div><span class="eyebrow">АФИША · СУРГУТ</span><h2 id="event-form-title">{{ title }}</h2></div><button class="icon-button" type="button" aria-label="Закрыть" @click="emit('close')">×</button></div>
      <form class="form-grid" @submit.prevent="submit">
        <label class="field full-field">Название события<input v-model.trim="form.title" required minlength="2" maxlength="180" placeholder="Например, Симфония тайги"></label>
        <label class="field">Категория<select v-model="form.category" required><option v-for="category in categories" :key="category">{{ category }}</option></select></label>
        <label class="field">Возрастное ограничение<select v-model="form.age_limit"><option v-for="age in ['0+', '6+', '12+', '16+', '18+']" :key="age">{{ age }}</option></select></label>
        <label class="field">Дата и время<input v-model="form.starts_at" type="datetime-local" required></label>
        <label class="field">Цена, ₽<input v-model.number="form.price" type="number" min="0" max="10000000" required></label>
        <label class="field">Площадка<input v-model.trim="form.venue" required minlength="2" maxlength="180"></label>
        <label class="field">Адрес<input v-model.trim="form.address" required minlength="2" maxlength="240"></label>
        <label class="field full-field">Ссылка на изображение<input v-model.trim="form.image_url" type="text" inputmode="url" maxlength="600" placeholder="https://… или /events/poster.jpg"></label>
        <label class="field full-field">Описание<textarea v-model.trim="form.description" required minlength="10" maxlength="5000" rows="4"></textarea></label>
        <div class="form-footer full-field"><button class="button secondary-button" type="button" @click="emit('close')">Отмена</button><button class="button primary-button" type="submit" :disabled="busy">{{ busy ? 'Сохраняем…' : 'Сохранить событие' }}</button></div>
      </form>
    </section>
  </div>
</template>

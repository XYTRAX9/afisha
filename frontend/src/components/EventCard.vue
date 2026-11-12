<script setup lang="ts">
import type { EventItem } from '../types/event'
import { formatEventDate } from '../types/event'

defineProps<{ event: EventItem }>()
defineEmits<{ select: [event: EventItem]; edit: [event: EventItem]; remove: [event: EventItem] }>()
</script>

<template>
  <article class="event-card">
    <button class="poster-button" type="button" :aria-label="`Подробнее: ${event.title}`" @click="$emit('select', event)">
      <img v-if="event.image_url" class="poster" :src="event.image_url" :alt="event.title" loading="lazy">
      <div v-else class="poster poster-placeholder"><span>АФИША</span></div>
      <span class="poster-category">{{ event.category }}</span>
      <span class="age-tag">{{ event.age_limit }}</span>
    </button>
    <div class="event-content">
      <p class="event-date">{{ formatEventDate(event.starts_at) }}</p>
      <button class="event-title" type="button" @click="$emit('select', event)">{{ event.title }}</button>
      <p class="event-venue"><span aria-hidden="true">⌖</span> {{ event.venue }}</p>
      <div class="card-bottom">
        <div><span class="price-label">Стоимость</span><strong>{{ event.price ? `от ${event.price.toLocaleString('ru-RU')} ₽` : 'Бесплатно' }}</strong></div>
        <div class="card-actions">
          <button class="mini-action" type="button" :aria-label="`Изменить: ${event.title}`" @click="$emit('edit', event)">Изменить</button>
          <button class="mini-action remove-action" type="button" :aria-label="`Удалить: ${event.title}`" @click="$emit('remove', event)">Удалить</button>
        </div>
      </div>
    </div>
  </article>
</template>

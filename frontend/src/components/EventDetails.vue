<script setup lang="ts">
import type { EventItem } from '../types/event'
import { formatEventDate } from '../types/event'

defineProps<{ event: EventItem | null; busy?: boolean }>()
defineEmits<{ close: []; edit: [event: EventItem]; remove: [event: EventItem] }>()
</script>

<template>
  <div v-if="event" class="dialog-backdrop" @click.self="$emit('close')">
    <article class="dialog detail-dialog" role="dialog" aria-modal="true" :aria-label="event.title">
      <button class="icon-button detail-close" type="button" aria-label="Закрыть" @click="$emit('close')">×</button>
      <div class="detail-layout">
        <div class="detail-image-wrap"><img v-if="event.image_url" :src="event.image_url" :alt="event.title" class="detail-image"><div v-else class="detail-image poster-placeholder">АФИША</div></div>
        <div class="detail-copy"><span class="eyebrow">{{ event.category }} · {{ event.age_limit }}</span><h2>{{ event.title }}</h2><p class="detail-description">{{ event.description }}</p>
          <dl class="detail-facts"><div><dt>Дата и время</dt><dd>{{ formatEventDate(event.starts_at) }}</dd></div><div><dt>Площадка</dt><dd>{{ event.venue }}</dd></div><div><dt>Адрес</dt><dd>{{ event.address }}</dd></div><div><dt>Стоимость</dt><dd>{{ event.price ? `от ${event.price.toLocaleString('ru-RU')} ₽` : 'Бесплатно' }}</dd></div></dl>
          <div class="detail-actions"><button class="button primary-button" type="button" @click="$emit('edit', event)">Редактировать</button><button class="button danger-button" type="button" :disabled="busy" @click="$emit('remove', event)">Удалить событие</button></div>
        </div>
      </div>
    </article>
  </div>
</template>

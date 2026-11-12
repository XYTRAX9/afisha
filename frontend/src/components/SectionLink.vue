<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Ссылка на раздел главной (#calendar, #venues…). Обычный href="#…" не работал со страницы
// события, где этих разделов нет. На главной сохраняем выбранные фильтры (?category=…).
const props = defineProps<{ hash: string }>()
const route = useRoute()
const router = useRouter()
const target = computed(() => ({ path: '/', query: route.name === 'home' ? route.query : {}, hash: props.hash }))

function onClick(event: MouseEvent, navigate: (event?: MouseEvent) => unknown) {
  const plainClick = event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
  // Повторный клик по тому же разделу vue-router отклоняет как дублирующий переход,
  // и страница не прокручивалась. В этом случае прокручиваем сами.
  if (plainClick && router.resolve(target.value).fullPath === route.fullPath) {
    event.preventDefault()
    document.getElementById(props.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  navigate(event)
}
</script>

<template>
  <!-- custom: без router-link-active, иначе на главной «активными» считались бы все такие ссылки -->
  <RouterLink v-slot="{ href, navigate }" :to="target" custom><a :href="href" @click="onClick($event, navigate)"><slot /></a></RouterLink>
</template>

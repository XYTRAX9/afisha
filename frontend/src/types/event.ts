export interface EventItem {
  id: number
  title: string
  category: string
  description: string
  venue: string
  address: string
  starts_at: string
  price: number
  image_url: string
  age_limit: string
  created_at: string
  updated_at: string
}

export type EventPayload = Omit<EventItem, 'id' | 'created_at' | 'updated_at'>

export const categories = ['Театр', 'Концерт', 'Кино', 'Выставка', 'Детям', 'Мастер-класс']

export function formatEventDate(value: string): string {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
}

export function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short' }).format(new Date(value)).replace('.', '')
}

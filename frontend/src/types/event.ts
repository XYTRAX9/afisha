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

export const ALL_CATEGORIES = 'Все события'
export const categories = ['Театр', 'Концерт', 'Кино', 'Выставка', 'Детям', 'Мастер-класс']
export const ageLimits = ['0+', '6+', '12+', '16+', '18+']

/**
 * Афиша городская: даты показываются и вводятся по времени Сургута независимо от часового
 * пояса браузера. Тем же поясом backend трактует дни в фильтрах date_from/date_to.
 */
export const CITY_TIME_ZONE = 'Asia/Yekaterinburg'

const eventDateFormat = new Intl.DateTimeFormat('ru-RU', { timeZone: CITY_TIME_ZONE, day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
const shortDateFormat = new Intl.DateTimeFormat('ru-RU', { timeZone: CITY_TIME_ZONE, day: '2-digit', month: 'short' })
const partsFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: CITY_TIME_ZONE, hourCycle: 'h23',
  year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
})

const pad = (value: number) => String(value).padStart(2, '0')

/** Показания часов в Сургуте для момента `date`, упакованные в метку времени UTC. */
function cityWallClock(date: Date): number {
  const parts: Record<string, number> = {}
  for (const { type, value } of partsFormat.formatToParts(date)) if (type !== 'literal') parts[type] = Number(value)
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)
}

export function formatEventDate(value: string): string {
  return eventDateFormat.format(new Date(value))
}

export function formatShortDate(value: string): string {
  return shortDateFormat.format(new Date(value)).replace('.', '')
}

/** ISO-дата события → значение для <input type="datetime-local"> по времени Сургута. */
export function toCityDateTimeInput(value: string): string {
  return new Date(cityWallClock(new Date(value))).toISOString().slice(0, 16)
}

/**
 * Значение <input type="datetime-local"> (время Сургута) → ISO-строка в UTC для API.
 * Возвращает null для пустого или некорректного значения (браузеры без datetime-local
 * показывают обычное текстовое поле).
 */
export function fromCityDateTimeInput(value: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value.trim())
  if (!match) return null
  const [year, month, day, hour, minute] = match.slice(1).map(Number)
  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59) return null
  const wallClock = Date.UTC(year, month - 1, day, hour, minute)
  // Смещение пояса = показания часов в Сургуте минус сам момент; второй проход уточняет
  // результат, если смещение в этот день меняется (для поясов с переходом на летнее время).
  let instant = wallClock - (cityWallClock(new Date(wallClock)) - wallClock)
  instant = wallClock - (cityWallClock(new Date(instant)) - instant)
  return new Date(instant).toISOString()
}

/** Сегодняшняя дата в Сургуте как полночь UTC: дни удобно сдвигать через setUTCDate. */
export function cityToday(): Date {
  const now = new Date(cityWallClock(new Date()))
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
}

/** Дата из cityToday() → YYYY-MM-DD для фильтров API. */
export function toDateValue(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
}

/** Культурный сезон начинается в сентябре: ноябрь 2026 → «2026 / 2027». */
export function seasonLabel(value: string | Date = new Date(), separator = ' / '): string {
  const local = new Date(cityWallClock(new Date(value)))
  const start = local.getUTCMonth() >= 8 ? local.getUTCFullYear() : local.getUTCFullYear() - 1
  return `${start}${separator}${start + 1}`
}

const pluralRules = new Intl.PluralRules('ru-RU')

/** Склонение по числу: pluralize(2, ['событие', 'события', 'событий']) → «события». */
export function pluralize(count: number, [one, few, many]: [string, string, string]): string {
  const rule = pluralRules.select(count)
  return rule === 'one' ? one : rule === 'few' ? few : many
}

export const eventWord = (count: number) => pluralize(count, ['событие', 'события', 'событий'])

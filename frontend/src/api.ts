import type { EventItem, EventPayload } from './types/event'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { detail?: string | { msg: string }[] } | null
    const detail = Array.isArray(body?.detail) ? body.detail.map((item) => item.msg).join(', ') : body?.detail
    throw new Error(detail || `Ошибка запроса (${response.status})`)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export function getEvents(params: { q?: string; category?: string; date_from?: string; date_to?: string } = {}) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) if (value) query.set(key, value)
  return request<EventItem[]>(`/api/events${query.size ? `?${query}` : ''}`)
}

export function getEvent(id: number) {
  return request<EventItem>(`/api/events/${id}`)
}

export function createEvent(payload: EventPayload) {
  return request<EventItem>('/api/events', { method: 'POST', body: JSON.stringify(payload) })
}

export function updateEvent(id: number, payload: EventPayload) {
  return request<EventItem>(`/api/events/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export function deleteEvent(id: number) {
  return request<void>(`/api/events/${id}`, { method: 'DELETE' })
}

import type { EventItem, EventPayload } from './types/event';
export declare function getEvents(params?: {
    q?: string;
    category?: string;
    date_from?: string;
    date_to?: string;
}): Promise<EventItem[]>;
export declare function getEvent(id: number): Promise<EventItem>;
export declare function createEvent(payload: EventPayload): Promise<EventItem>;
export declare function updateEvent(id: number, payload: EventPayload): Promise<EventItem>;
export declare function deleteEvent(id: number): Promise<void>;

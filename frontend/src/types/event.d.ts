export interface EventItem {
    id: number;
    title: string;
    category: string;
    description: string;
    venue: string;
    address: string;
    starts_at: string;
    price: number;
    image_url: string;
    age_limit: string;
    created_at: string;
    updated_at: string;
}
export type EventPayload = Omit<EventItem, 'id' | 'created_at' | 'updated_at'>;
export declare const categories: string[];
export declare function formatEventDate(value: string): string;
export declare function formatShortDate(value: string): string;

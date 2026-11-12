export var categories = ['Театр', 'Концерт', 'Кино', 'Выставка', 'Детям', 'Мастер-класс'];
export function formatEventDate(value) {
    return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}
export function formatShortDate(value) {
    return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'short' }).format(new Date(value)).replace('.', '');
}

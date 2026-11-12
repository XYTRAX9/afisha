import type { EventItem } from '../types/event';
type __VLS_Props = {
    event: EventItem;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    select: (event: EventItem) => any;
    edit: (event: EventItem) => any;
    remove: (event: EventItem) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSelect?: (event: EventItem) => any;
    onEdit?: (event: EventItem) => any;
    onRemove?: (event: EventItem) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

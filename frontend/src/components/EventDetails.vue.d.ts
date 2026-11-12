import type { EventItem } from '../types/event';
type __VLS_Props = {
    event: EventItem | null;
    busy?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    edit: (event: EventItem) => any;
    remove: (event: EventItem) => any;
    close: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onEdit?: (event: EventItem) => any;
    onRemove?: (event: EventItem) => any;
    onClose?: () => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

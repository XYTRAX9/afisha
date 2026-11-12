import type { EventItem, EventPayload } from '../types/event';
type __VLS_Props = {
    open: boolean;
    event?: EventItem | null;
    busy?: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: () => any;
    save: (payload: EventPayload) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onClose?: () => any;
    onSave?: (payload: EventPayload) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;

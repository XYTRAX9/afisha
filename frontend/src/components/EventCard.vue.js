/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { formatEventDate } from '../types/event';
var __VLS_props = defineProps();
var __VLS_emit = defineEmits();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)(__assign({ class: "event-card" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$emit('select', __VLS_ctx.event);
    } }, { class: "poster-button" }), { type: "button", 'aria-label': ("\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435: ".concat(__VLS_ctx.event.title)) }));
if (__VLS_ctx.event.image_url) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img, __VLS_intrinsicElements.img)(__assign({ class: "poster" }, { src: (__VLS_ctx.event.image_url), alt: (__VLS_ctx.event.title), loading: "lazy" }));
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "poster poster-placeholder" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "poster-category" }));
(__VLS_ctx.event.category);
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "age-tag" }));
(__VLS_ctx.event.age_limit);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "event-content" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "event-date" }));
(__VLS_ctx.formatEventDate(__VLS_ctx.event.starts_at));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$emit('select', __VLS_ctx.event);
    } }, { class: "event-title" }), { type: "button" }));
(__VLS_ctx.event.title);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "event-venue" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    'aria-hidden': "true",
});
(__VLS_ctx.event.venue);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "card-bottom" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "price-label" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
(__VLS_ctx.event.price ? "\u043E\u0442 ".concat(__VLS_ctx.event.price.toLocaleString('ru-RU'), " \u20BD") : 'Бесплатно');
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "card-actions" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$emit('edit', __VLS_ctx.event);
    } }, { class: "mini-action" }), { type: "button", 'aria-label': ("\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C: ".concat(__VLS_ctx.event.title)) }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.$emit('remove', __VLS_ctx.event);
    } }, { class: "mini-action remove-action" }), { type: "button", 'aria-label': ("\u0423\u0434\u0430\u043B\u0438\u0442\u044C: ".concat(__VLS_ctx.event.title)) }));
/** @type {__VLS_StyleScopedClasses['event-card']} */ ;
/** @type {__VLS_StyleScopedClasses['poster-button']} */ ;
/** @type {__VLS_StyleScopedClasses['poster']} */ ;
/** @type {__VLS_StyleScopedClasses['poster']} */ ;
/** @type {__VLS_StyleScopedClasses['poster-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['poster-category']} */ ;
/** @type {__VLS_StyleScopedClasses['age-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['event-content']} */ ;
/** @type {__VLS_StyleScopedClasses['event-date']} */ ;
/** @type {__VLS_StyleScopedClasses['event-title']} */ ;
/** @type {__VLS_StyleScopedClasses['event-venue']} */ ;
/** @type {__VLS_StyleScopedClasses['card-bottom']} */ ;
/** @type {__VLS_StyleScopedClasses['price-label']} */ ;
/** @type {__VLS_StyleScopedClasses['card-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-action']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-action']} */ ;
/** @type {__VLS_StyleScopedClasses['remove-action']} */ ;
var __VLS_dollars;
var __VLS_self = (await import('vue')).defineComponent({
    setup: function () {
        return {
            formatEventDate: formatEventDate,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup: function () {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */

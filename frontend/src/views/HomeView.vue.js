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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EventCard from '../components/EventCard.vue';
import EventDialog from '../components/EventDialog.vue';
import { createEvent, deleteEvent, getEvents, updateEvent } from '../api';
import { categories } from '../types/event';
var route = useRoute();
var router = useRouter();
var events = ref([]);
var loading = ref(true);
var saving = ref(false);
var error = ref('');
var query = ref('');
var category = ref('Все события');
var fromDate = ref('');
var toDate = ref('');
var dialogOpen = ref(false);
var editing = ref(null);
var activeDate = ref('Все даты');
var featured = computed(function () { return events.value.slice(0, 3); });
var venues = computed(function () { return __spreadArray([], new Set(events.value.map(function (event) { return event.venue; })), true).slice(0, 4); });
function loadEvents() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, cause_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    loading.value = true;
                    error.value = '';
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    _a = events;
                    return [4 /*yield*/, getEvents({ q: query.value, category: category.value, date_from: fromDate.value, date_to: toDate.value })];
                case 2:
                    _a.value = _b.sent();
                    return [3 /*break*/, 5];
                case 3:
                    cause_1 = _b.sent();
                    error.value = cause_1 instanceof Error ? cause_1.message : 'Не удалось загрузить события';
                    return [3 /*break*/, 5];
                case 4:
                    loading.value = false;
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
watch([query, category, fromDate, toDate], function () { void loadEvents(); });
watch(function () { return route.query.category; }, function (value) { category.value = typeof value === 'string' ? value : 'Все события'; }, { immediate: true });
onMounted(loadEvents);
function applyPreset(preset) {
    activeDate.value = preset;
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (preset === 'Сегодня') {
        fromDate.value = today.toISOString().slice(0, 10);
        toDate.value = fromDate.value;
    }
    else if (preset === 'Завтра') {
        var day = new Date(today);
        day.setDate(day.getDate() + 1);
        fromDate.value = day.toISOString().slice(0, 10);
        toDate.value = fromDate.value;
    }
    else if (preset === 'Все даты') {
        fromDate.value = '';
        toDate.value = '';
    }
}
function openCreate() { editing.value = null; dialogOpen.value = true; }
function openEdit(event) { editing.value = event; dialogOpen.value = true; }
function saveEvent(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var cause_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    saving.value = true;
                    error.value = '';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, 8, 9]);
                    if (!editing.value) return [3 /*break*/, 3];
                    return [4 /*yield*/, updateEvent(editing.value.id, payload)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, createEvent(payload)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    dialogOpen.value = false;
                    return [4 /*yield*/, loadEvents()];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 7:
                    cause_2 = _a.sent();
                    error.value = cause_2 instanceof Error ? cause_2.message : 'Не удалось сохранить событие';
                    return [3 /*break*/, 9];
                case 8:
                    saving.value = false;
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function removeEvent(event) {
    return __awaiter(this, void 0, void 0, function () {
        var cause_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!window.confirm("\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0441\u043E\u0431\u044B\u0442\u0438\u0435 \u00AB".concat(event.title, "\u00BB?")))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, deleteEvent(event.id)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loadEvents()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    cause_3 = _a.sent();
                    error.value = cause_3 instanceof Error ? cause_3.message : 'Не удалось удалить событие';
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function choose(event) { void router.push({ name: 'event', params: { id: event.id } }); }
function resetFilters() { query.value = ''; category.value = 'Все события'; fromDate.value = ''; toDate.value = ''; activeDate.value = 'Все даты'; void router.replace({ query: {} }); }
function scrollToEvents() { var _a; (_a = document.getElementById('events')) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' }); }
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "page-frame home-view" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)(__assign({ class: "hero-panel" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "hero-copy" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "eyebrow" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "search-form" }, { role: "search" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "search-mark" }, { 'aria-hidden': "true" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    id: "event-search",
    type: "search",
    placeholder: "Спектакль, концерт, фильм, площадка…",
    'aria-label': "Поиск событий",
});
(__VLS_ctx.query);
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "search-date" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "date",
    'aria-label': "Дата события",
});
(__VLS_ctx.fromDate);
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    value: (__VLS_ctx.category),
    'aria-label': "Категория",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({});
for (var _i = 0, _a = __VLS_getVForSourceType((__VLS_ctx.categories)); _i < _a.length; _i++) {
    var item = _a[_i][0];
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        key: (item),
    });
    (item);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.loadEvents) }, { class: "button primary-button search-button" }), { type: "button" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "hero-notes" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "available-note" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
(__VLS_ctx.events.length);
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)(__assign({ id: "categories" }, { class: "category-section" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "section-kicker-row" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "eyebrow" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "chip-row" }));
var _loop_1 = function (item) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.category = item;
        } }, { key: (item) }), { class: "category-chip" }), { class: ({ selected: __VLS_ctx.category === item }) }), { type: "button" }));
    (item);
};
for (var _b = 0, _c = __VLS_getVForSourceType((__spreadArray(['Все события'], __VLS_ctx.categories, true))); _b < _c.length; _b++) {
    var item = _c[_b][0];
    _loop_1(item);
}
if (__VLS_ctx.featured.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)(__assign({ class: "editorial-section" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "section-heading" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "eyebrow" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.scrollToEvents) }, { class: "text-link" }), { type: "button" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "editorial-grid" }));
    var _loop_2 = function (event_1, index) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign({ onClick: function () {
                var _a = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _a[_i] = arguments[_i];
                }
                var $event = _a[0];
                if (!(__VLS_ctx.featured.length))
                    return;
                __VLS_ctx.choose(event_1);
            } }, { key: (event_1.id) }), { class: "editorial-card" }), { type: "button" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.img, __VLS_intrinsicElements.img)({
            src: (event_1.image_url),
            alt: (event_1.title),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "editorial-shade" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "editorial-label" }));
        (index === 0 ? 'СЕГОДНЯ · ВЫБОР РЕДАКЦИИ' : index === 1 ? 'БЛИЖАЙШИЕ ДНИ' : 'СЕМЕЙНЫЙ ВЫХОД');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "editorial-title" }));
        (index === 0 ? 'Сегодня в Сургуте' : index === 1 ? 'Планы на выходные' : 'Куда сходить в городе');
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "editorial-caption" }));
        (event_1.title);
    };
    for (var _d = 0, _e = __VLS_getVForSourceType((__VLS_ctx.featured)); _d < _e.length; _d++) {
        var _f = _e[_d], event_1 = _f[0], index = _f[1];
        _loop_2(event_1, index);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)(__assign({ id: "calendar" }, { class: "events-section" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "section-heading events-heading" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "eyebrow" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.openCreate) }, { class: "button secondary-button add-event" }), { type: "button" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "event-tools" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "date-chips" }));
var _loop_3 = function (preset) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.applyPreset(preset);
        } }, { key: (preset) }), { class: "date-chip" }), { class: ({ active: __VLS_ctx.activeDate === preset }) }), { type: "button" }));
    (preset);
};
for (var _g = 0, _h = __VLS_getVForSourceType((['Все даты', 'Сегодня', 'Завтра', 'На выходных', 'Ближайший месяц'])); _g < _h.length; _g++) {
    var preset = _h[_g][0];
    _loop_3(preset);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)(__assign({ class: "sort-select" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({});
if (__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "notice error-notice" }, { role: "alert" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.error);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.loadEvents) }, { type: "button" }));
}
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "loading-state" }, { role: "status" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "spinner" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
else if (__VLS_ctx.events.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "event-grid" }));
    for (var _j = 0, _k = __VLS_getVForSourceType((__VLS_ctx.events)); _j < _k.length; _j++) {
        var event_2 = _k[_j][0];
        /** @type {[typeof EventCard, ]} */ ;
        // @ts-ignore
        var __VLS_0 = __VLS_asFunctionalComponent(EventCard, new EventCard(__assign(__assign(__assign({ 'onSelect': {} }, { 'onEdit': {} }), { 'onRemove': {} }), { key: (event_2.id), event: (event_2) })));
        var __VLS_1 = __VLS_0.apply(void 0, __spreadArray([__assign(__assign(__assign({ 'onSelect': {} }, { 'onEdit': {} }), { 'onRemove': {} }), { key: (event_2.id), event: (event_2) })], __VLS_functionalComponentArgsRest(__VLS_0), false));
        var __VLS_3 = void 0;
        var __VLS_4 = void 0;
        var __VLS_5 = void 0;
        var __VLS_6 = {
            onSelect: (__VLS_ctx.choose)
        };
        var __VLS_7 = {
            onEdit: (__VLS_ctx.openEdit)
        };
        var __VLS_8 = {
            onRemove: (__VLS_ctx.removeEvent)
        };
        var __VLS_2;
    }
}
else if (!__VLS_ctx.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "empty-state" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "empty-mark" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign(__assign({ onClick: (__VLS_ctx.resetFilters) }, { class: "button secondary-button" }), { type: "button" }));
}
if (__VLS_ctx.events.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "results-meta" }));
    (__VLS_ctx.events.length);
    (__VLS_ctx.events.length === 1 ? 'событие' : 'событий');
}
if (__VLS_ctx.venues.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)(__assign({ id: "venues" }, { class: "venues-section" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "section-heading" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "eyebrow" }));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "venue-grid" }));
    var _loop_4 = function (venue, index) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.article, __VLS_intrinsicElements.article)(__assign({ key: (venue) }, { class: "venue-card" }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "venue-image" }, { class: ("venue-image-".concat(index + 1)) }));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (['♫', '▤', '⌂', '✳'][index]);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
        (venue);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)(__assign({ class: "venue-count" }));
        (__VLS_ctx.events.filter(function (event) { return event.venue === venue; }).length);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.b, __VLS_intrinsicElements.b)({});
    };
    for (var _l = 0, _m = __VLS_getVForSourceType((__VLS_ctx.venues)); _l < _m.length; _l++) {
        var _o = _m[_l], venue = _o[0], index = _o[1];
        _loop_4(venue, index);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.section, __VLS_intrinsicElements.section)(__assign({ class: "newsletter" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)(__assign({ class: "eyebrow" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "newsletter-form" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({
    type: "email",
    placeholder: "Ваш e-mail адрес",
    'aria-label': "Ваш e-mail адрес",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ class: "button primary-button" }, { type: "button", disabled: true, title: "Подписка появится в следующих версиях" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.small, __VLS_intrinsicElements.small)({});
/** @type {[typeof EventDialog, ]} */ ;
// @ts-ignore
var __VLS_9 = __VLS_asFunctionalComponent(EventDialog, new EventDialog(__assign(__assign({ 'onClose': {} }, { 'onSave': {} }), { open: (__VLS_ctx.dialogOpen), event: (__VLS_ctx.editing), busy: (__VLS_ctx.saving) })));
var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([__assign(__assign({ 'onClose': {} }, { 'onSave': {} }), { open: (__VLS_ctx.dialogOpen), event: (__VLS_ctx.editing), busy: (__VLS_ctx.saving) })], __VLS_functionalComponentArgsRest(__VLS_9), false));
var __VLS_12;
var __VLS_13;
var __VLS_14;
var __VLS_15 = {
    onClose: function () {
        var _a = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _a[_i] = arguments[_i];
        }
        var $event = _a[0];
        __VLS_ctx.dialogOpen = false;
    }
};
var __VLS_16 = {
    onSave: (__VLS_ctx.saveEvent)
};
var __VLS_11;
/** @type {__VLS_StyleScopedClasses['page-frame']} */ ;
/** @type {__VLS_StyleScopedClasses['home-view']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-copy']} */ ;
/** @type {__VLS_StyleScopedClasses['eyebrow']} */ ;
/** @type {__VLS_StyleScopedClasses['search-form']} */ ;
/** @type {__VLS_StyleScopedClasses['search-mark']} */ ;
/** @type {__VLS_StyleScopedClasses['search-date']} */ ;
/** @type {__VLS_StyleScopedClasses['button']} */ ;
/** @type {__VLS_StyleScopedClasses['primary-button']} */ ;
/** @type {__VLS_StyleScopedClasses['search-button']} */ ;
/** @type {__VLS_StyleScopedClasses['hero-notes']} */ ;
/** @type {__VLS_StyleScopedClasses['available-note']} */ ;
/** @type {__VLS_StyleScopedClasses['category-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-kicker-row']} */ ;
/** @type {__VLS_StyleScopedClasses['eyebrow']} */ ;
/** @type {__VLS_StyleScopedClasses['chip-row']} */ ;
/** @type {__VLS_StyleScopedClasses['category-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['editorial-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['eyebrow']} */ ;
/** @type {__VLS_StyleScopedClasses['text-link']} */ ;
/** @type {__VLS_StyleScopedClasses['editorial-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['editorial-card']} */ ;
/** @type {__VLS_StyleScopedClasses['editorial-shade']} */ ;
/** @type {__VLS_StyleScopedClasses['editorial-label']} */ ;
/** @type {__VLS_StyleScopedClasses['editorial-title']} */ ;
/** @type {__VLS_StyleScopedClasses['editorial-caption']} */ ;
/** @type {__VLS_StyleScopedClasses['events-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['events-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['eyebrow']} */ ;
/** @type {__VLS_StyleScopedClasses['button']} */ ;
/** @type {__VLS_StyleScopedClasses['secondary-button']} */ ;
/** @type {__VLS_StyleScopedClasses['add-event']} */ ;
/** @type {__VLS_StyleScopedClasses['event-tools']} */ ;
/** @type {__VLS_StyleScopedClasses['date-chips']} */ ;
/** @type {__VLS_StyleScopedClasses['date-chip']} */ ;
/** @type {__VLS_StyleScopedClasses['sort-select']} */ ;
/** @type {__VLS_StyleScopedClasses['notice']} */ ;
/** @type {__VLS_StyleScopedClasses['error-notice']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-state']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['event-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-mark']} */ ;
/** @type {__VLS_StyleScopedClasses['button']} */ ;
/** @type {__VLS_StyleScopedClasses['secondary-button']} */ ;
/** @type {__VLS_StyleScopedClasses['results-meta']} */ ;
/** @type {__VLS_StyleScopedClasses['venues-section']} */ ;
/** @type {__VLS_StyleScopedClasses['section-heading']} */ ;
/** @type {__VLS_StyleScopedClasses['eyebrow']} */ ;
/** @type {__VLS_StyleScopedClasses['venue-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['venue-card']} */ ;
/** @type {__VLS_StyleScopedClasses['venue-image']} */ ;
/** @type {__VLS_StyleScopedClasses['venue-count']} */ ;
/** @type {__VLS_StyleScopedClasses['newsletter']} */ ;
/** @type {__VLS_StyleScopedClasses['eyebrow']} */ ;
/** @type {__VLS_StyleScopedClasses['newsletter-form']} */ ;
/** @type {__VLS_StyleScopedClasses['button']} */ ;
/** @type {__VLS_StyleScopedClasses['primary-button']} */ ;
var __VLS_dollars;
var __VLS_self = (await import('vue')).defineComponent({
    setup: function () {
        return {
            EventCard: EventCard,
            EventDialog: EventDialog,
            categories: categories,
            events: events,
            loading: loading,
            saving: saving,
            error: error,
            query: query,
            category: category,
            fromDate: fromDate,
            dialogOpen: dialogOpen,
            editing: editing,
            activeDate: activeDate,
            featured: featured,
            venues: venues,
            loadEvents: loadEvents,
            applyPreset: applyPreset,
            openCreate: openCreate,
            openEdit: openEdit,
            saveEvent: saveEvent,
            removeEvent: removeEvent,
            choose: choose,
            resetFilters: resetFilters,
            scrollToEvents: scrollToEvents,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup: function () {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */

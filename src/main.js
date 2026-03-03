import './fonts/ys-display/fonts.css';
import './style.css';

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js"; // <- поиск

// Подготовка данных и индексов
const { data, ...indexes } = initData(sourceData);

/**
 * Сбор состояния таблицы
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));

    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);

    return {
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка таблицы при любых изменениях
 */
function render(action) {
    let state = collectState();
    let result = [...data];

    // 0. Поиск
    result = applySearching(result, state, action);

    // 1. Фильтрация
    result = applyFiltering(result, state, action);

    // 2. Сортировка
    result = applySorting(result, state, action);

    // 3. Пагинация
    result = applyPagination(result, state, action);

    // 4. Отображение
    sampleTable.render(result);
}

// Инициализация таблицы
const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'], // search перед header и фильтром
    after: ['pagination']                   // пагинация
}, render);

// Инициализация поиска
const applySearching = initSearching('search'); // имя поля для поиска

// Инициализация фильтрации
const applyFiltering = initFiltering(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers
});

// Инициализация сортировки
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

// Инициализация пагинации
const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

// Подключение таблицы к DOM
const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

// Первый рендер
render();








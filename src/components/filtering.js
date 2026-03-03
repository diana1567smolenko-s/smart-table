import { createComparison, defaultRules } from "../lib/compare.js";

/**
 * Инициализация фильтров
 */
export function initFiltering(elements, indexes) {
    // Заполняем select опциями
    Object.keys(indexes).forEach(elementName => {
        const selectElement = elements[elementName];
        if (!selectElement) return;

        selectElement.append(
            ...Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            })
        );
    });

    return (data, state, action) => {
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            const input = action.closest('label')?.querySelector('input, select');
            if (input) input.value = '';
            if (field in state) state[field] = '';
        }

        const compare = createComparison(defaultRules);
        return data.filter(row => compare(row, state));
    };
}




























/* import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data;
    }
} */
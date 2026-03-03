import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
    // 5.1 — создаём компаратор для поиска
    const compare = createComparison([
        rules.skipEmptyTargetValues,                                     // игнорируем пустые значения
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false) // ищем по этим полям
    ]);

    return (data, state, action) => {
        // 5.2 — применяем компаратор и фильтруем данные
        if (!state[searchField]) return data;
        return data.filter(row => compare(row, state));
    };
}




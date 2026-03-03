import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализация таблицы и обработка событий
 */
export function initTable(settings, onAction) {
    const { tableTemplate, rowTemplate, before = [], after = [] } = settings;
    const root = cloneTemplate(tableTemplate);

    // Подключаем шаблоны before (search, header, filter)
    before.slice().reverse().forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.prepend(root[subName].container);
    });

    // Подключаем шаблоны after (pagination)
    after.forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.append(root[subName].container);
    });

    // Обработка событий
    root.container.addEventListener('click', e => {
        const btn = e.target.closest('button');
        if (btn) onAction(btn);
    });

    root.container.addEventListener('change', () => onAction());
    root.container.addEventListener('reset', () => setTimeout(() => onAction(), 0));
    root.container.addEventListener('submit', e => {
        e.preventDefault();
        onAction(e.submitter);
    });

    // Функция рендера таблицы
    const render = (data) => {
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            Object.keys(item).forEach(key => {
                if (row.elements[key]) row.elements[key].textContent = item[key];
            });
            return row.container;
        });
        root.elements.rows.replaceChildren(...nextRows);
    };

    return { ...root, render };
}




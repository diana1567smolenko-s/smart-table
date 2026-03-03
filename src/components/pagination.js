import { getPages } from "../lib/utils.js";

/**
 * Инициализация пагинации
 */
export const initPagination = ({ pages, fromRow, toRow, totalRows }, createPage) => {
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.replaceChildren();

    return (data, state, action) => {
        const rowsPerPage = state.rowsPerPage;
        const pageCount = Math.ceil(data.length / rowsPerPage);
        let page = state.page;

        if (action) switch(action.name) {
            case 'prev':  page = Math.max(1, page - 1); break;
            case 'next':  page = Math.min(pageCount, page + 1); break;
            case 'first': page = 1; break;
            case 'last':  page = pageCount; break;
        }

        const skip = (page - 1) * rowsPerPage;
        const pagedData = data.slice(skip, skip + rowsPerPage);

        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(
            ...visiblePages.map(pageNumber => {
                const el = pageTemplate.cloneNode(true);
                return createPage(el, pageNumber, pageNumber === page);
            })
        );

        fromRow.textContent = pagedData.length ? skip + 1 : 0;
        toRow.textContent = Math.min(page * rowsPerPage, data.length);
        totalRows.textContent = data.length;

        return pagedData;
    };
};









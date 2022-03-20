export function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId);
  if (!pagination || !ulPagination) return;

  // calc total Pages;
  const { _page, _limit, _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);
  // save page and total page to ulPagination
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = totalPages;
  // enable / disable
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled');
  else ulPagination.firstElementChild?.classList.remove('disabled');

  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled');
  else ulPagination.lastElementChild?.classList.remove('disabled');
}

export function initPagination({ elementId, defaultParams, onChange }) {
  // bind click prev and next link
  const ulPagination = document.getElementById(elementId);
  if (!ulPagination) return;

  const prev = ulPagination.firstElementChild?.firstElementChild;
  if (prev) {
    prev.addEventListener('click', (e) => {
      e.preventDefault();
      const page = Number.parseInt(ulPagination.dataset.page) || 1;
      if (page > 1) onChange?.(page - 1);
    });
  }

  const next = ulPagination.lastElementChild?.lastElementChild;
  if (next) {
    next.addEventListener('click', (e) => {
      e.preventDefault();
      const page = Number.parseInt(ulPagination.dataset.page) || 1;
      const totalPages = Number.parseInt(ulPagination.dataset.totalPages);
      if (page < totalPages) onChange?.(page + 1);
    });
  }
}

import postApi from './api/postApi';
import { initPagination, renderPagination, renderPostList, initSearch } from './utils';

async function handleFilterChange(filterName, filterValue) {
  try {
    // update url
    const url = new URL(window.location);
    url.searchParams.set(filterName, filterValue);

    if (filterName === 'title_like') url.searchParams.set('_page', 1);
    history.pushState({}, '', url);

    // fetch api
    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList(data);
    renderPagination('postsPagination', pagination);
  } catch (error) {
    console.log('failed to get all api', error);
  }
}

// main
(async () => {
  try {
    const url = new URL(window.location);

    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

    history.pushState({}, '', url);
    const queryParams = url.searchParams;

    initPagination({
      elementId: 'postsPagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    });

    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    });

    // fetch api
    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList('postList', data);
    renderPagination('postsPagination', pagination);
  } catch (error) {
    console.log('getAll failed', error);
  }
})();

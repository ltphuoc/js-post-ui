import postApi from './api/postApi';
import { initPagination, renderPagination, renderPostList, initSearch, toast } from './utils';

async function handleFilterChange(filterName, filterValue) {
  try {
    // update url
    const url = new URL(window.location);

    if (filterName) url.searchParams.set(filterName, filterValue);

    // reset pages
    if (filterName === 'title_like') url.searchParams.set('_page', 1);
    history.pushState({}, '', url);

    // fetch api
    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList('postList', data);
    renderPagination('postsPagination', pagination);
  } catch (error) {
    console.log('failed to get all api', error);
  }
}

function registerPostDeleteEvent() {
  document.addEventListener('post-delete', async (event) => {
    try {
      const post = event.detail;
      const message = `Are you sure to remove post "${post.title}"`;
      if (window.confirm(message)) {
        await postApi.remove(post.id);
        await handleFilterChange();

        toast.success('Remove post successfully');
      }
    } catch (error) {
      console.log('failed to remove post', error);
      toast.error(error.message);
    }
    // call API remove
    // refetch data
  });
}

// main
(async () => {
  try {
    const url = new URL(window.location);

    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

    history.pushState({}, '', url);
    const queryParams = url.searchParams;

    registerPostDeleteEvent();

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
    // const { data, pagination } = await postApi.getAll(queryParams);
    // renderPostList('postList', data);
    // renderPagination('postsPagination', pagination);
    handleFilterChange();
  } catch (error) {
    console.log('getAll failed', error);
  }
})();

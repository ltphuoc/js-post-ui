import postApi from './api/postApi';
import { setTextContent, setSrcImg, truncateText, getUlPagination } from './utils/index';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import debounce from 'lodash.debounce';

// to use fromNow()
dayjs.extend(relativeTime);

function createPostElement(post) {
  if (!post) return;

  // find template
  const postTemplate = document.getElementById('postItemTemplate');
  if (!postTemplate) return;

  const liElement = postTemplate.content.firstElementChild.cloneNode(true);
  if (!liElement) return;

  // v1
  // update title, description, author, thumbnail
  // const titleElement = liElement.querySelector('[data-id="title"]');
  // if (titleElement) titleElement.textContent = post.title;
  // const descriptionElement = liElement.querySelector('[data-id="description"]');
  // if (descriptionElement) descriptionElement.textContent = post.description;
  // const authorElement = liElement.querySelector('[data-id="author"]');
  // if (authorElement) authorElement.textContent = post.author;
  // const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
  // if (thumbnailElement) thumbnailElement.src = post.imageUrl;

  // v2 using util
  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 120));
  setTextContent(liElement, '[data-id="author"]', post.author);
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`);

  setSrcImg(liElement, '[data-id="thumbnail"]', post.imageUrl);

  // attach event (if any)

  return liElement;
}
function renderPostList(postList) {
  // console.log({ postList });
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById('postList');
  if (!ulElement) return;

  // clear current list
  ulElement.textContent = '';

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}

function renderPagination(pagination) {
  const ulPagination = getUlPagination();
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
    renderPagination(pagination);
  } catch (error) {
    console.log('failed to get all api', error);
  }
}

function handlePrevClick(e) {
  e.preventDefault();
  const ulPagination = getUlPagination();
  if (!ulPagination) return;

  const page = Number.parseInt(ulPagination.dataset.page) || 1;
  if (page <= 1) return;

  handleFilterChange('_page', page - 1);
}

function handleNextClick(e) {
  e.preventDefault();
  const ulPagination = getUlPagination();
  if (!ulPagination) return;

  const page = Number.parseInt(ulPagination.dataset.page) || 1;
  const totalPages = ulPagination.dataset.totalPages;
  if (page >= totalPages) return;

  handleFilterChange('_page', page + 1);
}

function initPagination() {
  // bind click prev and next link
  const ulPagination = getUlPagination();
  if (!ulPagination) return;

  const prev = ulPagination.firstElementChild?.firstElementChild;
  if (prev) {
    prev.addEventListener('click', handlePrevClick);
  }

  const next = ulPagination.lastElementChild?.lastElementChild;
  if (next) {
    next.addEventListener('click', handleNextClick);
  }
}

function initURL() {
  const url = new URL(window.location);

  if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
  if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);
  history.pushState({}, '', url);
}

function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  // set default value from query param
  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.get('title_like')) searchInput.value = queryParams.get('title_like');
  // title_like
  const debounceSearch = debounce((e) => handleFilterChange('title_like', e.target.value), 500);
  searchInput.addEventListener('input', debounceSearch);
}

(async () => {
  try {
    initPagination();
    initSearch();

    initURL();

    const queryParams = new URLSearchParams(window.location.search);
    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('getAll failed', error);
    // show modal
  }
})();

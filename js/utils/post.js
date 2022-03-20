import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { setSrcImg, setTextContent, truncateText } from './common';

// to use fromNow()
dayjs.extend(relativeTime);

export function createPostElement(post) {
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
export function renderPostList(elementId, postList) {
  // console.log({ postList });
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById(elementId);
  if (!ulElement) return;

  // clear current list
  ulElement.textContent = '';

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}

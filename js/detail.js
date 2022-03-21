import dayjs from 'dayjs';
import postApi from './api/postApi';
import { registerLightbox, setHeroImage, setTextContent } from './utils';

function renderPostDetail(post) {
  if (!post) return;

  // author, updatedAt, description, title
  setTextContent(document, '#postDetailTitle', post.title);
  setTextContent(document, '#postDetailDescription', post.description);
  setTextContent(document, '#postDetailAuthor', post.author);
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updatedAt).format('- DD / MM / YYYY HH:mm')
  );

  // render hero image
  setHeroImage(document, '#postHeroImage', post.imageUrl);

  // render edit page link
  const editPageLink = document.getElementById('goToEditPageLink');
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`;
    editPageLink.textContent = 'Edit post';
  }

}

(async () => {
  try {
    registerLightbox({
      modalId: 'lightbox',
      imageSelector: 'img[data-id="lightboxImg"]',
      prevSelector: 'button[data-id="lightboxPrev"]',
      nextSelector: 'button[data-id="lightboxNext"]',
    });

    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');

    if (!postId) return;

    const post = await postApi.getById(postId);
    renderPostDetail(post);
  } catch (error) {
    console.log('failed get api', error);
  }
})();

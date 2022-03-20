function showModal(modalElement) {
  // make sure bootstrap loaded
  if (!window.bootstrap) return;
  const modal = new window.bootstrap.Modal(modalElement);
  if (modal) modal.show();
}

export function registerLightbox({ modalId, imageSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) return;

  // check modal register or not
  if (Boolean(modalElement.dataset.registered)) return;

  // selector
  const imageElement = modalElement.querySelector(imageSelector);
  const prevButton = modalElement.querySelector(prevSelector);
  const nextButton = modalElement.querySelector(nextSelector);
  if (!imageElement || !prevButton || !nextButton) return;

  // lightbox vars
  let imgList = [];
  let currentIndex = 0;

  function showImageAtIndex(index) {
    imageElement.src = imgList[index].src;
  }
  // add click for all img
  document.addEventListener('click', (event) => {
    const { target } = event;
    if (target.tagName !== 'IMG' || !target.dataset.album) return;

    imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`);
    currentIndex = [...imgList].findIndex((x) => x === target);
    // show image at index
    showImageAtIndex(currentIndex);
    // show modal
    showModal(modalElement);
  });

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
    showImageAtIndex(currentIndex);
  });

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % imgList.length;
    showImageAtIndex(currentIndex);
  });

  // mark this modal is already register
  modalElement.dataset.registered = 'true';
}

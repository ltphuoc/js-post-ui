export function setTextContent(parent, selector, text) {
  if (!parent) return;

  const element = parent.querySelector(selector);
  if (element) element.textContent = text;
}

export function setSrcImg(parent, selector, url) {
  if (!parent) return;

  const element = parent.querySelector(selector);
  if (element) {
    element.src = url;
    element.addEventListener('error', () => {
      element.src = 'https://via.placeholder.com/1368x400?text=Loading';
    });
  }
}

export function setHeroImage(parent, selector, url) {
  if (!parent) return;

  const element = parent.querySelector(selector);
  if (element) {
    element.style.backgroundImage = `url('${url}')`;
    element.addEventListener('error', () => {
      element.src = 'https://via.placeholder.com/1368x400?text=Loading';
    });
  }
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength - 1)}…`;
}

export function setFieldValue(form, selector, value) {
  if (!form) return;

  const element = form.querySelector(selector);
  if (element) element.value = value;
}

export function randomNumber(n) {
  if (n <= 0) return -1;

  const random = Math.random() * n;
  return Math.round(random);
}

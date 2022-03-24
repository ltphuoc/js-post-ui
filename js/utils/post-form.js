import { randomNumber, setFieldValue, setHeroImage, setTextContent } from './common';
import * as yup from 'yup';

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
};

function setFormValue(form, formValue) {
  setFieldValue(form, '[name=title]', formValue?.title);
  setFieldValue(form, '[name=author]', formValue?.author);
  setFieldValue(form, '[name=description]', formValue?.description);

  setHeroImage(document, '#postHeroImage', formValue?.imageUrl);
  // set hidden imageUrl
  setFieldValue(form, '[name=imageUrl]', formValue?.imageUrl);
}

function getFormValues(form) {
  const formValues = {};

  // v1
  // ['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //   const field = form.querySelector(`[name=${name}]`);
  //   if (field) values[name] = field.value;
  // });

  // v2
  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }

  return formValues;
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at-least-two-words',
        'PLease enter at least two words',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageSource: yup
      .string()
      .required('Please select image')
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'Invalid image'),
    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: yup.string().required('Please random a image').url('Please enter valid url'),
    }),
    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'Please select image to upload', (file) => Boolean(file?.name))
        .test('max-3mb', 'The image is too large (max 3mb)', (file) => {
          const fileSize = file?.size || 0;
          const max3mb = 3 * 1024 * 1024; // max 3mb
          return fileSize < max3mb;
        }),
    }),
  });
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    setTextContent(element.parentElement, '.invalid-feedback', error);
  }
}

async function validateForm(form, formValues) {
  try {
    // reset prev error
    ['title', 'author', 'imageUrl', 'image'].forEach((name) => setFieldError(form, name, ''));

    const schema = getPostSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    const errorLog = {};

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path;

        // ignore if the field is already log
        if (errorLog[name]) continue;

        // set field error and mark are log
        setFieldError(form, name, validationError.message);
        errorLog[name] = true;
      }
    }
  }

  // add was-validated class to form element
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');

  return isValid;
}

function showLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = true;
    button.textContent = 'Saving...';
  }
}
function hideLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = false;
    button.innerHTML = '<i class="fas fa-save mr-1"></i> Save';
  }
}

function initRandomImage(form) {
  const randomButton = document.getElementById('postChangeImage');

  if (!randomButton) return;

  randomButton.addEventListener('click', () => {
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`;
    // set HeroImage
    setHeroImage(document, '#postHeroImage', imageUrl);
    setFieldValue(form, '[name=imageUrl]', imageUrl);
  });
}

function renderImageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]');

  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue;
  });
}

function initRadioImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]');

  radioList.forEach((radio) => {
    radio.addEventListener('change', (event) => renderImageSourceControl(form, event.target.value));
  });
}

function initUploadImage(form) {
  const uploadImage = form.querySelector('[name=image]');
  if (!uploadImage) return;

  uploadImage.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setHeroImage(document, '#postHeroImage', imageUrl);
    }
  });
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  let submitting = false;

  setFormValue(form, defaultValues);

  // init events
  initRandomImage(form);
  initRadioImageSource(form);
  initUploadImage(form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }
    showLoading(form);
    submitting = true;
    // get formValue
    const formValues = getFormValues(form);
    formValues.id = defaultValues.id;
    // validate
    // if valid submit
    // if not show error
    const isValid = await validateForm(form, formValues);
    if (isValid) await onSubmit?.(formValues);

    hideLoading(form);
    submitting = false;
  });
}

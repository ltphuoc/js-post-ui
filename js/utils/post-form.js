import { setFieldValue, setHeroImage, setTextContent } from './common';
import * as yup from 'yup';

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
    ['title', 'author', 'description'].forEach((name) => setFieldError(form, name, ''));

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

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  setFormValue(form, defaultValues);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // get formValue
    const formValues = getFormValues(form);

    // validate
    // if valid submit
    // if not show error
    if (!validateForm(form, formValues)) return;
  });
}

import { setFieldValue, setHeroImage } from './common';

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

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  setFormValue(form, defaultValues);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // get formValue
    const formValues = getFormValues(form);
    console.log(formValues);

    // validate
    // if valid submit
    // if not show error
  });
}

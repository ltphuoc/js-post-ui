import postApi from './api/postApi';
import { initPostForm, toast } from './utils';

function removeUnusedFields(formValues) {
  const payload = { ...formValues };

  if (payload.imageSource === 'upload') {
    delete payload.imageUrl;
  } else {
    delete payload.image;
  }
  delete payload.imageSource;
  return payload;
}

async function handlePostFormSubmit(formValues) {
  const payload = removeUnusedFields(formValues);
  console.log({ formValues, payload });
  return;
  try {
    // check mode
    // call API
    const savedPost = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues);

    // show success
    toast.success('Save post successfully');

    // redirect
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`);
    }, 2000);
  } catch (error) {
    console.log('failed to save post');
    toast.error(`Error:${error.message}`);
  }
}

// main
(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');

    const defaultValues = Boolean(postId)
      ? await postApi.getById(postId)
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        };

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: handlePostFormSubmit,
    });
  } catch (error) {
    console.log('failed to load getById api', error);
  }
})();

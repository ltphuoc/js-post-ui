import postApi from './api/postApi';
import { initPostForm } from './utils';

async function handlePostFormSubmit(formValues) {
  try {
    // check mode
    // call API

    const savedPost = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues);
    // show success

    window.location.assign(`/post-detail.html?id=${savedPost.id}`);
  } catch (error) {
    console.log('failed to save post');
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

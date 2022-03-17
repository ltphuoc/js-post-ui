import postApi from './api/postApi';
import studentApi from './api/studentApi';

async function main() {
  try {
    const queryParams = {
      _page: 1,
      _limit: 4,
    };
    const data = await postApi.getAll(queryParams);
    console.log(data);
  } catch (error) {
    console.log('getAll failed', error);
    // show modal
  }
}

main();

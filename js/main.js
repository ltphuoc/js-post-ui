import postApi from './api/postApi';
import studentApi from './api/studentApi';

async function main() {
  const queryParams = {
    _page: 1,
    _limit: 4,
  };
  await postApi.getAll(queryParams);
}

main();

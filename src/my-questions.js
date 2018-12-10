import loadPolyfillFetch from 'utils/polyfills/load-polyfill-fetch';
import PageMyQuestions from './components/pages/my-questions';

loadPolyfillFetch()
  .then(() => {
    new PageMyQuestions({
      el: document.body,
    });
  })
  .catch((err) => {
    console.warn(err);
  });

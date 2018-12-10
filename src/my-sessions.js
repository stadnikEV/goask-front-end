import loadPolyfillFetch from 'utils/polyfills/load-polyfill-fetch';
import PageMySessions from './components/pages/my-sessions';

loadPolyfillFetch()
  .then(() => {
    new PageMySessions({
      el: document.body,
    });
  })
  .catch((err) => {
    console.warn(err);
  });

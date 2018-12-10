import loadPolyfillFetch from 'utils/polyfills/load-polyfill-fetch';
import PageMyRequests from './components/pages/my-requests';

loadPolyfillFetch()
  .then(() => {
    new PageMyRequests({
      el: document.body,
    });
  })
  .catch((err) => {
    console.warn(err);
  });

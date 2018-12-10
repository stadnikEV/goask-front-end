import loadPolyfillFetch from 'utils/polyfills/load-polyfill-fetch';
import PageLogin from './components/pages/login';

loadPolyfillFetch()
  .then(() => {
    new PageLogin({
      el: document.body,
    });
  })
  .catch((err) => {
    console.warn(err);
  });

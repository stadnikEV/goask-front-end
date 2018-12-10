import loadPolyfillFetch from 'utils/polyfills/load-polyfill-fetch';
import PageStream from './components/pages/stream';

loadPolyfillFetch()
  .then(() => {
    new PageStream({
      el: document.body,
    });
  })
  .catch((err) => {
    console.warn(err);
  });

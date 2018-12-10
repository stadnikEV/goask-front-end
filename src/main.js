import loadPolyfillFetch from 'utils/polyfills/load-polyfill-fetch';
import PageMain from './components/pages/main';

loadPolyfillFetch()
  .then(() => {
    new PageMain({
      el: document.body,
    });
  })
  .catch((err) => {
    console.warn(err);
  });

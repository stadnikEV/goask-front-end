import loadPolyfillFetch from 'utils/polyfills/load-polyfill-fetch';
import PageRegistration from './components/pages/registration';

loadPolyfillFetch()
  .then(() => {
    new PageRegistration({
      el: document.body,
    });
  })
  .catch((err) => {
    console.warn(err);
  });

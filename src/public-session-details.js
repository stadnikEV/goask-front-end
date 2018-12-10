import loadPolyfillFetch from 'utils/polyfills/load-polyfill-fetch';
import PagePublicSessionDetails from './components/pages/public-session-details';

loadPolyfillFetch()
  .then(() => {
    new PagePublicSessionDetails({
      el: document.body,
    });
  })
  .catch((err) => {
    console.warn(err);
  });

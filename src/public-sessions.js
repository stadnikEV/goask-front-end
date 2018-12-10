import loadPolyfillFetch from 'utils/polyfills/load-polyfill-fetch';
import PagePublicSessions from './components/pages/public-sessions';

loadPolyfillFetch()
  .then(() => {
    new PagePublicSessions({
      el: document.body,
    });
  })
  .catch((err) => {
    console.warn(err);
  });

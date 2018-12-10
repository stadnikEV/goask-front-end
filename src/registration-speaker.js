import loadPolyfillFetch from 'utils/polyfills/load-polyfill-fetch';
import PageRegistrationSpeaker from './components/pages/registration-speaker';

loadPolyfillFetch()
  .then(() => {
    new PageRegistrationSpeaker({
      el: document.body,
    });
  })
  .catch((err) => {
    console.warn(err);
  });

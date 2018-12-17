import loadPolyfillFetch from 'utils/polyfills/load-polyfill-fetch';
import 'promise-polyfill/src/polyfill';
import matchesPolyfill from './utils/polyfills/matches-polyfill';
import closestPolyfill from './utils/polyfills/closest-polyfill';
import bindPolyfill from './utils/polyfills/bind-polyfil';
import forEachPolyfill from './utils/polyfills/foreach-polyfil';
import PageMyRequests from './components/pages/my-requests';

matchesPolyfill(Element.prototype);
closestPolyfill(Element.prototype);
bindPolyfill();
forEachPolyfill();


loadPolyfillFetch()
  .then(() => {
    new PageMyRequests({
      el: document.body,
    });
  })
  .catch((err) => {
    console.warn(err);
  });

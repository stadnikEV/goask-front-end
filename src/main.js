import loadPolyfillFetch from 'utils/polyfills/load-polyfill-fetch';
import 'promise-polyfill/src/polyfill';
import matchesPolyfill from './utils/polyfills/matches-polyfill';
import closestPolyfill from './utils/polyfills/closest-polyfill';
import bindPolyfill from './utils/polyfills/bind-polyfil';
import forEachPolyfill from './utils/polyfills/foreach-polyfil';
import PageMain from './components/pages/main';

matchesPolyfill(Element.prototype);
closestPolyfill(Element.prototype);
bindPolyfill();
forEachPolyfill();

loadPolyfillFetch()
  .then(() => {
    new PageMain({
      el: document.body,
    });
  })
  .catch((err) => {
    console.warn(err);
  });

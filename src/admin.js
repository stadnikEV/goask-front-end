import initPolyfillFetch from 'utils/polyfills/load-polyfill-fetch';
import AdminPageSelector from 'components/admin/admin-page-selector';
import router from 'router';


initPolyfillFetch()
  .then(() => {
    new AdminPageSelector({ el: document.body });

    const routeHash = router.getRouteHash();
    if (routeHash === '') {
      router.setRouteHash({ routeHash: 'speakers-confirm' });
      return;
    }
    router.initRouteHash();
  })
  .catch((err) => {
    console.warn(err);
  });

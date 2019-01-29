import PubSub from 'pubsub-js';
import isCorrectHash from './is-correct-hash';

const initRouter = () => {
  let router = null;

  if (router) {
    return router;
  }

  class Router {
    constructor() {
      this.onHashChange = this.onHashChange.bind(this);
      window.addEventListener('hashchange', this.onHashChange);
    }

    onHashChange() {
      const currentRouteHash = this.getRouteHash();

      if (!isCorrectHash({ currentRouteHash })) {
        this.setRouteHash({ routeHash: 'speakers-confirm' });
        return;
      }

      if (this.lastRouteHash === currentRouteHash) {
        return;
      }

      this.lastRouteHash = currentRouteHash;
      PubSub.publish('routeHashChange', { routeHash: currentRouteHash });
    }

    initRouteHash() {
      this.onHashChange();
    }

    getRouteHash() {
      const routeHash = window.location.hash;
      return routeHash.slice(1);
    }

    setRouteHash({ routeHash }) {
      const currentRouteHash = this.getRouteHash();
      if (currentRouteHash === routeHash) {
        return;
      }
      window.location.hash = `#${routeHash}`;
    }
  }

  router = new Router();
  return router;
};

export default initRouter();

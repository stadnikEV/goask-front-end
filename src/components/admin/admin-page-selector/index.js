import router from 'router';
import PubSub from 'pubsub-js';
import BaseComponent from 'components/__shared/base-component';
import Header from 'components/headers/header-admin';
import 'components/__shared/css/reset.scss';
import 'components/__shared/css/base.scss';
import './style.scss';
import template from './template.hbs';


export default class AdminPageSelector extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.render();
    this.elements.pageSelector = document.querySelector('[data-component="page-selector"]');
    this.elements.headerContainer = this.elements.pageSelector.querySelector('[data-element="page-selector__header-container"]');
    this.elements.contentContainer = this.elements.pageSelector.querySelector('[data-element="page-selector__content-container"]');
    this.initHeader();

    this.addEvents();
  }

  render() {
    this.el.innerHTML = template();
  }

  addEvents() {
    this.eventsPubSub.hashChange = PubSub.subscribe('routeHashChange', this.onHashChange.bind(this));
  }

  removeEvents() {
    this.unsubscribe();
  }

  onHashChange(msg, { routeHash }) {
    if (this.currentComponent !== undefined) {
      this.removeComponent({ componentName: this.currentComponent });
      this.currentComponent = undefined;
    }

    if (routeHash === 'speakers-confirm') {
      this.initSpeakersConfirm();
      return;
    }
    if (routeHash.search(/^about-speaker\/[0-9]+$/) !== -1) {
      this.initAboutSpeaker();
      return;
    }
    if (routeHash === 'speakers') {
      // this.initSpeakers();
      return;
    }
    if (routeHash === 'login') {
      this.initLogin();
      return;
    }
    if (routeHash === 'statistics') {
      // this.initStatistics();
    }
  }

  initHeader() {
    this.components.header = new Header({
      el: this.elements.headerContainer,
    });
  }

  initSpeakersConfirm() {
    import(/* webpackChunkName: "admin-speakers-confirm" */ '../admin-speakers-confirm')
      .then((Module) => {
        if (router.getRouteHash() !== 'speakers-confirm') {
          return;
        }
        const SpeakersConfirm = Module.default;
        this.components.speakersConfirm = new SpeakersConfirm({ el: this.elements.contentContainer });
        this.currentComponent = 'speakersConfirm';
      })
      .catch((err) => {
        console.warn(err);
      });
  }

  initAboutSpeaker() {
    import(/* webpackChunkName: "about-speaker" */ '../admin-about-speaker')
      .then((Module) => {
        if (router.getRouteHash()
          .search(/^about-speaker\/[0-9]+$/) === -1) {
          return;
        }
        const AboutSpeaker = Module.default;
        this.components.aboutSpeaker = new AboutSpeaker({ el: this.elements.contentContainer });
        this.currentComponent = 'aboutSpeaker';
      })
      .catch((err) => {
        console.warn(err);
      });
  }


  initLogin() {
    import(/* webpackChunkName: "admin-login" */ '../admin-login')
      .then((Module) => {
        if (router.getRouteHash() !== 'login') {
          return;
        }
        const LoginAdmin = Module.default;
        this.components.login = new LoginAdmin({ el: this.elements.contentContainer });
        this.currentComponent = 'login';
      })
      .catch((err) => {
        console.warn(err);
      });
  }
}

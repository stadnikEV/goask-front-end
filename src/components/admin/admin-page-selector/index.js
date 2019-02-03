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
      this.initSpeakers();
      return;
    }
    if (routeHash.search(/^sessions\/[0-9]\/questions$/) !== -1) {
      this.initQuestions();
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
    import(/* webpackChunkName: "admin-speakers" */ '../admin-speakers')
      .then((Module) => {
        if (router.getRouteHash() !== 'speakers-confirm') {
          return;
        }
        const Speakers = Module.default;
        this.components.speakers = new Speakers({
          el: this.elements.contentContainer,
          filter: 'notConfirmed',
          fields: 'speakerId firstname lastname about categories active',
        });
        this.currentComponent = 'speakers';
      })
      .catch((err) => {
        console.warn(err);
      });
  }

  initSpeakers() {
    import(/* webpackChunkName: "admin-speaker" */ '../admin-speakers')
      .then((Module) => {
        if (router.getRouteHash() !== 'speakers') {
          return;
        }
        const Speakers = Module.default;
        this.components.speakers = new Speakers({
          el: this.elements.contentContainer,
          filter: 'confirmed',
          fields: 'speakerId firstname lastname about categories active numberResponses',
        });
        this.currentComponent = 'speakers';
      })
      .catch((err) => {
        console.warn(err);
      });
  }

  initAboutSpeaker() {
    import(/* webpackChunkName: "admin-about-speaker" */ '../admin-about-speaker')
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

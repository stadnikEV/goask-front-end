import PubSub from 'pubsub-js';
import httpRequest from 'utils/http-request.js';
import BaseComponent from 'components/__shared/base-component';
import ButtonHeaderLink from 'components/buttons/button-header-link';
import ButtonHeaderEvent from 'components/buttons/button-header-event';
import 'components/nav-header/style.scss'; // css


export default class NavHeader extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.elements.navHeader = el.querySelector('[data-component="navigation-header"]');
    this.elements.buttonSpeakersContainer = this.elements.navHeader.querySelector('[data-element="navigation-header__button-speakers-container"]');
    this.elements.buttonLoginContainer = this.elements.navHeader.querySelector('[data-element="navigation-header__button-login-container"]');
    this.elements.buttonRegistrationContainer = this.elements.navHeader.querySelector('[data-element="navigation-header__button-registration-container"]');
    this.elements.buttonLogoutContainer = this.elements.navHeader.querySelector('[data-element="navigation-header__button-logout-container"]');
    this.elements.buttonCreateSpeakerContainer = this.elements.navHeader.querySelector('[data-element="navigation-header__create-speaker-container"]');

    this.initComponentbuttonSpeakers();

    if (this.elements.buttonLoginContainer) {
      this.initComponentButtonLogin();
    }
    if (this.elements.buttonCreateSpeakerContainer) {
      this.initComponentButtonCreateSpeaker();
    }
    if (this.elements.buttonRegistrationContainer) {
      this.initComponentButtonRegistration();
    }
    if (this.elements.buttonLogoutContainer) {
      this.initComponentbuttonLogout();
      this.addEvents();
    }
  }

  addEvents() {
    this.eventsPubSub.logout = PubSub.subscribe('logout', this.logout.bind(this));
  }

  removeEvents() {
    this.unsubscribe();
  }

  initComponentButtonLogin() {
    this.components.buttonLogin = new ButtonHeaderLink({
      el: this.elements.buttonLoginContainer,
      componentName: 'button-login',
    });
  }

  initComponentButtonRegistration() {
    this.components.buttonRegistration = new ButtonHeaderLink({
      el: this.elements.buttonRegistrationContainer,
      componentName: 'button-registration',
    });
  }

  initComponentbuttonSpeakers() {
    this.components.buttonSpeakers = new ButtonHeaderLink({
      el: this.elements.buttonSpeakersContainer,
      componentName: 'button-speakers',
    });
  }

  initComponentButtonCreateSpeaker() {
    this.components.buttonCreateSpeaker = new ButtonHeaderLink({
      el: this.elements.buttonCreateSpeakerContainer,
      componentName: 'button-create-speaker',
    });
  }

  initComponentbuttonLogout() {
    this.components.buttonLogout = new ButtonHeaderEvent({
      el: this.elements.buttonLogoutContainer,
      componentName: 'button-logout',
      eventName: 'logout',
      value: 'Выйти',
    });
  }

  logout() {
    httpRequest.get({
      url: '<%publicPathBackEnd%>/api/logout',
    })
      .then((json) => {
        const { link } = json;
        window.location.href = link;
      })
      .catch((e) => {
        console.warn(e);
      });
  }
}

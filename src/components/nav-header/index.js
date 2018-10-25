import BaseComponent from 'components/__shared/base-component';
import ButtonHeader from 'components/buttons/button-header';
import 'components/nav-header/style.scss'; // css


export default class NavHeader extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.elements.navHeader = document.querySelector('[data-component="navigation-header"]');
    this.elements.buttonSpeakersContainer = this.elements.navHeader.querySelector('[data-element="navigation-header__button-speakers-container"]');
    this.elements.buttonLoginContainer = this.elements.navHeader.querySelector('[data-element="navigation-header__button-login-container"]');
    this.elements.buttonRegistrationContainer = this.elements.navHeader.querySelector('[data-element="navigation-header__button-registration-container"]');

    this.buttonSpeakersInit();
    if (this.elements.buttonLoginContainer) {
      this.buttonLoginInit();
    }
    if (this.elements.buttonRegistrationContainer) {
      this.buttonRegistrationInit();
    }
  }

  buttonLoginInit() {
    this.components.buttonLogin = new ButtonHeader({
      el: this.elements.buttonLoginContainer,
      componentName: 'button-login',
    });
  }

  buttonRegistrationInit() {
    this.components.buttonRegistration = new ButtonHeader({
      el: this.elements.buttonRegistrationContainer,
      componentName: 'button-registration',
    });
  }

  buttonSpeakersInit() {
    this.components.Speakers = new ButtonHeader({
      el: this.elements.buttonSpeakersContainer,
      componentName: 'button-speakers',
    });
  }
}

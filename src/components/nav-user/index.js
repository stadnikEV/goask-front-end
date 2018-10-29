import BaseComponent from 'components/__shared/base-component';
import ButtonUserNavigation from 'components/buttons/button-user-navigation';
import './style.scss'; // css


export default class UserNavigation extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.elements.userNavigation = document.querySelector('[data-component="user-navigation"]');
    this.elements.buttonSessionContainer = document.querySelector('[data-element="user-navigation__button-sessions-container"]');

    if (this.elements.buttonSessionContainer) {
      this.initButtonSession();
    }
  }


  initButtonSession() {
    this.components.buttonSession = new ButtonUserNavigation({
      el: this.elements.buttonSessionContainer,
      componentName: 'button-user-navigation-sessions',
    });
  }
}

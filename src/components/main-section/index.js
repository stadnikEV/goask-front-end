import BaseComponent from 'components/__shared/base-component';
import UserNavigation from 'components/nav-user';
import './style.scss'; // css


export default class MainSection extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.elements.mainSection = document.querySelector('[data-component="main-section"]');
    this.elements.userNavContainer = this.elements.mainSection.querySelector('[data-element="main-section__user-navigation-container"]');

    if (this.elements.userNavContainer) {
      this.initUserNavigation();
    }
  }

  initUserNavigation() {
    this.components.userNavigation = new UserNavigation({
      el: this.elements.userNavContainer,
    });
  }
}

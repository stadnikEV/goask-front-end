import BaseComponent from 'components/__shared/base-component';
import UserNavigation from 'components/navigations/nav-user';
import './style.scss'; // css


export default class MainBlock extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.elements.mainBlock = el.querySelector('[data-component="main-block"]');
    this.elements.userNavContainer = this.elements.mainBlock.querySelector('[data-element="main-block__user-navigation-container"]');

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

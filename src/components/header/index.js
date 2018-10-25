import BaseComponent from 'components/__shared/base-component';
import Logo from 'components/logo';
import NavHeader from 'components/nav-header';
import 'components/header/style.scss'; // css

export default class Header extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.elements.header = document.querySelector('[data-component="header"]');
    this.elements.logoContainer = this.elements.header.querySelector('[data-element="header__logo-container"]');
    this.elements.navContainer = this.elements.header.querySelector('[data-element="header__navigation-container"]');

    this.logoInit();
    this.navHeaderInit();
  }

  logoInit() {
    this.components.logo = new Logo({ el: this.elements.logoContainer });
  }

  navHeaderInit() {
    this.components.nav = new NavHeader({ el: this.elements.navContainer });
  }
}

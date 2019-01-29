import BaseComponent from 'components/__shared/base-component';
import NavHeader from 'components/navigations/nav-header-admin';
import './style.scss';
import template from './template.hbs';

export default class Header extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.render();

    this.elements.header = document.querySelector('[data-component="header"]');
    this.elements.navContainer = this.elements.header.querySelector('[data-element="header__navigation-container"]');

    this.navHeaderInit();
  }

  render() {
    this.el.innerHTML = template();
  }

  navHeaderInit() {
    this.components.nav = new NavHeader({ el: this.elements.navContainer });
  }
}

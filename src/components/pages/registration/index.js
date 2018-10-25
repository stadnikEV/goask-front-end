import BaseComponent from 'components/__shared/base-component';
import Header from 'components/header';
import Registration from 'components/registration';
import 'components/__shared/css/reset.scss'; // css
import 'components/__shared/css/base.scss'; // css
import 'components/__shared/page-login-registration/style.scss'; // css


export default class Page extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.elements.page = document.querySelector('[data-component="page"]');
    this.elements.headerContainer = this.elements.page.querySelector('[data-element="page__header-container"]');
    this.elements.mainContainer = this.elements.page.querySelector('[data-element="page__main-container"]');

    this.initHeader();
    this.initRegistration();
  }

  initHeader() {
    this.components.header = new Header({
      el: this.elements.headerContainer,
    });
  }

  initRegistration() {
    this.components.registration = new Registration({
      el: this.elements.mainContainer,
    });
  }
}

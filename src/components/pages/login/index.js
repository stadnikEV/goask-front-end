import BaseComponent from 'components/__shared/base-component';
import Header from 'components/headers/header-main';
import Login from 'components/login';
import 'components/__shared/css/reset.scss'; // css
import 'components/__shared/css/base.scss'; // css
import 'components/__shared/page-login-registration/style.scss'; // css


export default class PageLogin extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.elements.page = document.querySelector('[data-component="page"]');
    this.elements.headerContainer = this.elements.page.querySelector('[data-element="page__header-container"]');
    this.elements.mainContainer = this.elements.page.querySelector('[data-element="page__main-container"]');

    this.initHeader();
    this.initLogin();
  }

  initHeader() {
    this.components.header = new Header({
      el: this.elements.headerContainer,
    });
  }

  initLogin() {
    this.components.login = new Login({
      el: this.elements.mainContainer,
    });
  }
}

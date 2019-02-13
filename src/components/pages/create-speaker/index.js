import BaseComponent from 'components/__shared/base-component';
import Header from 'components/headers/header-main';
import RegistrationSpeaker from 'components/registration-speaker';
import 'components/__shared/css/reset.scss'; // css
import 'components/__shared/css/base.scss'; // css
import 'components/pages/create-speaker/style.scss'; // css


export default class PageCreateSpeaker extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.elements.page = document.querySelector('[data-component="page"]');
    this.elements.headerContainer = this.elements.page.querySelector('[data-element="page__header-container"]');
    this.elements.mainContainer = this.elements.page.querySelector('[data-element="page__main-container"]');

    this.initHeader();
    this.initRegistrationSpeaker();
  }

  initHeader() {
    this.components.header = new Header({
      el: this.elements.headerContainer,
    });
  }

  initRegistrationSpeaker() {
    this.components.createSpeaker = new RegistrationSpeaker({
      el: this.elements.mainContainer,
    });
  }
}

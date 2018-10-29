import BaseComponent from 'components/__shared/base-component';
import Header from 'components/header';
import MainSection from 'components/main-section';
import 'components/__shared/css/reset.scss'; // css
import 'components/__shared/css/base.scss'; // css
import 'components/pages/main/style.scss'; // css
import mainSectionImage from './img/main-section.png'; // svg


export default class PageMain extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.elements.page = document.querySelector('[data-component="page"]');
    this.elements.headerContainer = this.elements.page.querySelector('[data-element="page__header-container"]');
    this.elements.mainSectionContainer = this.elements.page.querySelector('[data-element="page__main-section-container"]');

    this.initHeader();
    this.initMainSection();
  }

  initHeader() {
    this.components.header = new Header({
      el: this.elements.headerContainer,
    });
  }

  initMainSection() {
    this.components.mainSection = new MainSection({
      el: this.elements.mainSectionContainer,
    });
  }
}

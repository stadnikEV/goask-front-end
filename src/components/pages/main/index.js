import BaseComponent from 'components/__shared/base-component';
import Header from 'components/headers/header-main';
import MainBlock from 'components/main-block';
import 'components/__shared/css/reset.scss'; // css
import 'components/__shared/css/base.scss'; // css
import 'components/pages/main/style.scss'; // css
import mainBlockImage from './img/main-block.png'; // svg


export default class PageMain extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.elements.page = el.querySelector('[data-component="page"]');
    this.elements.mainBlockContainer = this.elements.page.querySelector('[data-element="page__main-block-container"]');

    this.initHeader();
    this.initMainBlock();
  }

  initHeader() {
    this.components.header = new Header({
      el: this.elements.headerContainer,
    });
  }

  initMainBlock() {
    this.components.mainBlock = new MainBlock({
      el: this.elements.mainBlockContainer,
    });
  }
}

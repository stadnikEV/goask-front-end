import BaseComponent from 'components/__shared/base-component';
import Header from 'components/header';
import MainBlock from 'components/main-block';
import MyRequests from 'components/requests/my-requests';
import 'components/__shared/css/reset.scss'; // css
import 'components/__shared/css/base.scss'; // css
import './style.scss'; // css
import MainBlockImage from './img/kource-web-design.png'; // svg


export default class PageMyQuestions extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.elements.page = document.querySelector('[data-component="page"]');
    this.elements.headerContainer = this.elements.page.querySelector('[data-element="page__header-container"]');
    this.elements.MainBlockContainer = this.elements.page.querySelector('[data-element="page__main-block-container"]');
    this.elements.myRequestsContainer = this.elements.page.querySelector('[data-element="page__my-requests-container"]');

    this.initHeader();
    this.initMainBlock();
    this.initMyRequests();
  }


  initHeader() {
    this.components.header = new Header({
      el: this.elements.headerContainer,
    });
  }

  initMainBlock() {
    this.components.mainBlock = new MainBlock({
      el: this.elements.MainBlockContainer,
    });
  }

  initMyRequests() {
    this.components.myRequests = new MyRequests({
      el: this.elements.myRequestsContainer,
    });
  }
}

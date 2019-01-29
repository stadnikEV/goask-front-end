import BaseComponent from 'components/__shared/base-component';
import Header from 'components/headers/header-main';
import MainBlock from 'components/main-block';
import MySessions from 'components/sessions/my-sessions';


import 'components/__shared/css/reset.scss'; // css
import 'components/__shared/css/base.scss'; // css
import './style.scss'; // css
import mainBlockImage from './img/kource-web-design.png'; // svg


export default class PageMySessions extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.elements.page = el.querySelector('[data-component="page"]');
    this.elements.headerContainer = this.elements.page.querySelector('[data-element="page__header-container"]');
    this.elements.MainBlockContainer = this.elements.page.querySelector('[data-element="page__main-block-container"]');
    this.elements.mySessionsContainer = this.elements.page.querySelector('[data-element="page__my-sessions-container"]');

    this.initHeader();
    this.initMainBlock();
    this.initMySessions();
  }


  initHeader() {
    this.components.header = new Header({
      el: this.elements.headerContainer,
    });
  }

  initMainBlock() {
    this.components.MainBlock = new MainBlock({
      el: this.elements.MainBlockContainer,
    });
  }

  initMySessions() {
    this.components.MySessions = new MySessions({
      el: this.elements.mySessionsContainer,
    });
  }
}

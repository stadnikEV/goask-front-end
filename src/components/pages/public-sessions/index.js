import BaseComponent from 'components/__shared/base-component';
import Header from 'components/header';
import MainBlock from 'components/main-block';
import PublicSessions from 'components/sessions/public-sessions';
import 'components/__shared/css/reset.scss'; // css
import 'components/__shared/css/base.scss'; // css
import './style.scss'; // css
import mainBlockImage from './img/sesions-categories-main.png'; // svg


export default class PagePublicSessions extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.elements.page = el.querySelector('[data-component="page"]');
    this.elements.headerContainer = this.elements.page.querySelector('[data-element="page__header-container"]');
    this.elements.mainBlockContainer = this.elements.page.querySelector('[data-element="page__main-block-container"]');
    this.elements.publicSessionsContainer = this.elements.page.querySelector('[data-element="page__public-sessions-container"]');

    this.initHeader();
    this.initMainBlock();
    this.initPublicSessions();
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

  initPublicSessions() {
    this.components.publicSessions = new PublicSessions({
      el: this.elements.publicSessionsContainer,
    });
  }
}

import BaseComponent from 'components/__shared/base-component';
import Header from 'components/header';
import MainSection from 'components/main-section';
import MySessions from 'components/sessions/my-sessions';


import 'components/__shared/css/reset.scss'; // css
import 'components/__shared/css/base.scss'; // css
import './style.scss'; // css
import mainSectionImage from './img/kource-web-design.png'; // svg


export default class PageMySessions extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.elements.page = document.querySelector('[data-component="page"]');
    this.elements.headerContainer = this.elements.page.querySelector('[data-element="page__header-container"]');
    this.elements.mainSectionContainer = this.elements.page.querySelector('[data-element="page__main-section-container"]');
    this.elements.mySessionsContainer = this.elements.page.querySelector('[data-element="page__my-sessions-container"]');

    this.elements.page.hidden = false;

    this.initHeader();
    this.initMainSection();
    this.initMySessions();
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

  initMySessions() {
    this.components.MySessions = new MySessions({
      el: this.elements.mySessionsContainer,
    });
  }
}

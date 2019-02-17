import BaseComponent from 'components/__shared/base-component';
import Header from 'components/headers/header-main';
import MainBlock from 'components/main-block';
import PublicSpeakers from 'components/speakers/public-speakers';
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
    this.elements.publicSpeakersContainer = this.elements.page.querySelector('[data-element="page__public-speakers-container"]');

    this.initHeader();
    this.initMainBlock();
    this.initPublicSpeakers();
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

  initPublicSpeakers() {
    this.components.publicSessions = new PublicSpeakers({
      el: this.elements.publicSpeakersContainer,
    });
  }
}

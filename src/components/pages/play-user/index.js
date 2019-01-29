import BaseComponent from 'components/__shared/base-component';
import Header from 'components/headers/header-main';
import PlayUser from 'components/play-user';
import 'components/__shared/css/reset.scss'; // css
import 'components/__shared/css/base.scss'; // css
import './style.scss'; // css


export default class PagePlay extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.elements.headerContainer = el.querySelector('[data-element="page__header-container"]');
    this.elements.playContainer = el.querySelector('[data-element="page__play-container"]');

    this.initHeader();
    this.initPlay();
  }

  initHeader() {
    this.components.header = new Header({
      el: this.elements.headerContainer,
    });
  }

  initPlay() {
    this.components.play = new PlayUser({
      el: this.elements.playContainer,
    });
  }
}

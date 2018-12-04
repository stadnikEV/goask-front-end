import BaseComponent from 'components/__shared/base-component';
import Header from 'components/header';
import Stream from 'components/stream';
import 'components/__shared/css/reset.scss'; // css
import 'components/__shared/css/base.scss'; // css
import './style.scss'; // css


export default class PageStream extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.elements.headerContainer = el.querySelector('[data-element="page__header-container"]');
    this.elements.streamContainer = el.querySelector('[data-element="page__stream-container"]');

    this.initHeader();
    this.initStream();
  }

  initHeader() {
    this.components.header = new Header({
      el: this.elements.headerContainer,
    });
  }

  initStream() {
    this.components.stream = new Stream({
      el: this.elements.streamContainer,
    });
  }
}

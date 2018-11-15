import BaseComponent from 'components/__shared/base-component';
import Header from 'components/header';
import PublicSessionDetails from 'components/sessions/public-session-details';

import 'components/__shared/css/reset.scss'; // css
import 'components/__shared/css/base.scss'; // css
import './style.scss'; // css


export default class PagePublicSessionsDetails extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.elements.page = document.querySelector('[data-component="page"]');
    this.elements.headerContainer = this.elements.page.querySelector('[data-element="page__header-container"]');
    this.elements.sessionDetailsContainer = this.elements.page.querySelector('[data-element="page__public-session-details-container"]');

    this.initHeaderComponent();
    this.initSessionDetailsComponent();
  }


  initHeaderComponent() {
    this.components.header = new Header({
      el: this.elements.headerContainer,
    });
  }

  initSessionDetailsComponent() {
    this.components.publicSessionDetails = new PublicSessionDetails({
      el: this.elements.sessionDetailsContainer,
    });
  }
}

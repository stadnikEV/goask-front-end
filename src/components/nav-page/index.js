// import PubSub from 'pubsub-js';
import BaseComponent from 'components/__shared/base-component';
import getPageNavigationData from 'utils/get-page-navigation-data';
import ButtonNavigationPageEvent from 'components/buttons/button-nav-page-event';

import './style.scss'; // css
import template from './template.hbs';


export default class NavigationPage extends BaseComponent {
  constructor({ el, pageNumber, numberOfPages }) {
    super({ el });
    this.components = {};

    this.pageNumber = pageNumber;
    this.numberOfPages = numberOfPages;

    const pageNavigationData = getPageNavigationData({ pageNumber, numberOfPages });
    this.render(pageNavigationData);
    this.initComponents({ pageNavigationData });
  }

  render(pageNavigationData) {
    this.el.innerHTML = template(pageNavigationData);
  }

  initComponents({ pageNavigationData }) {
    this.elements.navigation = document.querySelector('[data-component="navigation-page"]');

    if (pageNavigationData.firstPage) {
      this.components.buttonFirstPage = this.initButtonComponent({
        pageNumber: pageNavigationData.firstPage,
        componentName: 'button-first-page',
      });
    }

    if (pageNavigationData.pagesBefore[0]) {
      this.components.buttonPagesBefore_0 = this.initButtonComponent({
        pageNumber: pageNavigationData.pagesBefore[0],
        componentName: `button-page-before-${pageNavigationData.pagesBefore[0]}`,
      });
    }

    if (pageNavigationData.pagesBefore[1]) {
      this.components.buttonPagesBefore_1 = this.initButtonComponent({
        pageNumber: pageNavigationData.pagesBefore[1],
        componentName: `button-page-before-${pageNavigationData.pagesBefore[1]}`,
      });
    }

    if (pageNavigationData.currentPage) {
      this.components.buttonCurrentPage = this.initButtonComponent({
        pageNumber: pageNavigationData.currentPage,
        componentName: 'button-current-page',
        modifierClassName: 'selected',
      });
    }

    if (pageNavigationData.pagesAfter[0]) {
      this.components.buttonPageAfter_0 = this.initButtonComponent({
        pageNumber: pageNavigationData.pagesAfter[0],
        componentName: `button-page-after-${pageNavigationData.pagesAfter[0]}`,
      });
    }

    if (pageNavigationData.pagesAfter[1]) {
      this.components.buttonPageAfter_1 = this.initButtonComponent({
        pageNumber: pageNavigationData.pagesAfter[1],
        componentName: `button-page-after-${pageNavigationData.pagesAfter[1]}`,
      });
    }

    if (pageNavigationData.lastPage) {
      this.components.buttonLastPage = this.initButtonComponent({
        pageNumber: pageNavigationData.lastPage,
        componentName: 'button-last-page',
      });
    }
  }

  initButtonComponent({ pageNumber, componentName, modifierClassName }) {
    const component = new ButtonNavigationPageEvent({
      el: this.elements.navigation.querySelector(`[data-element="navigation-page__${componentName}-container"]`),
      value: pageNumber,
      className: 'button-page-navigation',
      modifierClassName,
      componentName,
      eventName: 'button-navigation-page',
      data: { pageNumber },
    });

    return component;
  }

  removeEvents() {

  }
}

import PubSub from 'pubsub-js';
import router from 'router';
import BaseComponent from 'components/__shared/base-component';
import ButtonHeaderEvent from 'components/buttons/button-header-event';
import './style.scss';
import template from './template.hbs';


export default class NavHeaderAdmin extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.render();

    this.elements.navHeader = el.querySelector('[data-component="navigation-header"]');
    this.elements.buttonSpeakersConfirmContainer = this.elements.navHeader.querySelector('[data-element="navigation-header__button-header-speakers-confirm-container"]');
    this.elements.buttonSpeakersContainer = this.elements.navHeader.querySelector('[data-element="navigation-header__button-header-speakers-container"]');
    this.elements.buttonStatisticsContainer = this.elements.navHeader.querySelector('[data-element="navigation-header__button-header-statistics-container"]');

    this.initButtonSpeakersConfirm();
    this.initButtonSpeakers();
    this.initButtonStatistics();

    this.addEvents();
  }


  render() {
    this.el.innerHTML = template();
  }

  addEvents() {
    this.eventsPubSub.hashChange = PubSub.subscribe('routeHashChange', this.onHashChange.bind(this));
    this.eventsPubSub.clickButton = PubSub.subscribe('click-button-header', this.onclickButton.bind(this));
  }

  removeEvents() {
    this.unsubscribe();
  }

  initButtonSpeakersConfirm() {
    this.components.buttonSpeakersConfirm = new ButtonHeaderEvent({
      el: this.elements.buttonSpeakersConfirmContainer,
      value: 'Подтверждение',
      componentName: 'button-header-speakers-confirm',
      eventName: 'click-button-header',
      data: {
        routeHash: 'speakers-confirm',
      },
    });
  }

  initButtonSpeakers() {
    this.components.buttonSpeakers = new ButtonHeaderEvent({
      el: this.elements.buttonSpeakersContainer,
      value: 'Cпикеры',
      componentName: 'button-header-speakers',
      eventName: 'click-button-header',
      data: {
        routeHash: 'speakers',
      },
    });
  }

  initButtonStatistics() {
    this.components.buttonStatistics = new ButtonHeaderEvent({
      el: this.elements.buttonStatisticsContainer,
      value: 'Cтатистика',
      componentName: 'button-header-statistics',
      eventName: 'click-button-header',
      data: {
        routeHash: 'statistics',
      },
    });
  }

  setSelectedButton({ routeHash }) {
    if (this.selectedButtonName) {
      this.components[this.selectedButtonName].deselect();
    }
    if (routeHash === 'speakers-confirm') {
      this.components.buttonSpeakersConfirm.select();
      this.selectedButtonName = 'buttonSpeakersConfirm';

      return;
    }
    if (routeHash === 'speakers') {
      this.components.buttonSpeakers.select();
      this.selectedButtonName = 'buttonSpeakers';

      return;
    }
    if (routeHash === 'statistics') {
      this.components.buttonStatistics.select();
      this.selectedButtonName = 'buttonStatistics';
    }
  }

  onHashChange(msg, { routeHash }) {
    this.setSelectedButton({ routeHash });
  }

  onclickButton(msg, { routeHash }) {
    router.setRouteHash({ routeHash });
  }
}

import BaseComponent from 'components/__shared/base-component';
import ButtonMainEvent from 'components/buttons/button-main-event';
import './style.scss'; // css
import template from './template.hbs';


export default class MyListItem extends BaseComponent {
  constructor({ el, data }) {
    super({ el });
    this.components = {};
    this.sessionId = data.sessionId;

    this.render(data);

    this.elements.myListItem = el.querySelector(`[data-component="my-list-item"][data-sessionId="${data.sessionId}"]`);
    this.elements.buttonDetailsContainer = this.elements.myListItem.querySelector('[data-element="my-list-item__button-details-container"]');

    this.initButtonDetails();
  }

  render(data) {
    this.el.innerHTML = template({
      theme: data.theme,
      sessionId: data.sessionId,
    });
  }

  initButtonDetails() {
    this.components.ButtonDetails = new ButtonMainEvent({
      el: this.elements.buttonDetailsContainer,
      modifierClassName: 'button-main__button_width-container button-main__button_color-gray',
      componentName: 'button-details',
      eventName: 'button-details',
      data: { sessionId: this.sessionId },
      value: 'Подробнее',
    });
  }
}

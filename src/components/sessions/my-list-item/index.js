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
    this.elements.buttoRemoveContainer = this.elements.myListItem.querySelector('[data-element="my-list-item__button-remove-container"]');

    this.initComponentButtonRemove({ data });
  }

  render(data) {
    this.el.innerHTML = template({
      theme: data.theme,
      sessionId: data.sessionId,
    });
  }

  initComponentButtonRemove() {
    this.components.ButtonRemove = new ButtonMainEvent({
      el: this.elements.buttoRemoveContainer,
      className: 'button-main',
      modifierClassName: 'color-gray',
      componentName: `button-remove-session-${this.sessionId}`,
      eventName: 'remove-session',
      data: this.sessionId,
      value: 'Удалить сессию',
    });
  }
}

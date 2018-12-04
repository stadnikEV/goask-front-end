import PubSub from 'pubsub-js';
import BaseComponent from 'components/__shared/base-component';
import 'components/__shared/button/style.scss'; // css
import template from './template.hbs'; // template


export default class BaseButtonEvent extends BaseComponent {
  constructor({
    el,
    value,
    componentName,
    eventName,
    className,
    modifierClassName,
    data,
  }) {
    super({ el });

    this.eventsPubSub = {};

    this.eventName = eventName;
    this.data = data;
    this.componentName = componentName;

    this.render({
      value,
      componentName,
      className,
      modifierClassName,
    });
    this.elements.buttonEvent = el.querySelector(`[data-component="${componentName}"]`);
    this.elements.button = this.elements.buttonEvent.querySelector(`[data-element="${componentName}__button"]`);

    this.onButtonClick = this.onButtonClick.bind(this);

    this.addEvents();
  }

  render(options) {
    this.el.innerHTML = template(options);
  }

  addEvents() {
    this.elements.buttonEvent.addEventListener('click', this.onButtonClick);
    this.elements.button.onmousedown = () => false; // запрет outline при клике
  }

  removeEvents() {
    this.elements.buttonEvent.removeEventListener('click', this.onButtonClick);
    this.elements.button.onmousedown = null;
  }

  onButtonClick(e) {
    const button = e.target.closest(`[data-element="${this.componentName}__button"]`);
    if (!button) {
      return;
    }
    e.preventDefault();
    PubSub.publish(this.eventName, this.data);
  }
}

import PubSub from 'pubsub-js';
import BaseComponent from 'components/__shared/base-component';
import 'components/__shared/button/style.scss'; // css
import 'components/__shared/button/button-default.scss'; // css
import template from './template.hbs'; // template


export default class ButtonDefault extends BaseComponent {
  constructor({
    el,
    value,
    componentName,
    eventName,
  }) {
    super({ el });

    this.eventsPubSub = {};

    this.eventName = eventName;

    this.render({ value, componentName });
    this.elements.button = document.querySelector(`[data-component="${componentName}"]`);

    this.onButtonClick = this.onButtonClick.bind(this);

    this.addEvents();
  }

  render({ value, componentName }) {
    this.el.innerHTML = template({ value, componentName });
  }

  addEvents() {
    this.elements.button.addEventListener('click', this.onButtonClick);
    this.elements.button.onmousedown = () => false; // запрет outline при клике
  }

  removeEvents() {
    this.elements.button.removeEventListener('click', this.onButtonClick);
    this.elements.button.onmousedown = null;
  }

  onButtonClick(e) {
    e.preventDefault();
    PubSub.publish(this.eventName);
  }
}

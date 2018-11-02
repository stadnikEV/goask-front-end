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
    className,
    data,
  }) {
    super({ el });

    this.eventsPubSub = {};

    this.eventName = eventName;
    this.data = data;

    this.render({ value, componentName, className });
    this.elements.button = document.querySelector(`[data-component="${componentName}"]`);

    this.onButtonClick = this.onButtonClick.bind(this);

    this.addEvents();
  }

  render({ value, componentName, className }) {
    this.el.innerHTML = template({ value, componentName, className });
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
    PubSub.publish(this.eventName, this.data);
  }
}

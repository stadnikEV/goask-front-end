import BaseComponent from 'components/__shared/base-component';
import 'components/__shared/button/style.scss'; // css
import 'components/__shared/button/button-main/button-main.scss'; // css
import template from './template.hbs'; // template


export default class ButtonSubmit extends BaseComponent {
  constructor({
    el,
    value,
    componentName,
    className,
  }) {
    super({ el });
    this.eventsPubSub = {};

    this.render({ value, componentName, className });
    this.elements.button = el.querySelector(`[data-element="${componentName}__button"]`);

    this.addEvents();
  }

  render({ value, componentName, className }) {
    this.el.innerHTML = template({ value, componentName, className });
  }

  addEvents() {
    this.elements.button.onmousedown = () => false; // запрет outline при клике
  }

  removeEvents() {
    this.elements.button.onmousedown = null;
  }
}

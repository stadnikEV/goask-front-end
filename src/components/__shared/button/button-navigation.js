import BaseComponent from 'components/__shared/base-component';
import 'components/__shared/button/style.scss'; // css


export default class ButtonNavigation extends BaseComponent {
  constructor({
    el,
    componentName,
  }) {
    super({ el });

    this.elements.button = document.querySelector(`[data-component="${componentName}"]`);

    this.addEvents();
  }

  addEvents() {
    this.elements.button.onmousedown = () => false; // запрет outline при клике
  }

  removeEvents() {
    this.elements.button.onmousedown = null;
  }
}

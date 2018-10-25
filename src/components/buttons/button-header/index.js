import BaseComponent from 'components/__shared/base-component';
import 'components/__shared/button/style.scss'; // css
import 'components/buttons/button-header/style.scss'; // css


export default class ButtonHeader extends BaseComponent {
  constructor({
    el,
    componentName,
  }) {
    super({ el });

    this.elements.button = document.querySelector(`[data-component="${componentName}"]`);

    this.addEvents();
  }

  addEvents() {
    this.elements.button.addEventListener('click', this.setRouteHash);
    this.elements.button.onmousedown = () => false; // запрет outline при клике
  }

  removeEvents() {
    this.elements.button.removeEventListener('click', this.setRouteHash);
    this.elements.button.onmousedown = null;
  }
}

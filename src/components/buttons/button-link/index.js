import BaseComponent from 'components/__shared/base-component';
import 'components/__shared/button/style.scss'; // css
import 'components/__shared/button/button-default.scss'; // css


export default class ButtonLink extends BaseComponent {
  constructor({
    el,
    componentName,
    id,
  }) {
    super({ el });

    this.componentName = componentName;

    this.elements.buttonLink = document.querySelector(`[data-component="${componentName}-${id}"]`);
    this.elements.link = this.elements.buttonLink.querySelector(`[data-element="${componentName}__link"]`);
    this.elements.button = this.elements.buttonLink.querySelector(`[data-element="${componentName}__button"]`);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.addEvents();
  }

  addEvents() {
    this.elements.button.addEventListener('mousedown', this.onMouseDown);
  }

  removeEvents() {
    this.elements.logo.removeEventListener('mousedown', this.onMouseDown);
  }

  onMouseDown(e) {
    const button = e.target.closest(`[data-element="${this.componentName}__button"]`);
    if (!button) {
      return;
    }
    if (!this.elements.buttonLink.contains(button)) {
      return;
    }
    const link = this.elements.link.href;
    window.location.href = link;
    e.preventDefault();
  }
}

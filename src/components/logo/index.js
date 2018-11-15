import BaseComponent from 'components/__shared/base-component';
import 'components/logo/style.scss'; // css
import logоImage from './img/logo.svg'; // svg


export default class Logo extends BaseComponent {
  constructor({ el }) {
    super({ el });

    this.elements.logo = document.querySelector('[data-component="logo"]');
    this.elements.link = this.elements.logo.querySelector('[data-element="logo__link"]');
    this.elements.button = this.elements.logo.querySelector('[data-element="logo__button"]');
    this.elements.logoImg = this.elements.logo.querySelector('[data-element="logo__img"]');

    this.onMouseDown = this.onMouseDown.bind(this);
    this.addEvents();
  }

  addEvents() {
    this.elements.button.addEventListener('mousedown', this.onMouseDown);
    this.elements.logoImg.ondragstart = () => false; // запрет dragstart
  }

  removeEvents() {
    this.elements.logo.removeEventListener('mousedown', this.onMouseDown);
    this.elements.logoImg.ondragstart = null;
  }

  onMouseDown(e) {
    const button = e.target.closest('[data-element="logo__button"]');
    if (!button) {
      return;
    }
    if (!this.elements.logo.contains(button)) {
      return;
    }
    const link = this.elements.link.href;
    window.location.href = link;
    e.preventDefault();
  }
}

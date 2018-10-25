import BaseComponent from 'components/__shared/base-component';

export default class BaseInput extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.eventsPubSub = {};
  }

  getData() {
    return this.elements.input.value;
  }

  backlightValid({ isValid }) {
    if (isValid) {
      this.elements.input.classList.remove('input_invalid');
      return;
    }
    this.elements.input.classList.add('input_invalid');
  }

  setFocus() {
    this.elements.input.focus();
  }

  disable() {
    this.elements.input.setAttribute('disabled', '');
  }

  enable() {
    this.elements.input.removeAttribute('disabled', '');
  }
}

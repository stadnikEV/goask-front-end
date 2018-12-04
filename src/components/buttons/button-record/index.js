import BaseButtonEvent from 'components/__shared/button/base-button-event';
import './style.scss';


export default class ButtonMain extends BaseButtonEvent {
  constructor(options) {
    options.className = 'button-record';
    super(options);
    const { el } = options;

    this.elements.button = el.querySelector('[data-element="button-record__button"]');
  }

  setRecord({ record }) {
    if (record) {
      this.elements.button.classList.add('button-record__button_record');
      return;
    }
    this.elements.button.classList.remove('button-record__button_record');
  }
}

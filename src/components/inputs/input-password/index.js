import BaseInput from 'components/__shared/base-input';
import 'components/__shared/base-input/style.scss'; // css
import 'components/inputs/input-password/style.scss'; // css
import validationPassword from './validation-password';
import ButtonEye from '../../buttons/button-eye';
import template from './template.hbs'; // template


export default class InputPassword extends BaseInput {
  constructor({ el, componentName }) {
    super({ el });
    this.components = {};

    this.render({ componentName });
    this.elements.mainContainer = document.querySelector(`[data-component="input-${componentName}"]`);
    this.elements.input = this.elements.mainContainer.querySelector(`[data-element="input-${componentName}__inputField"]`);
    this.elements.buttonEyeContainer = this.elements.mainContainer.querySelector(`[data-element="input-${componentName}__button-eye-container"]`);

    this.initComponentButtonEye();
  }


  render({ componentName }) {
    this.el.innerHTML = template({ componentName });
  }


  validation() {
    const passwordStatus = validationPassword({ value: this.elements.input.value });
    this.backlightValid({ isValid: passwordStatus.isValid });
    return passwordStatus;
  }


  initComponentButtonEye() {
    this.components.buttonEye = new ButtonEye({
      el: this.elements.buttonEyeContainer,
      componentName: 'button-eye-password',
      clickHendler: this.buttonEyeHendler.bind(this),
    });
  }


  buttonEyeHendler({ isShown }) {
    if (isShown) {
      this.elements.input.type = 'text';
      return;
    }
    this.elements.input.type = 'password';
  }
}

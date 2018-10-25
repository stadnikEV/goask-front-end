import BaseInput from 'components/__shared/base-input';
import 'components/__shared/base-input/style.scss'; // css
import validationTextarea from './validation-textarea';
import template from './template.hbs'; // template


export default class InputText extends BaseInput {
  constructor({ el, componentName }) {
    super({ el });

    this.componentName = componentName;
    this.render({ componentName });
    this.elements.input = document.querySelector(`[data-component="textarea-${componentName}"]`);
  }

  render({ componentName }) {
    this.el.innerHTML = template({ componentName });
  }

  validation() {
    const textStatus = validationTextarea({ value: this.elements.input.value });
    this.backlightValid({ isValid: textStatus.isValid });
    return textStatus;
  }
}

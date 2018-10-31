import BaseInput from 'components/__shared/base-input';
import 'components/__shared/base-input/style.scss'; // css
import validationText from './validation-text';
import template from './template.hbs'; // template


export default class InputText extends BaseInput {
  constructor({ el, componentName, maxLength }) {
    super({ el });

    this.componentName = componentName;
    this.maxLength = maxLength;
    this.render({ componentName });
    this.elements.input = document.querySelector(`[data-component="input-${componentName}"]`);
  }

  render({ componentName }) {
    this.el.innerHTML = template({ componentName });
  }

  validation() {
    const textStatus = validationText({
      value: this.elements.input.value,
      maxLength: this.maxLength,
    });
    this.backlightValid({ isValid: textStatus.isValid });
    return textStatus;
  }
}

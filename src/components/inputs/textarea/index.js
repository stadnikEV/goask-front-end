import BaseInput from 'components/__shared/base-input';
import 'components/__shared/base-input/style.scss'; // css
import validationTextarea from './validation-textarea';
import template from './template.hbs'; // template
import './style.scss'; // css


export default class Textarea extends BaseInput {
  constructor({ el, componentName, maxLength }) {
    super({ el });

    this.componentName = componentName;
    this.maxLength = maxLength;
    this.render({ componentName });
    this.elements.input = document.querySelector(`[data-component="textarea-${componentName}"]`);
  }

  render({ componentName }) {
    this.el.innerHTML = template({ componentName });
  }

  validation() {
    const textStatus = validationTextarea({
      value: this.elements.input.value,
      maxLength: this.maxLength,
    });
    this.backlightValid({ isValid: textStatus.isValid });
    return textStatus;
  }

  clear() {
    this.elements.input.value = '';
  }
}

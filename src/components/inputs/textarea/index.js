import BaseInput from 'components/__shared/base-input';
import 'components/__shared/base-input/style.scss';
import validationTextarea from './validation-textarea';
import template from './template.hbs';
import './style.scss';


export default class Textarea extends BaseInput {
  constructor({
    el,
    componentName,
    maxLength,
    placeholder,
  }) {
    super({ el });

    this.componentName = componentName;
    this.maxLength = maxLength;
    this.render({ componentName, placeholder });
    this.elements.input = document.querySelector(`[data-component="textarea-${componentName}"]`);
  }

  render({ componentName, placeholder }) {
    this.el.innerHTML = template({ componentName, placeholder });
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

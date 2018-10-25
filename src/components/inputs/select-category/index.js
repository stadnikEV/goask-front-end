import BaseInput from 'components/__shared/base-input';
// import 'components/__shared/base-input/style.scss'; // css
import template from './template.hbs'; // template


export default class Select extends BaseInput {
  constructor({ el, componentName }) {
    super({ el });

    this.componentName = componentName;
    this.render({ componentName });
    this.elements.input = document.querySelector(`[data-component="select-${componentName}"]`);
  }

  render({ componentName }) {
    this.el.innerHTML = template({ componentName });
  }

  validation() {
    if (this.elements.input.value) {
      this.backlightValid({ isValid: true });
      return {
        message: null,
        isValid: true,
      };
    }
    this.backlightValid({ isValid: false });
    return {
      message: 'Выберете категорию',
      isValid: false,
    };
  }
}

import BaseInput from 'components/__shared/base-input';
// import 'components/__shared/base-input/style.scss'; // css
import template from './template.hbs'; // template


export default class Select extends BaseInput {
  constructor({
    el,
    componentName,
    disableFirst,
    categories,
  }) {
    super({ el });

    categories.disableFirst = disableFirst;
    categories.componentName = componentName;

    this.componentName = componentName;

    this.render({ categories });
    this.elements.input = document.querySelector(`[data-component="select-${this.componentName}"]`);
  }

  render({ categories }) {
    this.el.innerHTML = template(categories);
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

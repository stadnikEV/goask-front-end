import PubSub from 'pubsub-js';
import BaseInput from 'components/__shared/base-input';
import 'components/__shared/base-input/style.scss'; // css
import template from './template.hbs'; // template


export default class Select extends BaseInput {
  constructor({
    el,
    componentName,
    categories,
    eventName,
  }) {
    super({ el });

    categories.componentName = componentName;

    this.componentName = componentName;

    this.render({ categories });
    this.elements.input = document.querySelector(`[data-component="select-${this.componentName}"]`);

    if (eventName) {
      this.eventName = eventName;
      this.onChange = this.onChange.bind(this);
      this.addEvents();
    }
  }

  render({ categories }) {
    this.el.innerHTML = template(categories);
  }

  addEvents() {
    this.elements.input.addEventListener('change', this.onChange);
  }

  removeEvents() {
    this.elements.input.removeEventListener('change', this.onChange);
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

  onChange() {
    PubSub.publish(this.eventName, {
      category: this.elements.input.value,
    });
  }
}

import BaseInput from 'components/__shared/base-input';
import getTruncateText from 'utils/get-truncate-text';
import 'components/__shared/base-input/style.scss';
import template from './template.hbs';
import './style.scss';


export default class TextareaTrim extends BaseInput {
  constructor({
    el,
    componentName,
    value,
  }) {
    super({ el });

    if (value) {
      this.componentName = componentName;
      this.render({ componentName, value });
    }

    this.elements.input = document.querySelector(`[data-component="textarea-trim-${componentName}"]`);
    this.str = this.elements.input.value;


    this.elements.input.value = getTruncateText({
      el: this.elements.input,
    });

    this.onResize = this.onResize.bind(this);
    this.addEvents();
  }

  render({ componentName, value }) {
    this.el.innerHTML = template({ componentName, value });
  }

  addEvents() {
    window.addEventListener('resize', this.onResize);
  }

  removeEvents() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    this.elements.input.value = this.str;

    this.elements.input.value = getTruncateText({
      el: this.elements.input,
    });
  }
}

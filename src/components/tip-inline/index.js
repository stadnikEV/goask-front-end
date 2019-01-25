import BaseComponent from 'components/__shared/base-component';
import 'components/tip-inline/style.scss'; // css
import template from './template.hbs'; // template


export default class TipInline extends BaseComponent {
  constructor({
    el,
    componentName,
    message,
    classModifier,
    color,
  }) {
    super({ el });

    this.render({ componentName, classModifier });
    this.elements.TipInline = document.querySelector(`[data-component="tip-inline-${componentName}"]`);

    if (message) {
      this.showTip({ color, message });
    }
  }

  render(options) {
    this.el.innerHTML = template(options);
  }

  showTip({ color, message }) {
    this.elements.TipInline.classList.remove('tip-inline_color-green');
    this.elements.TipInline.classList.remove('tip-inline_color-black');

    this.elements.TipInline.innerHTML = message;

    if (color === 'green') {
      this.elements.TipInline.classList.add('tip-inline_color-green');
    }
    if (color === 'black') {
      this.elements.TipInline.classList.add('tip-inline_color-black');
    }
  }
}

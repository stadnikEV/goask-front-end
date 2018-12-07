import BaseComponent from 'components/__shared/base-component';
import 'components/tip-inline/style.scss'; // css
import template from './template.hbs'; // template


export default class TipInline extends BaseComponent {
  constructor({ el, componentName }) {
    super({ el });

    this.render({ componentName });
    this.elements.TipInline = document.querySelector(`[data-component="tip-inline-${componentName}"]`);
  }

  render({ componentName }) {
    this.el.innerHTML = template({
      componentName,
    });
  }

  showTip({ color, message }) {
    this.elements.TipInline.classList.remove('tip-inline_color-green');

    this.elements.TipInline.innerHTML = message;

    if (color === 'green') {
      this.elements.TipInline.classList.add('tip-inline_color-green');
    }
  }
}

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

  showTip({ message }) {
    this.elements.TipInline.innerHTML = message;
  }
}

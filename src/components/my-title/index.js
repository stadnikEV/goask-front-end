import BaseComponent from 'components/__shared/base-component';
import './style.scss'; // css
import template from './template.hbs';


export default class MyQestionsTitle extends BaseComponent {
  constructor({ el, value }) {
    super({ el });

    this.render({ value });
  }

  render({ value }) {
    this.el.innerHTML = template({ value });
  }
}

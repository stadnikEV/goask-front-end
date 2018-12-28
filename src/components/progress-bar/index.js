import BaseComponent from 'components/__shared/base-component';
import './style.scss'; // css
import template from './template.hbs';


export default class ProgressBar extends BaseComponent {
  constructor({ el, value, max }) {
    super({ el });

    this.render({ value, max });

    this.elements.progressBar = el.querySelector('[data-component="progress-bar"]');
    this.elements.progress = this.elements.progressBar.querySelector('[data-element="progress-bar__progress"]');
  }

  render({ value, max }) {
    this.el.innerHTML = template({
      max,
      value,
    });
  }

  setValue({ value }) {
    this.elements.progress.setAttribute('value', value);
  }
}

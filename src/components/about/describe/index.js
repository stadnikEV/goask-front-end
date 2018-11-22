import BaseComponent from 'components/__shared/base-component';
import 'components/sessions/public-session-details/style.scss'; // css
import './style.scss'; // css
import template from './template.hbs';


export default class Describe extends BaseComponent {
  constructor({
    el,
    title,
    describe,
  }) {
    super({ el });

    this.render({ title, describe });
  }

  render({ title, describe }) {
    this.el.innerHTML = template({ title, describe });
  }
}

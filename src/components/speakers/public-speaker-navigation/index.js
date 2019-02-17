import BaseComponent from 'components/__shared/base-component';
import 'components/__shared/button/style.scss'; // css
import './style.scss'; // css


export default class PublicSpeakerNavigation extends BaseComponent {
  constructor({ el }) {
    super({ el });

    this.elements.item = this.el.querySelector('[data-component="public-speaker-list-item"]');
  }
}

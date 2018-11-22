import BaseComponent from 'components/__shared/base-component';
import './style.scss'; // css
import template from './template.hbs';


export default class SessionTitle extends BaseComponent {
  constructor({
    el,
    sessionTheme,
    speakerName,
    categoryName,
  }) {
    super({ el });

    this.render({ sessionTheme, speakerName, categoryName });
  }

  render({ sessionTheme, speakerName, categoryName }) {
    this.el.innerHTML = template({
      sessionTheme,
      speakerFirstname: speakerName[0],
      speakerLastname: speakerName[1],
      categoryName,
    });
  }
}

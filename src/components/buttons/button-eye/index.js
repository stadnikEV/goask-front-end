import BaseComponent from 'components/__shared/base-component';
import 'components/__shared/button/style.scss'; // css
import 'components/buttons/button-eye/style.scss'; // css
import eyeShowSrc from './img/eye-show.svg';
import eyeHideSrc from './img/eye-hide.svg';
import template from './template.hbs';


export default class ButtonEye extends BaseComponent {
  constructor({ el, componentName, clickHendler }) {
    super({ el });

    this.clickHendler = clickHendler;

    this.render({ componentName });
    this.elements.button = document.querySelector(`[data-component="${componentName}"]`);
    this.elements.imgShow = this.elements.button.querySelector(`[data-element="${componentName}__img-show"]`);
    this.elements.imgHide = this.elements.button.querySelector(`[data-element="${componentName}__img-hide"]`);

    this.onClick = this.onClick.bind(this);
    this.addEvents();
  }

  render({ componentName }) {
    this.el.innerHTML = template({
      componentName,
      imgShowUrl: eyeShowSrc,
      imgHideUrl: eyeHideSrc,
    });
  }

  addEvents() {
    this.elements.button.addEventListener('click', this.onClick);
    this.elements.button.onmousedown = () => false; // запрет outline при клике
  }

  removeEvents() {
    this.elements.button.removeEventListener('click', this.onClick);
    this.elements.button.onmousedown = null;
  }


  onClick() {
    if (!this.isPasswordShown) {
      this.isPasswordShown = true;
      this.showElem({ el: this.elements.imgHide });
      this.hideElem({ el: this.elements.imgShow });
      this.clickHendler({ isShown: true });
      return;
    }
    this.isPasswordShown = false;
    this.showElem({ el: this.elements.imgShow });
    this.hideElem({ el: this.elements.imgHide });
    this.clickHendler({ isShown: false });
  }
}

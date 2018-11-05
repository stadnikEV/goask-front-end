import PubSub from 'pubsub-js';
import ButtonNavigation from 'components/__shared/button/button-navigation';
import 'components/__shared/button/style.scss'; // css
import 'components/buttons/button-header/style.scss'; // css


export default class ButtonHeader extends ButtonNavigation {
  constructor({ el, componentName, eventName }) {
    super({ el, componentName });

    if (eventName) {
      this.elements.button = document.querySelector(`[data-component="${componentName}"]`);
      this.onButtonClick = this.onButtonClick.bind(this);
      this.eventName = eventName;
      this.addEvents();
    }
  }

  addEvents() {
    this.elements.button.addEventListener('click', this.onButtonClick);
  }

  removeEvents() {
    this.elements.buttonLogout.removeEventListener('click', this.onButtonClick);
  }

  onButtonClick() {
    console.log('click');
    PubSub.publish(this.eventName);
  }
}

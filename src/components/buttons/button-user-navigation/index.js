import ButtonNavigation from 'components/__shared/button/button-navigation';
import 'components/__shared/button/style.scss'; // css
import './style.scss'; // css


export default class ButtonHeader extends ButtonNavigation {
  constructor({ el, componentName }) {
    super({ el, componentName });
  }
}

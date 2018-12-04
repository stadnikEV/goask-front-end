import BaseButtonEvent from 'components/__shared/button/base-button-event';
import 'components/__shared/button/button-main/button-main.scss';


export default class ButtonMain extends BaseButtonEvent {
  constructor(options) {
    options.className = 'button-main';
    super(options);
  }
}

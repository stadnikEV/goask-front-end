import BaseComponent from 'components/__shared/base-component';
import './style.scss'; // css
import template from './template.hbs';


export default class SpeakerStatus extends BaseComponent {
  constructor({ el, status }) {
    super({ el });

    const statusData = this.getStatusData({ status });

    this.render(statusData);
  }

  getStatusData({ status }) {
    const statusData = {};

    if (status === undefined) {
      statusData.statusName = 'Ожидает подтверждения';
      statusData.modifierClassName = 'color-blue';
      return statusData;
    }
    if (status === true) {
      statusData.statusName = 'Активен';
      statusData.modifierClassName = 'color-green';
      return statusData;
    }
    if (status === false) {
      statusData.statusName = 'Заблокирован';
      statusData.modifierClassName = 'color-red';
      return statusData;
    }

    return null;
  }

  render({ statusName, modifierClassName }) {
    this.el.innerHTML = template({
      statusName,
      modifierClassName,
    });
  }
}

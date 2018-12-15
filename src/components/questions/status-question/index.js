import BaseComponent from 'components/__shared/base-component';
import './style.scss'; // css
import template from './template.hbs';


export default class StatusQuestion extends BaseComponent {
  constructor({ el, status }) {
    super({ el });

    const statusData = this.getStatusData({ status });

    this.render(statusData);
  }

  getStatusData({ status }) {
    const statusData = {};

    if (status === 'pending') {
      statusData.statusName = 'Ожидание';
      statusData.modifierClassName = 'color-blue';
      return statusData;
    }
    if (status === 'stream') {
      statusData.statusName = 'Запись видео';
      statusData.modifierClassName = 'color-blue';
      return statusData;
    }
    if (status === 'ready') {
      statusData.statusName = 'Готово';
      statusData.modifierClassName = 'color-green';
      return statusData;
    }
    if (status === 'decode') {
      statusData.statusName = 'Обработка видео';
      statusData.modifierClassName = 'color-blue';
      return statusData;
    }
    if (status === 'recorded') {
      statusData.statusName = 'Видео записано';
      statusData.modifierClassName = 'color-blue';
      return statusData;
    }
    if (status === 'reject') {
      statusData.statusName = 'Вопрос отклонен';
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

  setStatus({ status }) {
    const statusData = this.getStatusData({ status });
    this.render(statusData);
  }
}

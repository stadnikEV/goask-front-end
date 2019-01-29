import PubSub from 'pubsub-js';
import BaseComponent from 'components/__shared/base-component';
import ButtonMainEvent from 'components/buttons/button-main-event';
import StatusSpeaker from 'components/admin/admin-status-speaker';
import getTruncateText from 'utils/get-truncate-text';
import './style.scss'; // css
import template from './template.hbs';


export default class SpeakerListItem extends BaseComponent {
  constructor({ el, data }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.speakerId = data.speakerId;
    this.render(data);

    this.elements.speakerListItem = document.querySelector(`[data-component="speaker-list-item"][data-speakerId="${this.speakerId}"]`);
    this.elements.content = this.elements.speakerListItem.querySelector('[data-element="speaker-list-item__content"]');
    this.elements.statusSpeakerContainer = this.elements.speakerListItem.querySelector('[data-element="speaker-list-item__status-container"]');
    this.elements.about = this.elements.speakerListItem.querySelector('[data-element="speaker-list-item__about"]');
    this.elements.navigation = this.elements.speakerListItem.querySelector('[data-element="speaker-list-item__navigation-container"]');
    this.elements.buttonConfirmContainer = this.elements.speakerListItem.querySelector('[data-element="speaker-list-item__button-confirm-container"]');
    this.elements.buttonDetailsContainer = this.elements.speakerListItem.querySelector('[data-element="speaker-list-item__button-details-container"]');

    this.initButtonConfirm({ status: data.active });
    this.initButtonDetails();
    this.initStatusSpeaker({ status: data.active });

    const truncateDescribeText = this.getTruncateDescribeText();

    if (truncateDescribeText) {
      this.elements.about.innerHTML = truncateDescribeText;
    }

    this.onResize = this.onResize.bind(this);
    this.str = this.elements.about.textContent;

    this.addEvents();
  }

  render(data) {
    this.el.innerHTML = template({
      speakerId: data.speakerId,
      firstname: data.firstname,
      lastname: data.lastname,
      about: data.about,
      categories: data.categories,
    });
  }

  addEvents() {
    window.addEventListener('resize', this.onResize);
    this.eventsPubSub.changeSpeakerId = PubSub.subscribe(`change-speaker-status-${this.speakerId}`, this.onChangeSpeakerId.bind(this));
  }

  removeEvents() {
    window.removeEventListener('resize', this.onResize);
    this.unsubscribe();
  }

  initButtonDetails() {
    this.components.ButtonDetails = new ButtonMainEvent({
      el: this.elements.buttonDetailsContainer,
      modifierClassName: 'button-main__button_width-container button-main__button_color-gray',
      componentName: 'button-details',
      eventName: 'button-details',
      data: { speakerId: this.speakerId },
      value: 'Подробнее',
    });
  }

  initButtonConfirm({ status }) {
    let active = null;
    let value = null;

    if (status === undefined || status === false) {
      active = true;
      value = 'Активировать';
    }
    if (status === true) {
      active = false;
      value = 'Заблокировать';
    }

    this.components.buttonConfirm = new ButtonMainEvent({
      el: this.elements.buttonConfirmContainer,
      modifierClassName: 'button-main__button_width-container',
      componentName: 'button-confirm',
      eventName: 'button-confirm',
      data: {
        active,
        speakerId: this.speakerId,
        listItemComponent: this,
      },
      value,
    });
  }

  initStatusSpeaker({ status }) {
    this.components.statusSpeaker = new StatusSpeaker({
      el: this.elements.statusSpeakerContainer,
      componentName: 'status-speaker',
      status,
    });
  }

  getTruncateDescribeText() {
    const contentElemHeight = this.elements.content.clientHeight;
    const innerElementsHeight = this.elements.content.scrollHeight;
    const describeSessionHeight = this.elements.about.offsetHeight;

    if (contentElemHeight > innerElementsHeight) {
      return false;
    }
    const newDescribeSessionHeight = contentElemHeight - (innerElementsHeight - describeSessionHeight);

    return getTruncateText({
      el: this.elements.about,
      height: newDescribeSessionHeight,
      width: this.elements.about.clientWidth - this.elements.navigation.offsetWidth,
    });
  }

  onChangeSpeakerId(msg, { status }) {
    this.removeComponent({ componentName: 'buttonConfirm' });
    this.initButtonConfirm({ status });
    this.components.statusSpeaker.setStatus({ status });
  }

  onResize() {
    this.elements.about.innerHTML = this.str;
    const truncateQuestionText = this.getTruncateDescribeText();

    if (truncateQuestionText) {
      this.elements.about.innerHTML = truncateQuestionText;
    }
  }
}

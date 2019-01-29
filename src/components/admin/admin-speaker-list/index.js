import BaseComponent from 'components/__shared/base-component';
import SpeakerListItem from 'components/admin/admin-speaker-list-item';
import template from './template.hbs';


export default class AdminSpeakerList extends BaseComponent {
  constructor({ el, speakers }) {
    super({ el });
    this.components = {};

    this.createSprekerList({ speakers });
  }

  createSprekerList({ speakers }) {
    this.render({ speakers });
    this.elements.speakerList = document.querySelector('[data-component="speaker-list"]');
    this.initListItems({ speakers });
  }

  render({ speakers }) {
    this.el.innerHTML = template({ speakers });
  }


  initListItems({ speakers }) {
    speakers.forEach((item) => {
      const elemContainer = this.elements.speakerList.querySelector(`[data-speakerId="${item.speakerId}"][data-element="speaker-list__item-container"]`);
      this.initListItem({
        el: elemContainer,
        speakerId: item.speakerId,
        data: item,
      });
    });
  }

  initListItem({ el, speakerId, data }) {
    this.components[`speakerList${speakerId}`] = new SpeakerListItem({
      el,
      data,
    });
  }
}

import BaseComponent from 'components/__shared/base-component';
import PublicSpeakerListItem from 'components/speakers/public-speaker-list-item';


export default class PublicSpeakerList extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.elements.publicSpeakerList = document.querySelector('[data-component="public-speakers-list"]');
    const listItemContainerArr = this.elements.publicSpeakerList.querySelectorAll('[data-element="public-speakers-list__item-container"]');

    this.initItemComponents({ listItemContainerArr });
  }

  initItemComponents({ listItemContainerArr }) {
    listItemContainerArr.forEach((item) => {
      const speakerId = item.getAttribute('data-speakerId');
      this.elements[`listItemContainer${speakerId}`] = item;
      this.initListItemComponent({ speakerId });
    });
  }

  initListItemComponent({ speakerId }) {
    this.components[`listItem${speakerId}`] = new PublicSpeakerListItem({
      el: this.elements[`listItemContainer${speakerId}`],
    });
  }
}

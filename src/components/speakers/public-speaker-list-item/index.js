import BaseComponent from 'components/__shared/base-component';
import ButtonMainLink from 'components/buttons/button-main-link';
import TextareaTrim from 'components/inputs/textarea-trim';
import './style.scss';


export default class PublicListItem extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.elements.item = this.el.querySelector('[data-component="public-speaker-list-item"]');
    this.elements.content = this.elements.item.querySelector('[data-element="public-speaker-list-item__content"]');
    this.elements.contentHeader = this.elements.item.querySelector('[data-element="public-speaker-list-item__content-header"]');
    this.elements.describeSpeakerContainer = this.elements.item.querySelector('[data-element="public-speaker-list-item__describe-speaker-container"]');
    this.elements.navigation = this.elements.item.querySelector('[data-element="public-speaker-list-item__navigation"]');
    this.elements.buttonDetailsContainer = this.elements.item.querySelector('[data-element="public-speaker-list-item__button-speaker-details-container"]');

    this.elements.describeSpeakerContainer.classList.remove('hidden');

    this.elements.describeSpeakerContainer.style.height = `${this.getHeightDescribe()}px`;

    this.initDescribeSpeakerComponent();
    this.initButtonDetailsComponent();

    this.addEvents();
  }


  addEvents() {}

  removeEvents() {
    this.unsubscribe();
  }

  getHeightDescribe() {
    const navigationHeight = this.elements.navigation.clientHeight;
    const contentHeaderHeight = this.elements.contentHeader.clientHeight;
    return navigationHeight - contentHeaderHeight;
  }

  initDescribeSpeakerComponent() {
    this.components.DescribeSpeaker = new TextareaTrim({
      el: this.elements.describeSpeakerContainer,
      componentName: 'describe-speaker',
    });
  }

  initButtonDetailsComponent() {
    const speakerId = this.elements.buttonDetailsContainer.getAttribute('data-speakerId');

    this.components.ButtonDetails = new ButtonMainLink({
      el: this.elements.buttonDetailsContainer,
      componentName: `button-speaker-details-${speakerId}`,
    });
  }
}

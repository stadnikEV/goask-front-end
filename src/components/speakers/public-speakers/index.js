import PubSub from 'pubsub-js';
import httpRequest from 'utils/http-request.js';
import BaseComponent from 'components/__shared/base-component';
import PublicSpeakerList from 'components/speakers/public-speaker-list';
import PublicSpeakerSelect from 'components/inputs/select';
import PublicSpeakerNavigation from 'components/speakers/public-speaker-navigation';
import './style.scss'; // css


export default class PublicSessions extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.elements.publicSpeakers = document.querySelector('[data-component="public-speakers"]');
    this.elements.speakerSelectContainer = this.elements.publicSpeakers.querySelector('[data-element="public-speakers__select-container"]');
    this.elements.speakerListContainer = this.elements.publicSpeakers.querySelector('[data-element="public-speakers__list-container"]');
    this.elements.speakerNavigationContainer = this.elements.publicSpeakers.querySelector('[data-element="public-speakers__page-navigation-container"]');


    this.getCategoriesName()
      .then((categories) => {
        this.initPublicSpeakerSelect(categories);
      })
      .catch((e) => {
        console.warn(e);
      });

    this.initPublicSpeakerList();
    this.initPublicSpeakerNavigation();

    this.addEvents();
  }

  addEvents() {
    this.eventsPubSub.changeSelect = PubSub.subscribe('change-select', this.onChangeSelect.bind(this));
  }

  removeEvents() {
    this.unsubscribe();
  }

  initPublicSpeakerSelect(categories) {
    categories.categories.unshift({
      content: 'Все категории',
      value: 'all',
    });

    this.components.speakerSelect = new PublicSpeakerSelect({
      el: this.elements.speakerSelectContainer,
      componentName: 'category',
      disableFirst: true,
      categories: this.selectCategory(categories),
      eventName: 'change-select',
    });
  }

  initPublicSpeakerList() {
    this.components.speakerList = new PublicSpeakerList({
      el: this.elements.speakerListContainer,
    });
  }

  initPublicSpeakerNavigation() {
    this.components.speakerNavigation = new PublicSpeakerNavigation({
      el: this.elements.speakerNavigationContainer,
    });
  }

  getCategoriesName() {
    return httpRequest.get({
      url: '<%publicPathBackEnd%>/api/categories-name',
    });
  }

  selectCategory(categories) {
    const url = window.location.href;

    if (url.indexOf('category') === -1) {
      categories.categories[0].selected = 'selected';
      return categories;
    }

    for (let i = 0; i < categories.categories.length; i += 1) {
      if (url.indexOf(categories.categories[i].value) !== -1) {
        categories.categories[i].selected = 'selected';
        return categories;
      }
    }

    return categories;
  }

  onChangeSelect(msg, { category }) {
    if (category === 'all') {
      window.location.href = '<%publicPathBackEnd%>/public-speakers';
      return;
    }
    window.location.href = `<%publicPathBackEnd%>/public-speakers?category=${category}`;
  }
}

import PubSub from 'pubsub-js';
import httpRequest from 'utils/http-request.js';
import BaseComponent from 'components/__shared/base-component';
import PublicSessionList from 'components/sessions/public-session-list';
import PublicSessionSelect from 'components/inputs/select';
import PublicSessionNavigation from 'components/sessions/public-session-navigation';
import './style.scss'; // css


export default class PublicSessions extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.elements.publicSessions = document.querySelector('[data-component="public-sessions"]');
    this.elements.sessionSelectContainer = this.elements.publicSessions.querySelector('[data-element="public-sessions__select-container"]');
    this.elements.sessionListContainer = this.elements.publicSessions.querySelector('[data-element="public-sessions__list-container"]');
    this.elements.sessionNavigationContainer = this.elements.publicSessions.querySelector('[data-element="public-sessions__page-navigation-container"]');


    this.getCategoriesName()
      .then((categories) => {
        this.initPublicSessionSelect(categories);
      })
      .catch((e) => {
        console.warn(e);
      });

    this.initPublicSessionList();
    this.initPublicSessionNavigation();

    this.addEvents();
  }

  addEvents() {
    this.eventsPubSub.changeSelect = PubSub.subscribe('change-select', this.onChangeSelect.bind(this));
  }

  removeEvents() {
    this.unsubscribe();
  }

  initPublicSessionSelect(categories) {
    categories.categories.unshift({
      content: 'Все категории',
      value: 'all',
    });

    this.components.sessionSelect = new PublicSessionSelect({
      el: this.elements.sessionSelectContainer,
      componentName: 'category',
      disableFirst: true,
      categories: this.selectCategory(categories),
      eventName: 'change-select',
    });
  }

  initPublicSessionList() {
    this.components.sessionList = new PublicSessionList({
      el: this.elements.sessionListContainer,
    });
  }

  initPublicSessionNavigation() {
    this.components.sessionNavigation = new PublicSessionNavigation({
      el: this.elements.sessionNavigationContainer,
    });
  }

  getCategoriesName() {
    return httpRequest.get({
      url: '<%publicPathBackEnd%>/api/categories-name',
    });
  }

  selectCategory(categories) {
    const url = window.location.href;

    if (url.indexOf('public-sessions/') === -1) {
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
      window.location.href = '<%publicPathBackEnd%>/public-sessions';
      return;
    }
    window.location.href = `<%publicPathBackEnd%>/public-sessions/${category}`;
  }
}

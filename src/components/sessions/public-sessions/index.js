import BaseComponent from 'components/__shared/base-component';
import PublicSessionList from 'components/sessions/public-session-list';
import PublicSessionNavigation from 'components/sessions/public-session-navigation';
import './style.scss'; // css


export default class PublicSessions extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.elements.publicSessions = document.querySelector('[data-component="public-sessions"]');
    this.elements.publicListContainer = this.elements.publicSessions.querySelector('[data-element="public-sessions__list-container"]');
    this.elements.publicSessionNavigationContainer = this.elements.publicSessions.querySelector('[data-element="public-sessions__page-navigation-container"]');

    this.initPublicSessionList();
  }

  initPublicSessionList() {
    this.components.publicList = new PublicSessionList({
      el: this.elements.publicListContainer,
    });
  }

  initPublicSessionNavigation() {
    this.components.publicSessionNavigation = new PublicSessionNavigation({
      el: this.elements.publicListContainer,
    });
  }
}

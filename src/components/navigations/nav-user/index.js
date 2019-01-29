import BaseComponent from 'components/__shared/base-component';
import ButtonUserNavigation from 'components/buttons/button-user-nav';
import './style.scss'; // css


export default class UserNavigation extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.elements.userNavigation = el.querySelector('[data-component="user-navigation"]');
    this.elements.buttonSessionContainer = this.elements.userNavigation.querySelector('[data-element="user-navigation__button-sessions-container"]');
    this.elements.buttonRequestsContainer = this.elements.userNavigation.querySelector('[data-element="user-navigation__button-requests-container"]');
    this.elements.buttonQuestionsContainer = this.elements.userNavigation.querySelector('[data-element="user-navigation__button-questions-container"]');

    this.initButtonQuestions();

    if (this.elements.buttonSessionContainer) {
      this.initButtonSessions();
    }
    if (this.elements.buttonRequestsContainer) {
      this.initButtonRequests();
    }
  }

  initButtonQuestions() {
    this.components.buttonQuestions = new ButtonUserNavigation({
      el: this.elements.buttonQuestionsContainer,
      componentName: 'button-user-navigation-questions',
    });
  }

  initButtonSessions() {
    this.components.buttonSessions = new ButtonUserNavigation({
      el: this.elements.buttonSessionContainer,
      componentName: 'button-user-navigation-sessions',
    });
  }

  initButtonRequests() {
    this.components.buttonRequests = new ButtonUserNavigation({
      el: this.elements.buttonRequestsContainer,
      componentName: 'button-user-navigation-requests',
    });
  }
}

import PubSub from 'pubsub-js';
import BaseComponent from 'components/__shared/base-component';
import ButtonDefault from 'components/buttons/button-default';
import MySessionList from 'components/sessions/my-session-list';


import './style.scss'; // css
import template from './template.hbs';


export default class MySessions extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.render();

    this.elements.mySessions = document.querySelector('[data-component="my-sessions"]');
    this.elements.sessionListContainer = this.elements.mySessions.querySelector('[data-element="my-sessions__session-list-container"]');
    this.elements.ButtonGoToAddSessionContainer = this.elements.mySessions.querySelector('[data-element="my-sessions__button-go-to-add-session-container"]');
    this.elements.addSessionContainer = this.elements.mySessions.querySelector('[data-element="my-sessions__add-session-container"]');

    this.speakerId = this.getSpeakersId();

    this.initSessionList({ speakerId: this.speakerId });
    this.initButtonGoToAddSession();

    this.addEvents();
  }

  render() {
    this.el.innerHTML = template();
  }

  addEvents() {
    this.eventsPubSub.initAddSession = PubSub.subscribe('go-to-add-session', this.onGoToAddSession.bind(this));
    this.eventsPubSub.sessionAdded = PubSub.subscribe('session-added', this.onSessionAdded.bind(this));
    this.eventsPubSub.addSessionCancel = PubSub.subscribe('add-session-cancel', this.onAddSessionCancel.bind(this));
  }

  removeEvents() {
    this.unsubscribe();
  }

  getSpeakersId() {
    return this.el.getAttribute('data-speakerId');
  }

  initSessionList({ speakerId }) {
    this.components.mySessionList = new MySessionList({
      el: this.elements.sessionListContainer,
      speakerId,
    });
  }

  initButtonGoToAddSession() {
    this.components.ButtonGoToAddSession = new ButtonDefault({
      el: this.elements.ButtonGoToAddSessionContainer,
      className: 'button-go-to-add-session',
      componentName: 'button-go-to-add-session',
      eventName: 'go-to-add-session',
      value: 'Добавить новую сессию',
    });
  }

  onGoToAddSession() {
    this.components.mySessionList.hide();
    this.components.ButtonGoToAddSession.hide();
    if (this.components.addSession) {
      this.components.addSession.show();
      return;
    }
    import('components/sessions/add-session' /* webpackChunkName: "addSession" */)
      .then((Module) => {
        const AddSession = Module.default;
        this.components.addSession = new AddSession({
          el: this.elements.addSessionContainer,
          speakerId: this.speakerId,
        });
      })
      .catch((e) => {
        console.warn(e);
      });
  }

  onSessionAdded() {
    this.components.mySessionList.createSessionList()
      .then(() => {
        this.components.mySessionList.show();
        this.components.ButtonGoToAddSession.show();
        this.components.addSession.hide();
      })
      .catch((e) => {
        console.warn(e);
      });
  }

  onAddSessionCancel() {
    this.components.mySessionList.show();
    this.components.ButtonGoToAddSession.show();
    this.components.addSession.hide();
  }
}

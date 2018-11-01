import PubSub from 'pubsub-js';
import httpRequest from 'utils/http-request.js';
import BaseComponent from 'components/__shared/base-component';
import ButtonDefault from 'components/buttons/button-default';


import './style.scss'; // css
import template from './template.hbs';


export default class MySessionsList extends BaseComponent {
  constructor({ el, speakerId }) {
    super({ el });
    this.components = {};
    this.speakerId = speakerId;
    // this.eventsPubSub = {};

    this.initSessionData()
      .catch((e) => {
        console.warn(e);
      });

    //
    this.elements.mySessions = document.querySelector('[data-component="my-sessions"]');
    // this.elements.sessionListContainer = this.elements.mySessions.querySelector('[data-element="my-sessions__session-list-container"]');
    // this.elements.ButtonGoToAddSessionContainer = this.elements.mySessions.querySelector('[data-element="my-sessions__button-go-to-add-session-container"]');
    // this.elements.addSessionContainer = this.elements.mySessions.querySelector('[data-element="my-sessions__add-session-container"]');
    //
    // this.initSessionListContainer();
    // this.initButtonGoToAddSession();
    //
    // this.addEvents();
  }

  render({ sessions }) {
    this.el.innerHTML = template({ sessions });
  }

  addEvents() {
    this.eventsPubSub.initAddSession = PubSub.subscribe('go-to-add-session', this.onGoToAddSession.bind(this));
  }

  removeEvents() {
    this.unsubscribe();
  }

  getSessions({ speakerId }) {
    return httpRequest({
      url: `<%publicPathBackEnd%>/rest/speakers/${speakerId}/sessions`,
      method: 'get',
    });
  }

  // initSessionsListContainer() {
  //   this.components.mySessionsList = new MySessionList({
  //     el: this.elements.sessionListContainer,
  //   });
  // }

  initButtonGoToAddSession() {
    this.components.ButtonGoToAddSession = new ButtonDefault({
      el: this.elements.ButtonGoToAddSessionContainer,
      componentName: 'button-go-to-add-session',
      eventName: 'go-to-add-session',
      value: 'Добавить новую сессию',
    });
  }

  onGoToAddSession() {
    if (this.components.addSession) {
      this.components.addSession.show();
      return;
    }
    import('components/sessions/add-session' /* webpackChunkName: "addSession" */)
      .then((Module) => {
        const AddSession = Module.default;
        this.components.addSession = new AddSession({ el: this.elements.addSessionContainer });
        PubSub.unsubscribe(this.eventsPubSub.initAddSession);
      })
      .catch((e) => {
        console.warn(e);
      });
  }

  initSessionData() {
    const promise = new Promise((resolve, reject) => {
      this.getSessions({ speakerId: this.speakerId })
        .then((sessions) => {
          this.render({ sessions });
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
    return promise;
  }
}

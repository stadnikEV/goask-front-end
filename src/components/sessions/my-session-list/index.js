import PubSub from 'pubsub-js';
import httpRequest from 'utils/http-request.js';
import BaseComponent from 'components/__shared/base-component';
import MylistItem from 'components/sessions/my-list-item';

import './style.scss'; // css
import template from './template.hbs';


export default class MySessionsList extends BaseComponent {
  constructor({ el, speakerId }) {
    super({ el });
    this.components = {};
    this.speakerId = speakerId;
    this.eventsPubSub = {};

    this.createSessionList()
      .catch((e) => {
        console.warn(e);
      });


    // this.elements.sessionListContainer = this.elements.mySessions.querySelector('[data-element="my-sessions__session-list-container"]');

    // this.initSessionListContainer();
    // this.initButtonGoToAddSession();
    //
    this.addEvents();
  }

  render({ sessions }) {
    this.el.innerHTML = template({ sessions });
  }

  addEvents() {
    this.eventsPubSub.removeSession = PubSub.subscribe('remove-session', this.onRemoveSesion.bind(this));
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

  initListItems({ sessions }) {
    sessions.forEach((item) => {
      const elemContainer = this.elements.MySessionsList.querySelector(`[data-sessionId="${item.sessionId}"][data-element="my-sessions-list__item-container"]`);
      this.initcomponentListItem({
        el: elemContainer,
        sessionId: item.sessionId,
        data: item,
      });
    });
  }

  initcomponentListItem({ el, sessionId, data }) {
    this.components[`mylistItem${sessionId}`] = new MylistItem({
      el,
      data,
    });
  }

  createSessionList() {
    const promise = new Promise((resolve, reject) => {
      this.getSessions({ speakerId: this.speakerId })
        .then((sessions) => {
          this.render({ sessions });
          this.elements.MySessionsList = document.querySelector('[data-component="my-sessions-list"]');
          this.initListItems({ sessions });
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
    return promise;
  }

  onRemoveSesion(msg, sessionId) {
    this.components[`mylistItem${sessionId}`].destroy();
    this.components[`mylistItem${sessionId}`] = null;
    this.removeSessionFromDB({ sessionId })
      .then(() => {
        console.log('Сессия удалена');
      })
      .catch((e) => {
        console.warn(e);
      });
  }

  removeSessionFromDB({ sessionId }) {
    return httpRequest({
      url: `<%publicPathBackEnd%>/rest/sessions/${sessionId}/remove`,
      method: 'get',
    });
  }
}

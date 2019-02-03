import PubSub from 'pubsub-js';
import router from 'router';
import httpRequest from 'utils/http-request.js';
import BaseComponent from 'components/__shared/base-component';
import ListItem from 'components/admin/admin-session-list-item';

import './style.scss'; // css
import template from './template.hbs';


export default class SessionsList extends BaseComponent {
  constructor({ el, speakerId }) {
    super({ el });
    this.components = {};
    this.speakerId = speakerId;
    this.eventsPubSub = {};

    this.createSessionList()
      .then(() => {
        this.addEvents();
      })
      .catch((e) => {
        console.warn(e);
      });
  }

  render({ sessions }) {
    this.el.innerHTML = template({ sessions });
  }

  addEvents() {
    this.eventsPubSub.detailsSession = PubSub.subscribe('button-details', this.onDetailsSession.bind(this));
  }

  removeEvents() {
    this.unsubscribe();
  }

  getSessions({ speakerId }) {
    return httpRequest.get({
      url: `<%publicPathBackEnd%>/api/speakers/${speakerId}/sessions`,
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
    this.components[`mylistItem${sessionId}`] = new ListItem({
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

  onDetailsSession(msg, { sessionId }) {
    router.setRouteHash({ routeHash: `sessions/${sessionId}/questions` });
  }
}

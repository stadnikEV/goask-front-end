import router from 'router';
// import httpRequest from 'utils/http-request.js';
import BaseComponent from 'components/__shared/base-component';
import StatusSpeaker from 'components/admin/admin-status-speaker';
import SessionList from 'components/admin/admin-session-list';
import './style.scss';
import template from './template.hbs';


export default class Questions extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.getQuestions()
      .then((data) => {
        this.render(data);
        this.elements.questions = document.querySelector('[data-component="questions"]');
        this.elements.statusSpeakerContainer = this.elements.aboutSpeaker.querySelector('[data-element="questions__status-container"]');
        this.elements.questionListContainer = this.elements.aboutSpeaker.querySelector('[data-element="questions__question-list-container"]');

        this.initStatusSpeaker({ status: data.active });
        this.initSessionList({ speakerId: data.speakerId });
      })
      .catch((err) => {
        if (err.status === 403) {
          router.setRouteHash({ routeHash: 'login' });
          return;
        }
        console.warn(err);
      });
  }

  render(data) {
    this.el.innerHTML = template(data);
  }

  getSessionId() {
    const hash = router.getRouteHash();
    return hash.match(/[0-9]+/);
  }

  initStatusSpeaker({ status }) {
    this.components.statusSpeaker = new StatusSpeaker({
      el: this.elements.statusSpeakerContainer,
      componentName: 'status-speaker',
      status,
    });
  }

  initSessionList({ speakerId }) {
    this.components.sessionList = new SessionList({
      el: this.elements.sessionsListContainer,
      speakerId,
    });
  }

  getQuestions() {
    const sessionId = this.getSessionId();
    console.log(sessionId);
    // return httpRequest.get({ url: `<%publicPathBackEnd%>/api/speakers/${speakerId}` });
  }
}

import router from 'router';
import httpRequest from 'utils/http-request.js';
import BaseComponent from 'components/__shared/base-component';
import StatusSpeaker from 'components/admin/admin-status-speaker';
import SessionList from 'components/admin/admin-session-list';
import './style.scss';
import template from './template.hbs';


export default class AboutSpeaker extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.getSpeakerDetails()
      .then((data) => {
        this.render(data);
        this.elements.aboutSpeaker = document.querySelector('[data-component="about-speaker"]');
        this.elements.statusSpeakerContainer = this.elements.aboutSpeaker.querySelector('[data-element="about-speaker__status-container"]');
        this.elements.sessionsListContainer = this.elements.aboutSpeaker.querySelector('[data-element="about-speaker__sessions-list-container"]');

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

  getSpeakerId() {
    const hash = router.getRouteHash();
    return hash.substring(14);
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

  getSpeakerDetails() {
    const speakerId = this.getSpeakerId();
    return httpRequest.get({ url: `<%publicPathBackEnd%>/api/speakers/${speakerId}` });
  }
}

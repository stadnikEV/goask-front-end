import PubSub from 'pubsub-js';
import router from 'router';
// import HttpError from 'utils/http-error.js';
import httpRequest from 'utils/http-request.js';
import BaseComponent from 'components/__shared/base-component';
import FormAskQuestion from 'components/forms/form-ask-question';
import './style.scss'; // css
import template from './template.hbs';


export default class AboutSpeaker extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.getSpeakerDetails()
      .then((data) => {
        console.log(data);
        // this.render(data);
        // this.elements.aboutSpeaker = document.querySelector('[data-component="about-speaker"]');
      })
      .catch((err) => {
        if (err.status === 403) {
          router.setRouteHash({ routeHash: 'login' });
          return;
        }
        console.warn(err);
      });

    // this.elements.formAskContainer = this.elements.sessionDetails.querySelector('[data-element="public-session-details__form-ask-question-container"]');
    // this.sessionId = this.elements.sessionDetails.getAttribute('data-sessionId');
    // this.initComponentFormAsk();
    // this.addEvents();
  }

  render() {
    this.el.innerHTML = template();
  }

  addEvents() {
    this.eventsPubSub.formAskQuestion = PubSub.subscribe('form-ask-question-data', this.onSendData.bind(this));
  }

  removeEvents() {
    this.unsubscribe();
  }

  getSpeakerId() {
    const hash = router.getRouteHash();
    return hash.substring(14);
  }

  initComponentFormAsk() {
    this.components.FormAskQuestion = new FormAskQuestion({
      el: this.elements.formAskContainer,
    });
  }

  getSpeakerDetails() {
    const speakerId = this.getSpeakerId();
    const url = [
      `<%publicPathBackEnd%>/api/speakers/${speakerId}`,
      '?speaker=firstname lastname about categories active',
      '&session=numberOfResponses',
    ].join('');

    return httpRequest.get({ url });
  }
}

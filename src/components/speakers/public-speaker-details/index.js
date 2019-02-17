import PubSub from 'pubsub-js';
import HttpError from 'utils/http-error.js';
import httpRequest from 'utils/http-request.js';
import BaseComponent from 'components/__shared/base-component';
import FormAskQuestion from 'components/forms/form-ask-question';
import './style.scss'; // css


export default class publicSessionsDetails extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.elements.sessionDetails = document.querySelector('[data-component="public-session-details"]');
    this.elements.formAskContainer = this.elements.sessionDetails.querySelector('[data-element="public-session-details__form-ask-question-container"]');

    this.sessionId = this.elements.sessionDetails.getAttribute('data-sessionId');

    this.initComponentFormAsk();

    this.addEvents();
  }

  addEvents() {
    this.eventsPubSub.formAskQuestion = PubSub.subscribe('form-ask-question-data', this.onSendData.bind(this));
  }

  removeEvents() {
    this.unsubscribe();
  }

  initComponentFormAsk() {
    this.components.FormAskQuestion = new FormAskQuestion({
      el: this.elements.formAskContainer,
    });
  }

  onSendData(msg, data) {
    data.sessionId = this.sessionId;
    httpRequest.post({
      url: '<%publicPathBackEnd%>/api/questions',
      options: { data },
    })
      .then((json) => {
        window.location.href = json.link;
      })
      .catch((err) => {
        this.components.FormAskQuestion.formEnable();
        if (err instanceof HttpError) {
          if (err.status === 403) {
            if (err.message === 'User is not authorized') {
              window.location.href = '<%publicPathBackEnd%>/login';
            }
            if (err.message === 'The question is yourself') {
              this.components.FormAskQuestion.tipHendler({
                isValid: false,
                message: 'Вы не можете задать вопрос самому себе',
                tipName: 'tipAsk',
              });
            }
          }
          if (err.status === 500) {
            console.log('ошибка на сторне сервера');
          }
        }
        console.warn(err);
      });
  }
}

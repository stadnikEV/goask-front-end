import PubSub from 'pubsub-js';
import httpRequest from 'utils/http-request.js';
import BaseComponent from 'components/__shared/base-component';
import FormAddSession from 'components/forms/form-add-session';
import './style.scss'; // css
import template from './template.hbs';


export default class AddSessions extends BaseComponent {
  constructor({ el, speakerId }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};
    this.speakerId = speakerId;

    this.render();

    this.elements.addSessions = document.querySelector('[data-component="add-sessions"]');
    this.elements.buttonAddSessionContainer = this.elements.addSessions.querySelector('[data-element="add-sessions__button-add-session-container"]');
    this.elements.formContainer = this.elements.addSessions.querySelector('[data-element="add-sessions__form-container"]');

    this.getCategoriesName({ speakerId })
      .then((categories) => {
        this.initFormAddSession({ categories });
      })
      .catch((e) => {
        console.warn(e);
      });


    this.addEvents();
  }

  render() {
    this.el.innerHTML = template();
  }

  addEvents() {
    this.eventsPubSub.goToAddSession = PubSub.subscribe('form-add-session-data', this.onSendData.bind(this));
  }

  removeEvents() {
    this.unsubscribe();
  }

  getCategoriesName({ speakerId }) {
    return httpRequest({
      url: `<%publicPathBackEnd%>/rest/speakers/${speakerId}/categories-name`,
      method: 'get',
    });
  }

  initFormAddSession({ categories }) {
    this.components.formAddSession = new FormAddSession({
      el: this.elements.formContainer,
      categories,
    });
  }

  onSendData(msg, data) {
    data.speakerId = this.speakerId;
    httpRequest({
      url: '<%publicPathBackEnd%>/rest/login',
      contentType: 'application/json',
      method: 'post',
      data,
    })
      .then(() => {
        console.log('ok');
      });
  }
}

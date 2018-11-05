import PubSub from 'pubsub-js';
import httpRequest from 'utils/http-request.js';
import HttpError from 'utils/http-error.js';
import BaseComponent from 'components/__shared/base-component';
import 'components/registration-speaker/style.scss'; // css
import FormCreateSpeaker from '../forms/form-create-speaker';
import template from './template.hbs';


export default class Login extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.render();
    this.elements.createSpeaker = document.querySelector('[data-component="create-speaker"]');
    this.elements.FormContainer = this.elements.createSpeaker.querySelector('[data-element="create-speaker__form-container"]');

    this.getCategoriesName()
      .then((categories) => {
        this.initComponentFormCreateSpeaker(categories);
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
    this.eventsPubSub.formCreateSpeaker = PubSub.subscribe('form-create-speaker-data', this.onSendData.bind(this));
  }

  removeEvents() {
    this.unsubscribe();
  }

  getCategoriesName() {
    return httpRequest.get({
      url: '<%publicPathBackEnd%>/api/categories-name',
    });
  }

  initComponentFormCreateSpeaker(categories) {
    this.components.formCreateSpeaker = new FormCreateSpeaker({
      el: this.elements.FormContainer,
      categories,
    });
  }

  onSendData(msg, data) {
    httpRequest.post({
      url: '<%publicPathBackEnd%>/api/registration-speaker',
      options: { data },
    })
      .then((json) => {
        const { link } = json;
        window.location.href = link;
      })
      .catch((err) => {
        this.components.formCreateSpeaker.formEnable();
        if (err instanceof HttpError) {
          if (err.status === 500) {
            console.log('ошибка на сторне сервера');
          }
        }
        console.warn(err);
      });
  }
}

import PubSub from 'pubsub-js';
import HttpError from 'utils/http-error.js';
import httpRequest from 'utils/http-request.js';
import BaseComponent from 'components/__shared/base-component';
import 'components/__shared/login-registration/style.scss'; // css
import FormRegistration from '../forms/form-registration';
import template from './template.hbs';


export default class Registration extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.render();
    this.elements.registration = document.querySelector('[data-component="registration"]');
    this.elements.FormContainer = this.elements.registration.querySelector('[data-element="registration__form-container"]');

    this.components.formRegistration = new FormRegistration({
      el: this.elements.FormContainer,
    });

    this.addEvents();
  }

  render() {
    this.el.innerHTML = template();
  }

  addEvents() {
    this.eventsPubSub.formRegistratioData = PubSub.subscribe('form-registration-data', this.onSendData.bind(this));
  }

  removeEvents() {
    this.unsubscribe();
  }

  onSendData(msg, data) {
    httpRequest.post({
      url: '<%publicPathBackEnd%>/api/registration',
      options: { data },
    })
      .then((json) => {
        const { link } = json;
        window.location.href = link;
      })
      .catch((err) => {
        this.components.formRegistration.formEnable();
        if (err instanceof HttpError) {
          if (err.status === 403) {
            this.components.formRegistration.tipHendler({
              isValid: false,
              message: 'email уже зарегистрирован',
              tipName: 'tipEmail',
            });
          }
          if (err.status === 500) {
            console.log('ошибка на сторне сервера');
          }
        }
        console.warn(err);
      });
  }
}

import PubSub from 'pubsub-js';
import HttpError from 'utils/http-error.js';
import httpRequest from 'utils/http-request.js';
import BaseComponent from 'components/__shared/base-component';
import 'components/__shared/login-registration/style.scss'; // css
import './style.scss';
import FormRegistration from '../forms/form-registration';
import TipInline from '../tip-inline';
import template from './template.hbs';


export default class Registration extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.render();
    this.elements.registration = document.querySelector('[data-component="registration"]');
    this.elements.mainContainer = this.elements.registration.querySelector('[data-element="registration__main-container"]');
    this.elements.formContainer = this.elements.registration.querySelector('[data-element="registration__form-container"]');
    this.elements.tipConfirmMessageContainer = this.elements.registration.querySelector('[data-element="registration__tip-confirm-message-container"]');

    this.initForm();

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

  initForm() {
    this.components.formRegistration = new FormRegistration({
      el: this.elements.formContainer,
    });
  }

  initTipConfirmMessage() {
    this.components.tipConfirmMessage = new TipInline({
      el: this.elements.tipConfirmMessageContainer,
      componentName: 'confirm-message',
      message: `На ваш почтовый ящик <a href="mailto:${this.data.email}">${this.data.email}</a> было отправлено письмо. Для завершения регистрации следуйте инструкциям в письме.`,
      color: 'black',
    });
    this.elements.mainContainer.classList.add('registration__main-container_width-wide');
  }

  onSendData(msg, data) {
    this.data = data;
    httpRequest.post({
      url: '<%publicPathBackEnd%>/api/registration',
      options: { data },
    })
      .then(() => {
        this.removeComponent({ componentName: 'formRegistration' });
        this.initTipConfirmMessage();
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

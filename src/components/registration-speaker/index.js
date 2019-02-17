import PubSub from 'pubsub-js';
import httpRequest from 'utils/http-request.js';
import HttpError from 'utils/http-error.js';
import BaseComponent from 'components/__shared/base-component';
import 'components/registration-speaker/style.scss';
import FormCreateSpeaker from '../forms/form-create-speaker';
import TipInline from '../tip-inline';
import template from './template.hbs';


export default class RegistrationSpeaker extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.render();
    this.elements.createSpeaker = document.querySelector('[data-component="create-speaker"]');
    this.elements.FormContainer = this.elements.createSpeaker.querySelector('[data-element="create-speaker__form-container"]');
    this.elements.mainContainer = this.elements.createSpeaker.querySelector('[data-element="create-speaker__main-container"]');

    this.login = this.isLogin();

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
      isLogin: this.login,
    });
  }

  isLogin() {
    const value = this.el.getAttribute('data-is-login');
    if (value === 'true') {
      return true;
    }
    return false;
  }

  initTipConfirmMessage() {
    const message = (!this.login)
      ? `На ваш почтовый ящик <a href="mailto:${this.data.email}">${this.data.email}</a> было отправлено письмо. Для завершения регистрации следуйте инструкциям в письме.`
      : 'Ваша заявка отправлена на рассмотрение модератором.';

    this.components.tipConfirmMessage = new TipInline({
      el: this.elements.mainContainer,
      componentName: 'confirm-message',
      message,
      color: 'black',
    });
    this.elements.mainContainer.classList.add('create-speaker__main-container_width-wide');
  }

  onSendData(msg, data) {
    this.data = data;
    const url = (this.login)
      ? '<%publicPathBackEnd%>/api/become-speaker'
      : '<%publicPathBackEnd%>/api/create-speaker';

    httpRequest.post({
      url,
      options: { data },
    })
      .then(() => {
        PubSub.publish('speaker-registered');
        this.removeComponent({ componentName: 'formCreateSpeaker' });
        this.initTipConfirmMessage();
      })
      .catch((err) => {
        this.components.formCreateSpeaker.formEnable();
        if (err instanceof HttpError) {
          if (err.status === 403 && err.message === 'email already exists') {
            this.components.formCreateSpeaker.tipHendler({
              isValid: false,
              message: 'email уже зарегистрирован',
              tipName: 'tipEmail',
            });

            return;
          }
          if (err.status === 403 && err.message === 'request entity too large') {
            this.components.formCreateSpeaker.tipHendler({
              isValid: false,
              message: 'Изображение слишком боьшое',
              tipName: 'tipAddAvatar',
            });

            return;
          }
          if (err.status === 400) {
            if (err.message === 'not correct email') {
              this.components.formCreateSpeaker.tipHendler({
                isValid: false,
                message: 'email не корректный',
                tipName: 'tipEmail',
              });
            }

            return;
          }
          if (err.status === 500) {
            console.log('server error');
          }
        }
        console.warn(err);
      });
  }
}

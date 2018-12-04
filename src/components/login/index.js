import PubSub from 'pubsub-js';
import HttpError from 'utils/http-error.js';
import httpRequest from 'utils/http-request.js';
import BaseComponent from 'components/__shared/base-component';
import 'components/__shared/login-registration/style.scss'; // css
import FormLogin from '../forms/form-login';
import template from './template.hbs';


export default class Login extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.render();
    this.elements.login = document.querySelector('[data-component="login"]');
    this.elements.formContainer = this.elements.login.querySelector('[data-element="login__form-container"]');

    this.components.formLogin = new FormLogin({
      el: this.elements.formContainer,
    });

    this.addEvents();
  }

  render() {
    this.el.innerHTML = template();
  }

  addEvents() {
    this.eventsPubSub.formRegistratioData = PubSub.subscribe('form-login-data', this.onSendData.bind(this));
  }

  removeEvents() {
    this.unsubscribe();
  }

  onSendData(msg, data) {
    httpRequest.post({
      url: '<%publicPathBackEnd%>/api/login',
      options: { data },
    })
      .then((json) => {
        const { link } = json;
        window.location.href = link;
      })
      .catch((err) => {
        this.components.formLogin.formEnable();
        if (err instanceof HttpError) {
          if (err.status === 403) {
            this.components.formLogin.tipHendler({
              isValid: false,
              message: 'Не верная почта или пароль',
              tipName: 'tipEmail',
            });
          }
          if (err.status === 500) {
            console.warn('ошибка на сторне сервера');
          }
        }
        console.warn(err);
      });
  }
}

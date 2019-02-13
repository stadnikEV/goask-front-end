import PubSub from 'pubsub-js';
import HttpError from 'utils/http-error.js';
import httpRequest from 'utils/http-request.js';
import router from 'router';
import BaseComponent from 'components/__shared/base-component';
import 'components/__shared/login-registration/style.scss';
import FormLoginAdmin from '../../forms/form-login-admin';
import template from './template.hbs';


export default class LoginAdmin extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.render();
    this.elements.login = document.querySelector('[data-component="login"]');
    this.elements.formContainer = this.elements.login.querySelector('[data-element="login__form-container"]');

    this.components.formLogin = new FormLoginAdmin({
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
      url: '<%publicPathBackEnd%>/api/login-admin',
      options: { data },
    })
      .then(() => {
        router.setRouteHash({ routeHash: 'speakers-confirm' });
      })
      .catch((err) => {
        this.components.formLogin.formEnable();
        if (err instanceof HttpError) {
          if (err.status === 403) {
            this.components.formLogin.tipHendler({
              isValid: false,
              message: 'Не верный логин или пароль',
              tipName: 'tipLogin',
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

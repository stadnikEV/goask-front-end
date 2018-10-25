import PubSub from 'pubsub-js';
// import httpRequest from 'utils/http-request.js';
// import HttpError from 'utils/http-error.js';
import BaseComponent from 'components/__shared/base-component';
import 'components/create-speaker/style.scss'; // css
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

    this.components.formCreateSpeaker = new FormCreateSpeaker({
      el: this.elements.FormContainer,
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

  onSendData(msg, data) {
    console.log(data);
    // httpRequest({
    //   url: '<%publicPath%>/account-speaker-create',
    //   contentType: 'application/json',
    //   method: 'post',
    //   data,
    // })
    //   .then((json) => {
    //     const { link } = json;
    //     window.location.href = link;
    //   })
    //   .catch((err) => {
    //     this.components.formLogin.formEnable();
    //     if (err instanceof HttpError) {
    //       if (err.status === 403) {
    //         this.components.formLogin.tipHendler({
    //           isValid: false,
    //           message: 'Не верная почта или пароль',
    //           tipName: 'tipEmail',
    //         });
    //       }
    //       if (err.status === 500) {
    //         console.log('ошибка на сторне сервера');
    //       }
    //     }
    //     console.warn(err);
    //   });
  }
}

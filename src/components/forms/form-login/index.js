import PubSub from 'pubsub-js';
import BaseComponent from 'components/__shared/base-component';
import 'components/__shared/form/style.scss'; // css
import 'components/forms/form-login/style.scss'; // css
import TipInline from '../../tip-inline';
import template from './template.hbs'; // template
import ButtonSubmit from '../../buttons/button-submit';
import InputEmail from '../../inputs/input-email';
import InputPassword from '../../inputs/input-password';


export default class FormLogin extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.render();
    this.elements.form = document.querySelector('[data-component="form-login"]');
    this.elements.emailContainer = this.elements.form.querySelector('[data-element="form-login__email-container"]');
    this.elements.passwordContainer = this.elements.form.querySelector('[data-element="form-login__password-container"]');
    this.elements.tipEmailContainer = this.elements.form.querySelector('[data-element="form-login__tip-email-container"]');
    this.elements.tipPasswordContainer = this.elements.form.querySelector('[data-element="form-login__tip-password-container"]');
    this.elements.buttonSubmitContainer = this.elements.form.querySelector('[data-element="form-login__submit-container"]');

    this.initComponentInputEmail();
    this.initComponentInputPassword();
    this.initComponentTipEmail();
    this.initComponentTipPassword();
    this.initComponentButtonSubmit();

    this.onClick = this.onClick.bind(this);
    this.addEvents();
  }

  render() {
    this.el.innerHTML = template({
      publicPath: '<%publicPath%>',
    });
  }


  addEvents() {
    this.elements.form.addEventListener('click', this.onClick);
  }


  removeEvents() {
    this.elements.form.removeEventListener('click', this.onClick);
  }


  onClick(e) {
    const submit = e.target.closest('[data-component="button-submit-login"]');

    if (submit) {
      if (!this.elements.form.contains(submit)) {
        return;
      }
      e.preventDefault(); // запрещает срабатывание события "submit"

      if (this.inSendProcess) {
        return;
      }

      const emailStatus = this.components.inputEmail.validation();
      const passwordStatus = this.components.inputPassword.validation();

      this.tipHendler({
        isValid: emailStatus.isValid,
        message: emailStatus.message,
        tipName: 'tipEmail',
      });
      this.tipHendler({
        isValid: passwordStatus.isValid,
        message: passwordStatus.message,
        tipName: 'tipPassword',
      });

      this.setFocus({
        isValidEmail: emailStatus.isValid,
        isValidPassword: passwordStatus.isValid,
      });

      if (emailStatus.isValid
      && passwordStatus.isValid) {
        this.formDisable();
        PubSub.publish('form-login-data', {
          email: this.components.inputEmail.getData(),
          password: this.components.inputPassword.getData(),
        });
      }
    }
  }

  tipHendler({ isValid, message, tipName }) {
    if (isValid) {
      this.components[tipName].showTip({ message: '' });
      return;
    }
    this.components[tipName].showTip({ message });
  }


  setFocus({ isValidEmail, isValidPassword }) {
    if (!isValidEmail) {
      this.components.inputEmail.setFocus();
      return;
    }
    if (!isValidPassword) {
      this.components.inputPassword.setFocus();
      return;
    }
    document.activeElement.blur();
  }

  formDisable() {
    this.inSendProcess = true;
    this.components.inputEmail.disable();
    this.components.inputPassword.disable();
  }

  formEnable() {
    this.inSendProcess = false;
    this.components.inputEmail.enable();
    this.components.inputPassword.enable();
  }


  initComponentInputEmail() {
    this.components.inputEmail = new InputEmail({
      el: this.elements.emailContainer,
      componentName: 'email',
    });
  }


  initComponentInputPassword() {
    this.components.inputPassword = new InputPassword({
      el: this.elements.passwordContainer,
      componentName: 'password',
    });
  }


  initComponentTipEmail() {
    this.components.tipEmail = new TipInline({
      el: this.elements.tipEmailContainer,
      componentName: 'tip-inline-email',
    });
  }


  initComponentTipPassword() {
    this.components.tipPassword = new TipInline({
      el: this.elements.tipPasswordContainer,
      componentName: 'tip-inline-password',
    });
  }


  initComponentButtonSubmit() {
    this.components.buttonSubmit = new ButtonSubmit({
      el: this.elements.buttonSubmitContainer,
      componentName: 'button-submit-login',
      value: 'ВОЙТИ',
    });
  }
}

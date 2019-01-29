import PubSub from 'pubsub-js';
import BaseComponent from 'components/__shared/base-component';
import 'components/__shared/form/style.scss'; // css
import './style.scss'; // css
import TipInline from '../../tip-inline';
import template from './template.hbs'; // template
import ButtonSubmit from '../../buttons/button-submit';
import InputText from '../../inputs/input-text';
import InputPassword from '../../inputs/input-password';


export default class FormLoginAdmin extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.render();
    this.elements.form = document.querySelector('[data-component="form-login"]');
    this.elements.loginContainer = this.elements.form.querySelector('[data-element="form-login__login-container"]');
    this.elements.passwordContainer = this.elements.form.querySelector('[data-element="form-login__password-container"]');
    this.elements.tipLoginContainer = this.elements.form.querySelector('[data-element="form-login__tip-login-container"]');
    this.elements.tipPasswordContainer = this.elements.form.querySelector('[data-element="form-login__tip-password-container"]');
    this.elements.buttonSubmitContainer = this.elements.form.querySelector('[data-element="form-login__submit-container"]');

    this.initComponentInputLogin();
    this.initComponentInputPassword();
    this.initComponentTipLogin();
    this.initComponentTipPassword();
    this.initComponentButtonSubmit();

    this.onClick = this.onClick.bind(this);
    this.addEvents();
  }

  render() {
    this.el.innerHTML = template();
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

      const loginStatus = this.components.inputLogin.validation();
      const passwordStatus = this.components.inputPassword.validation();

      this.tipHendler({
        isValid: loginStatus.isValid,
        message: loginStatus.message,
        tipName: 'tipLogin',
      });
      this.tipHendler({
        isValid: passwordStatus.isValid,
        message: passwordStatus.message,
        tipName: 'tipPassword',
      });

      this.setFocus({
        isValidLogin: loginStatus.isValid,
        isValidPassword: passwordStatus.isValid,
      });

      if (loginStatus.isValid
      && passwordStatus.isValid) {
        this.formDisable();
        PubSub.publish('form-login-data', {
          login: this.components.inputLogin.getData(),
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


  setFocus({ isValidLogin, isValidPassword }) {
    if (!isValidLogin) {
      this.components.inputLogin.setFocus();
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
    this.components.inputLogin.disable();
    this.components.inputPassword.disable();
  }

  formEnable() {
    this.inSendProcess = false;
    this.components.inputLogin.enable();
    this.components.inputPassword.enable();
  }


  initComponentInputLogin() {
    this.components.inputLogin = new InputText({
      el: this.elements.loginContainer,
      componentName: 'login',
    });
  }


  initComponentInputPassword() {
    this.components.inputPassword = new InputPassword({
      el: this.elements.passwordContainer,
      componentName: 'password',
    });
  }


  initComponentTipLogin() {
    this.components.tipLogin = new TipInline({
      el: this.elements.tipLoginContainer,
      componentName: 'tip-inline-login',
      classModifier: 'tip-inline_font-smal',
    });
  }


  initComponentTipPassword() {
    this.components.tipPassword = new TipInline({
      el: this.elements.tipPasswordContainer,
      componentName: 'tip-inline-password',
      classModifier: 'tip-inline_font-smal',
    });
  }


  initComponentButtonSubmit() {
    this.components.buttonSubmit = new ButtonSubmit({
      el: this.elements.buttonSubmitContainer,
      className: 'button-main',
      componentName: 'button-submit-login',
      value: 'ВОЙТИ',
    });
  }
}

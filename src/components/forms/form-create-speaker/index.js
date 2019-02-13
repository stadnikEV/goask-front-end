import PubSub from 'pubsub-js';
import BaseComponent from 'components/__shared/base-component';
import SelectCategory from 'components/inputs/select';
import 'components/__shared/form/style.scss'; // css
import 'components/forms/form-create-speaker/style.scss'; // css
import getValidationMessage from './get-validation-message';
import TipInline from '../../tip-inline';
import template from './template.hbs'; // template
import ButtonSubmit from '../../buttons/button-submit';
import InputText from '../../inputs/input-text';
import Textarea from '../../inputs/textarea';
import InputEmail from '../../inputs/input-email';
import InputPassword from '../../inputs/input-password';


export default class FormCreateSpeaker extends BaseComponent {
  constructor({ el, categories, isLogin }) {
    super({ el });
    this.components = {};

    this.render({ notLogin: !isLogin });

    this.elements.form = document.querySelector('[data-component="form-create-speaker"]');
    this.elements.categoryContainer = this.elements.form.querySelector('[data-element="form-create-speaker__category-container"]');
    this.elements.firstnameContainer = this.elements.form.querySelector('[data-element="form-create-speaker__firstname-container"]');
    this.elements.lastnameContainer = this.elements.form.querySelector('[data-element="form-create-speaker__lastname-container"]');
    this.elements.aboutContainer = this.elements.form.querySelector('[data-element="form-create-speaker__about-container"]');

    this.elements.tipCategoryContainer = this.elements.form.querySelector('[data-element="form-create-speaker__tip-category-container"]');
    this.elements.tipFirstnameContainer = this.elements.form.querySelector('[data-element="form-create-speaker__tip-firstname-container"]');
    this.elements.tipLastnameContainer = this.elements.form.querySelector('[data-element="form-create-speaker__tip-lastname-container"]');
    this.elements.tipAboutContainer = this.elements.form.querySelector('[data-element="form-create-speaker__tip-about-container"]');

    this.elements.buttonSubmitContainer = this.elements.form.querySelector('[data-element="form-create-speaker__submit-container"]');

    this.initComponentInputFirstname();
    this.initComponentInputLastname();
    this.initComponentTextAbout();
    this.initComponentSelectCategory(categories);
    this.initComponentTipFirstname();
    this.initComponentTipLastname();
    this.initComponentTipAbout();
    this.initComponentTipCategory();
    this.initComponentButtonSubmit();

    this.isLogin = isLogin;

    if (!isLogin) {
      this.elements.emailContainer = this.elements.form.querySelector('[data-element="form-create-speaker__email-container"]');
      this.elements.passwordContainer = this.elements.form.querySelector('[data-element="form-create-speaker__password-container"]');
      this.elements.tipEmailContainer = this.elements.form.querySelector('[data-element="form-create-speaker__tip-email-container"]');
      this.elements.tipPasswordContainer = this.elements.form.querySelector('[data-element="form-create-speaker__tip-password-container"]');

      this.initComponentInputEmail();
      this.initComponentInputPassword();
      this.initComponentTipEmail();
      this.initComponentTipPassword();
    }

    this.onClick = this.onClick.bind(this);
    this.addEvents();
  }

  render({ notLogin }) {
    this.el.innerHTML = template({ notLogin });
  }


  addEvents() {
    this.elements.form.addEventListener('click', this.onClick);
  }


  removeEvents() {
    this.elements.form.removeEventListener('click', this.onClick);
  }

  onClick(e) {
    const submit = e.target.closest('[data-component="button-submit-create-speaker"]');

    if (submit) {
      if (!this.elements.form.contains(submit)) {
        return;
      }
      e.preventDefault(); // запрещает срабатывание события "submit"

      if (this.inSendProcess) {
        return;
      }

      const firstnameStatus = this.components.inputFirstname.validation();
      const lastnameStatus = this.components.inputLastname.validation();
      const aboutStatus = this.components.textAbout.validation();
      const categoryStatus = this.components.selectCategory.validation();

      let emailStatus = { isValid: true };
      let passwordStatus = { isValid: true };

      if (!this.isLogin) {
        emailStatus = this.components.inputEmail.validation();
        passwordStatus = this.components.inputPassword.validation();

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
      }


      this.tipHendler({
        isValid: firstnameStatus.isValid,
        message: getValidationMessage({ tipName: 'firstname', validationMessage: firstnameStatus.message }),
        tipName: 'tipFirstname',
      });
      this.tipHendler({
        isValid: lastnameStatus.isValid,
        message: getValidationMessage({ tipName: 'lastname', validationMessage: lastnameStatus.message }),
        tipName: 'tipLastname',
      });
      this.tipHendler({
        isValid: aboutStatus.isValid,
        message: getValidationMessage({ tipName: 'about', validationMessage: aboutStatus.message }),
        tipName: 'tipAbout',
      });
      this.tipHendler({
        isValid: categoryStatus.isValid,
        message: categoryStatus.message,
        tipName: 'tipCategory',
      });

      this.setFocus({
        isValidEmail: emailStatus.isValid,
        isValidPassword: passwordStatus.isValid,
        isValidFirstname: firstnameStatus.isValid,
        isValidLastname: lastnameStatus.isValid,
        isValidAbout: aboutStatus.isValid,
        isValidCategory: categoryStatus.isValid,
      });

      if (emailStatus.isValid
      && passwordStatus.isValid
      && firstnameStatus.isValid
      && lastnameStatus.isValid
      && aboutStatus.isValid
      && categoryStatus.isValid) {
        this.formDisable();
        const data = {
          firstname: this.components.inputFirstname.getData(),
          lastname: this.components.inputLastname.getData(),
          about: this.components.textAbout.getData(),
          category: this.components.selectCategory.getData(),
        };
        if (!this.isLogin) {
          data.email = this.components.inputEmail.getData();
          data.password = this.components.inputPassword.getData();
        }
        PubSub.publish('form-create-speaker-data', data);
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


  setFocus({
    isValidEmail,
    isValidPassword,
    isValidFirstname,
    isValidLastname,
    isValidAbout,
    isValidCategory,
  }) {
    if (!this.isLogin) {
      if (!isValidEmail) {
        this.components.inputEmail.setFocus();
        return;
      }
      if (!isValidPassword) {
        this.components.inputPassword.setFocus();
        return;
      }
    }
    if (!isValidFirstname) {
      this.components.inputFirstname.setFocus();
      return;
    }
    if (!isValidLastname) {
      this.components.inputLastname.setFocus();
      return;
    }
    if (!isValidAbout) {
      this.components.textAbout.setFocus();
      return;
    }
    if (!isValidCategory) {
      this.components.selectCategory.setFocus();
      return;
    }
    document.activeElement.blur();
  }

  formDisable() {
    this.inSendProcess = true;
    if (!this.isLogin) {
      this.components.inputEmail.disable();
      this.components.inputPassword.disable();
    }
    this.components.inputFirstname.disable();
    this.components.inputLastname.disable();
    this.components.textAbout.disable();
    this.components.selectCategory.disable();
  }

  formEnable() {
    this.inSendProcess = false;
    if (!this.isLogin) {
      this.components.inputEmail.enable();
      this.components.inputPassword.enable();
    }
    this.components.inputFirstname.enable();
    this.components.inputLastname.enable();
    this.components.textAbout.enable();
    this.components.selectCategory.enable();
  }


  initComponentInputFirstname() {
    this.components.inputFirstname = new InputText({
      el: this.elements.firstnameContainer,
      componentName: 'firstname',
      maxLength: 20,
    });
  }


  initComponentInputLastname() {
    this.components.inputLastname = new InputText({
      el: this.elements.lastnameContainer,
      componentName: 'lastname',
      maxLength: 20,
    });
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

  initComponentTextAbout() {
    this.components.textAbout = new Textarea({
      el: this.elements.aboutContainer,
      componentName: 'about',
      maxLength: 4000,
    });
  }

  initComponentSelectCategory(categories) {
    categories.categories.unshift({
      content: 'Выберите категорию',
      selected: 'selected',
      disabled: 'disabled',
    });
    this.components.selectCategory = new SelectCategory({
      el: this.elements.categoryContainer,
      componentName: 'category',
      disableFirst: true,
      categories,
    });
  }

  initComponentTipFirstname() {
    this.components.tipFirstname = new TipInline({
      el: this.elements.tipFirstnameContainer,
      componentName: 'tip-inline-firstname',
      classModifier: 'tip-inline_font-smal',
    });
  }

  initComponentTipLastname() {
    this.components.tipLastname = new TipInline({
      el: this.elements.tipLastnameContainer,
      componentName: 'tip-inline-lastname',
      classModifier: 'tip-inline_font-smal',
    });
  }

  initComponentTipEmail() {
    this.components.tipEmail = new TipInline({
      el: this.elements.tipEmailContainer,
      componentName: 'tip-inline-email',
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

  initComponentTipAbout() {
    this.components.tipAbout = new TipInline({
      el: this.elements.tipAboutContainer,
      componentName: 'tip-inline-about',
      classModifier: 'tip-inline_font-smal',
    });
  }

  initComponentTipCategory() {
    this.components.tipCategory = new TipInline({
      el: this.elements.tipCategoryContainer,
      componentName: 'tip-inline-category',
      classModifier: 'tip-inline_font-smal',
    });
  }


  initComponentButtonSubmit() {
    this.components.buttonSubmit = new ButtonSubmit({
      el: this.elements.buttonSubmitContainer,
      className: 'button-main',
      componentName: 'button-submit-create-speaker',
      value: 'Подать заявку',
    });
  }
}

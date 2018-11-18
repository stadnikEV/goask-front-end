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


export default class FormCreateSpeaker extends BaseComponent {
  constructor({ el, categories }) {
    super({ el });
    this.components = {};

    this.render();

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


      this.tipHendler({
        isValid: firstnameStatus.isValid,
        message: getValidationMessage({ tipName: 'firstname', validationMessage: firstnameStatus.message }),
        tipElem: this.components.tipFirstname,
      });
      this.tipHendler({
        isValid: lastnameStatus.isValid,
        message: getValidationMessage({ tipName: 'lastname', validationMessage: lastnameStatus.message }),
        tipElem: this.components.tipLastname,
      });
      this.tipHendler({
        isValid: aboutStatus.isValid,
        message: getValidationMessage({ tipName: 'about', validationMessage: aboutStatus.message }),
        tipElem: this.components.tipAbout,
      });
      this.tipHendler({
        isValid: categoryStatus.isValid,
        message: categoryStatus.message,
        tipElem: this.components.tipCategory,
      });

      this.setFocus({
        isValidFirstname: firstnameStatus.isValid,
        isValidLastname: lastnameStatus.isValid,
        isValidAbout: aboutStatus.isValid,
        isValidCategory: categoryStatus.isValid,
      });

      if (firstnameStatus.isValid
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
        PubSub.publish('form-create-speaker-data', data);
      }
    }
  }

  tipHendler({ isValid, message, tipElem }) {
    if (isValid) {
      tipElem.showTip({ message: '' });
      return;
    }

    tipElem.showTip({ message });
  }


  setFocus({
    isValidFirstname,
    isValidLastname,
    isValidAbout,
    isValidCategory,
  }) {
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
      console.log('focuse');
      this.components.selectCategory.setFocus();
      return;
    }
    document.activeElement.blur();
  }

  formDisable() {
    this.inSendProcess = true;
    this.components.inputFirstname.disable();
    this.components.inputLastname.disable();
    this.components.textAbout.disable();
    this.components.selectCategory.disable();
  }

  formEnable() {
    this.inSendProcess = false;
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
    });
  }

  initComponentTipLastname() {
    this.components.tipLastname = new TipInline({
      el: this.elements.tipLastnameContainer,
      componentName: 'tip-inline-lastname',
    });
  }

  initComponentTipAbout() {
    this.components.tipAbout = new TipInline({
      el: this.elements.tipAboutContainer,
      componentName: 'tip-inline-about',
    });
  }

  initComponentTipCategory() {
    this.components.tipCategory = new TipInline({
      el: this.elements.tipCategoryContainer,
      componentName: 'tip-inline-category',
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

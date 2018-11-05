import PubSub from 'pubsub-js';
import BaseComponent from 'components/__shared/base-component';
import SelectCategory from 'components/inputs/select';
import TipInline from 'components/tip-inline';
import Textarea from 'components/inputs/textarea';
import ButtonSubmit from 'components/buttons/button-submit';
import ButtonDefault from 'components/buttons/button-default';
import 'components/__shared/form/style.scss'; // css
import './style.scss'; // css
import getValidationMessage from './get-validation-message';
import template from './template.hbs'; // template


export default class FormAddSession extends BaseComponent {
  constructor({ el, categories }) {
    super({ el });
    this.components = {};

    this.render();

    this.elements.form = document.querySelector('[data-component="form-add-session"]');
    this.elements.categoryContainer = this.elements.form.querySelector('[data-element="form-add-session__category-container"]');
    this.elements.themeContainer = this.elements.form.querySelector('[data-element="form-add-session__theme-container"]');
    this.elements.describeSessionContainer = this.elements.form.querySelector('[data-element="form-add-session__describe-session-container"]');

    this.elements.tipCategoryContainer = this.elements.form.querySelector('[data-element="form-add-session__tip-category-container"]');
    this.elements.tipThemeContainer = this.elements.form.querySelector('[data-element="form-add-session__tip-theme-container"]');
    this.elements.tipDescribeSessionContainer = this.elements.form.querySelector('[data-element="form-add-session__tip-describe-session-container"]');

    this.elements.buttonSubmitContainer = this.elements.form.querySelector('[data-element="form-add-session__submit-container"]');
    this.elements.buttonCancelContainer = this.elements.form.querySelector('[data-element="form-add-session__button-cancel-container"]');


    this.initComponentInputTheme();
    this.initComponentInputDescribeSession();
    this.initComponentSelectCategory(categories);
    this.initComponentTipTheme();
    this.initComponentTipDescribeSession();
    this.initComponentTipCategory();
    this.initComponentButtonSubmit();
    this.initComponentButtonCancel();

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
    const submit = e.target.closest('[data-component="button-submit-add-session"]');

    if (!submit) {
      return;
    }
    if (!this.elements.form.contains(submit)) {
      return;
    }
    e.preventDefault(); // запрещает срабатывание события "submit"

    if (this.inSendProcess) {
      return;
    }

    const themeStatus = this.components.inputTheme.validation();
    const describeSessionStatus = this.components.inputDescribeSession.validation();

    this.tipHendler({
      isValid: themeStatus.isValid,
      message: getValidationMessage({ tipName: 'theme', validationMessage: themeStatus.message }),
      tipElem: this.components.tipTheme,
    });
    this.tipHendler({
      isValid: describeSessionStatus.isValid,
      message: getValidationMessage({ tipName: 'describe-session', validationMessage: describeSessionStatus.message }),
      tipElem: this.components.tipDescribeSession,
    });

    this.setFocus({
      isValidTheme: themeStatus.isValid,
      isValidDescribeSession: describeSessionStatus.isValid,
    });

    if (themeStatus.isValid
    && describeSessionStatus.isValid) {
      this.formDisable();
      const data = {
        theme: this.components.inputTheme.getData(),
        describeSession: this.components.inputDescribeSession.getData(),
        category: this.components.selectCategory.getData(),
      };
      PubSub.publish('form-add-session-data', data);
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
    isValidTheme,
    isValidDescribeSession,
  }) {
    if (!isValidTheme) {
      this.components.inputTheme.setFocus();
      return;
    }
    if (!isValidDescribeSession) {
      this.components.inputDescribeSession.setFocus();
      return;
    }
    document.activeElement.blur();
  }

  formDisable() {
    this.inSendProcess = true;
    this.components.inputTheme.disable();
    this.components.inputDescribeSession.disable();
    this.components.selectCategory.disable();
  }

  formEnable() {
    this.inSendProcess = false;
    this.components.inputTheme.enable();
    this.components.inputDescribeSession.enable();
    this.components.selectCategory.enable();
  }

  formClear() {
    this.components.inputTheme.clear();
    this.components.inputDescribeSession.clear();
  }


  initComponentInputTheme() {
    this.components.inputTheme = new Textarea({
      el: this.elements.themeContainer,
      componentName: 'theme',
      maxLength: 50,
    });
  }


  initComponentInputDescribeSession() {
    this.components.inputDescribeSession = new Textarea({
      el: this.elements.describeSessionContainer,
      componentName: 'describe-session',
      maxLength: 500,
    });
  }

  initComponentSelectCategory(categories) {
    this.components.selectCategory = new SelectCategory({
      el: this.elements.categoryContainer,
      componentName: 'category',
      categories,
    });
  }

  initComponentTipTheme() {
    this.components.tipTheme = new TipInline({
      el: this.elements.tipThemeContainer,
      componentName: 'tip-inline-theme',
    });
  }

  initComponentTipDescribeSession() {
    this.components.tipDescribeSession = new TipInline({
      el: this.elements.tipDescribeSessionContainer,
      componentName: 'tip-inline-describe-session',
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
      componentName: 'button-submit-add-session',
      value: 'Создать сессию',
    });
  }

  initComponentButtonCancel() {
    this.components.ButtonCancel = new ButtonDefault({
      el: this.elements.buttonCancelContainer,
      className: 'button-default_color-gray',
      componentName: 'add-session-cancel',
      eventName: 'add-session-cancel',
      value: 'Отмена',
    });
  }
}

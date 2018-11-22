import BaseComponent from 'components/__shared/base-component';
import MylistItem from 'components/requests/my-list-item';
import './style.scss'; // css
import template from './template.hbs';


export default class MyRequestList extends BaseComponent {
  constructor({ el, requests }) {
    super({ el });
    this.components = {};

    this.createRequestList({ requests });
  }

  createRequestList({ requests }) {
    this.render({ requests });
    this.elements.MyRequestsList = document.querySelector('[data-component="my-request-list"]');
    this.initListItems({ requests });
  }

  render({ requests }) {
    this.el.innerHTML = template({ requests });
  }


  initListItems({ requests }) {
    requests.forEach((item) => {
      const elemContainer = this.elements.MyRequestsList.querySelector(`[data-questionId="${item._id}"][data-element="my-request-list__item-container"]`);
      this.initcomponentListItem({
        el: elemContainer,
        questionId: item._id,
        data: item,
      });
    });
  }

  initcomponentListItem({ el, questionId, data }) {
    this.components[`mylistItem${questionId}`] = new MylistItem({
      el,
      data,
    });
  }
}

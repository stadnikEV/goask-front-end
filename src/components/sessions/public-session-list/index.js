import BaseComponent from 'components/__shared/base-component';
import PublicSessionListItem from 'components/sessions/public-session-list-item';


export default class PublicSessionList extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.elements.publicSessionList = document.querySelector('[data-component="public-sessions-list"]');
    const listItemContainerArr = this.elements.publicSessionList.querySelectorAll('[data-element="public-sessions-list__item-container"]');

    this.initItemComponents({ listItemContainerArr });
  }

  initItemComponents({ listItemContainerArr }) {
    listItemContainerArr.forEach((item) => {
      const sessionId = item.getAttribute('data-sessionId');
      this.elements[`listItemContainer${sessionId}`] = item;
      this.initListItemComponent({ sessionId });
    });
  }

  initListItemComponent({ sessionId }) {
    this.components[`listItem${sessionId}`] = new PublicSessionListItem({
      el: this.elements[`listItemContainer${sessionId}`],
    });
  }
}

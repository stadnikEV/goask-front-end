import BaseComponent from 'components/__shared/base-component';
import 'components/sessions/public-session-details/style.scss'; // css
import './style.scss'; // css
import template from './template.hbs';


export default class MyQuestionsDetails extends BaseComponent {
  constructor({ el, data }) {
    super({ el });

    this.question = data.question;
    this.render(data);

    // this.elements.myListItem = document.querySelector(`[data-component="my-list-item"][data-questionId="${data._id}"]`);
  }

  render(data) {
    this.el.innerHTML = template({
      theme: this.question.session.theme,
      category: data.categoryName,
      firstname: this.question.session.speaker.firstname,
      lastname: this.question.session.speaker.lastname,
      question: this.question.question,
      sessionDescribe: this.question.session.describeSession,
      speakerDescribe: this.question.session.speaker.about,
    });
  }
}

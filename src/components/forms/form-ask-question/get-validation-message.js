module.exports = ({ validationMessage }) => {
  let message = null;
  if (validationMessage === 'is empty') {
    message = 'Заполните поле';
  }
  if (validationMessage === 'max length') {
    message = 'Ваш вопрос не должен превышать 500 символов';
  }
  return message;
};

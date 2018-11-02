module.exports = ({ tipName, validationMessage }) => {
  let message = null;
  if (validationMessage === 'is empty') {
    if (tipName === 'theme') {
      message = 'Введите название сессии';
    }
    if (tipName === 'describe-session') {
      message = 'Введите описание сессии';
    }
  }
  if (validationMessage === 'max length') {
    if (tipName === 'theme') {
      message = 'Название сессии не должно превышать 50 символов';
    }
    if (tipName === 'describe-session') {
      message = 'Описание сессии не должно превышать 500 символов';
    }
  }
  return message;
};

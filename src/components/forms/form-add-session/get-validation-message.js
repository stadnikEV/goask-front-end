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
      message = 'Название сессии не должно превышать 20 символов';
    }
    if (tipName === 'lastname') {
      message = 'Описание сессии не должно превышать 20 символов';
    }
  }
  return message;
};

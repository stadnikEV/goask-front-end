module.exports = ({ tipName, validationMessage }) => {
  let message = null;
  if (validationMessage === 'is empty') {
    if (tipName === 'firstname') {
      message = 'Введите имя';
    }
    if (tipName === 'lastname') {
      message = 'Введите Фамилию';
    }
    if (tipName === 'about') {
      message = 'Заполните поле о себе';
    }
  }
  if (validationMessage === 'max length') {
    if (tipName === 'firstname') {
      message = 'Имя не должно превышать 20 символов';
    }
    if (tipName === 'lastname') {
      message = 'Фамилия не должна превышать 20 символов';
    }
    if (tipName === 'about') {
      message = 'Количество символов не должно превышать 4000 символов';
    }
  }
  return message;
};

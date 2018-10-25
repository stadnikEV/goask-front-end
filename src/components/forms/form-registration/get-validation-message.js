module.exports = ({ tipName, validationMessage }) => {
  let message = null;
  if (validationMessage === 'is empty') {
    if (tipName === 'firstname') {
      message = 'Введите имя';
    }
  }
  if (validationMessage === 'max length') {
    if (tipName === 'firstname') {
      message = 'Имя не должно превышать 20 символов';
    }
  }
  return message;
};

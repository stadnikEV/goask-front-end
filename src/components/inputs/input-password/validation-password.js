
export default ({ value }) => {
  if (value.length === 0) {
    return {
      message: 'Введите пароль',
      isValid: false,
    };
  }
  if (value.length !== 0 && value.length < 8) {
    return {
      message: 'Пароль не должен быть короче 8 символов',
      isValid: false,
    };
  }
  if (value.length > 100) {
    return {
      message: 'Пароль не должен превышать 100 символов',
      isValid: false,
    };
  }
  return {
    message: null,
    isValid: true,
  };
};

export default ({ value, maxLength }) => {
  if (value.length === 0) {
    return {
      message: 'Заполните поле',
      isValid: false,
    };
  }
  if (value.length > maxLength) {
    return {
      message: 'Превышена максимальная длина',
      isValid: false,
    };
  }
  return {
    message: null,
    isValid: true,
  };
};

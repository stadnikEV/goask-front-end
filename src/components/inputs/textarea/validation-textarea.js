export default ({ value, maxLength }) => {
  if (value.length === 0) {
    return {
      message: 'is empty',
      isValid: false,
    };
  }
  if (value.length > maxLength) {
    return {
      message: 'max length',
      isValid: false,
    };
  }
  return {
    message: null,
    isValid: true,
  };
};

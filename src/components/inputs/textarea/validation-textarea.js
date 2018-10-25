export default ({ value }) => {
  if (value.length === 0) {
    return {
      message: 'is empty',
      isValid: false,
    };
  }
  if (value.length > 4000) {
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

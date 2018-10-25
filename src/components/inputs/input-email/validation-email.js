import regEexpPatterns from 'components/__shared/base-input/pattern-reg-exp';

export default ({ value }) => {
  if (value.length === 0) {
    return {
      message: 'Введите почтовый адрес',
      isValid: false,
    };
  }
  if (value.search(regEexpPatterns.atOnlyOne) === -1) {
    return {
      message: 'Адрес должен содержать один символ "@"',
      isValid: false,
    };
  }
  if (value.search(regEexpPatterns.symbolsBeforeAt) === -1) {
    return {
      message: 'Заполните адрес до символа "@"',
      isValid: false,
    };
  }
  if (value.search(regEexpPatterns.symbolsAfterAt) === -1) {
    return {
      message: 'Заполните адрес после символа "@"',
      isValid: false,
    };
  }
  if (value.length > 254) {
    return {
      message: 'Адрес не должен превышать 254 символов',
      isValid: false,
    };
  }
  return {
    message: null,
    isValid: true,
  };
};

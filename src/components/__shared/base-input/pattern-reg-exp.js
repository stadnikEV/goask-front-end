export default {
  symbolsBeforeAt: new RegExp('^[^@].+$'),
  symbolsAfterAt: new RegExp('^.*@.+$'),
  atOnlyOne: new RegExp('^[^@]*@[^@]*$'),
};

export default (obj) => {
  const arr = Object.keys(obj);
  if (arr.length === 0) return true;
  return false;
};

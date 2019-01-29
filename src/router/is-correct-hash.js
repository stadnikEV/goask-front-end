import routeHashConfig from './route-hash-config';

export default ({ currentRouteHash }) => {
  const isCorrectHash = (referenceRouteHash) => {
    const regexp = new RegExp(referenceRouteHash);
    if (currentRouteHash.search(regexp) !== -1) {
      return true;
    }
    return false;
  };

  return routeHashConfig.some(isCorrectHash);
};

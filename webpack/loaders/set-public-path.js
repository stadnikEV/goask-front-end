// const fs = require('fs');
// const path = require('path');

module.exports = (source) => {
  const NODE_ENV = process.env.NODE_ENV || 'dev';

  const publicPathBackEnd = (NODE_ENV === 'dev')
    ? 'http://localhost:8080'
    : 'http://goask.club';

  const publicPathFrontEnd = (NODE_ENV === 'dev')
    ? 'http://localhost:3000'
    : 'http://goask.club';

  let result = source.replace(/<%publicPathBackEnd%>/g, publicPathBackEnd);
  result = result.replace(/<%publicPathFrontEnd%>/g, publicPathFrontEnd);

  return result;
};

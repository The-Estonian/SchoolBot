import replyAndClean from '../CleanAfter/replyAndClean.js';

const hasAuthorization = (message) => {
  if (!message.member.roles.cache.has('1292431434388340757')) {
    replyAndClean(message, 'Not Authorized!', 5000);
    return false;
  }
  return true;
};

export default hasAuthorization;

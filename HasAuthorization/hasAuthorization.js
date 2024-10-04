const hasAuthorization = (message) => {
  let hasAuthorization = ['552485072880533507'];
  if (!hasAuthorization.includes(message.author.id)) {
    message.reply('Not authorized!');
    return false;
  }
  return true;
};

export default hasAuthorization;

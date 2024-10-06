const replyAndClean = (incoming, reply, messageRemoveTimer) => {
  incoming.reply(reply).then((sentMessage) => {
    setTimeout(() => {
      sentMessage.delete();
      incoming.delete();
    }, messageRemoveTimer);
  });
};

export default replyAndClean;

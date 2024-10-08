const timer = 30000;

const replyAndClean = (incoming, reply) => {
  incoming.reply(reply).then((sentMessage) => {
    setTimeout(() => {
      sentMessage.delete();
      incoming.delete();
    }, timer);
  });
};

export default replyAndClean;

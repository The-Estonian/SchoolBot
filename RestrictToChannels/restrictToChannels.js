const restrictToChannels = (message) => {
  let channelList = ['1257316921565646878'];
  if (!channelList.includes(message.channel.id)) {
    return false;
  }
  return true;
};

export default restrictToChannels;

const restrictToChannels = (message) => {
  let channelList = [
    '1257316921565646878',
    '1292497677250072588',
    '1345136416140693576',
  ];
  if (!channelList.includes(message.channel.id)) {
    return false;
  }
  return true;
};

export default restrictToChannels;

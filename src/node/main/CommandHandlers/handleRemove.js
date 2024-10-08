const handleRemove = async (message) => {
  try {
    let messageAmount = parseInt(args.shift());
    if (messageAmount == undefined || isNaN(messageAmount)) {
      replyAndClean(
        message,
        'Please enter a number on how many messages to remove',
        timer
      );
      return;
    }
    if (messageAmount > 100) messageAmount = 100;
    await message.channel.bulkDelete(messageAmount + 1, true);
    replyAndClean(message, `Removed last ${messageAmount} messages!`, timer);
  } catch (error) {
    replyAndClean(message, 'Error removing rows', timer);
    logErrorToFile(error);
    console.log(error);
  }
};

export default handleRemove;

import replyAndClean from '../CleanAfter/replyAndClean.js';
import logErrorToFile from '../Logging/logError.js';

const handleRemove = async (message, args) => {
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
    replyAndClean(message, `Removed last ${messageAmount} messages!`);
  } catch (error) {
    replyAndClean(message, 'Error removing rows');
    logErrorToFile(error);
    console.log(error);
  }
};

export default handleRemove;

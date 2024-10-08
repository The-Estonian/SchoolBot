import logErrorToFile from '../ErrorLogging/logError.js';
import replyAndClean from '../CleanAfter/replyAndClean.js';
import getUserIdData from '../FetchData/getUserIdData.js';
import parseUserIdData from '../parsers/ParseUserIdData.js';

const handleUserId = async (message, args, token) => {
  let userId = args.shift();
  if (userId == undefined || isNaN(userId)) {
    replyAndClean(message, 'Please enter id to query!');
    return;
  }
  try {
    const data = await getUserIdData(token, userId);
    const response = parseUserIdData(data);
    replyAndClean(message, response);
  } catch (error) {
    replyAndClean(message, 'Invalid UserId provided.');
    console.error(error);
  }
};

export default handleUserId;

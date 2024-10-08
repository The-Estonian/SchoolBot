import logErrorToFile from '../ErrorLogging/logError.js';
import replyAndClean from '../CleanAfter/replyAndClean.js';
import getUserIdData from '../FetchData/getUserIdData.js';
import parseUserIdData from '../parsers/ParseUserIdData.js';

const handleUserId = async (message, args) => {
  let userId = args.shift();
  if (userId == undefined || isNaN(userId)) {
    replyAndClean(message, 'Please enter id to query!', timer);
    return;
  }
  try {
    const data = await getUserIdData(token, userId);
    const response = parseUserIdData(data);
    replyAndClean(message, response, timer);
  } catch (error) {
    replyAndClean(message, 'Invalid UserId provided.', timer);
    console.error(error);
  }
};

export default handleUserId;

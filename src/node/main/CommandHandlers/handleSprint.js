import logErrorToFile from '../ErrorLogging/logError.js';
import replyAndClean from '../CleanAfter/replyAndClean.js';
import parseSprintData from '../parsers/ParseSprintData.js';
import getSprintData from '../FetchData/getSprintData.js';

const handleSprint = async (message, args, token) => {
  let eventId = args.shift();
  if (eventId == undefined) {
    replyAndClean(message, 'Please enter a valid eventId!');
    return;
  }
  try {
    const data = await getSprintData(token, eventId);
    const response = parseSprintData(data);
    if (response.length > 0) {
      replyAndClean(message, response);
    } else {
      replyAndClean(message, 'Event not found!');
      return;
    }
  } catch (error) {
    replyAndClean(message, 'Invalid EventId provided.');
    console.error(error);
  }
};

export default handleSprint;

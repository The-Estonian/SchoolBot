import logErrorToFile from '../ErrorLogging/logError.js';
import replyAndClean from '../CleanAfter/replyAndClean.js';
import getUserLastName from '../FetchData/getUserLastName.js';
import parseUserLastNameData from '../parsers/ParseUserLastNameData.js';
import truncateForDiscord from '../Helpers/truncMessage.js';

const handleLastName = async (message, args, token) => {
  let lName = args.shift();
  if (lName == undefined) {
    replyAndClean(message, 'Please enter last name to Query', timer);
    return;
  }
  try {
    const data = await getUserLastName(token, lName);
    const response = parseUserLastNameData(data);
    replyAndClean(message, truncateForDiscord(response), timer);
  } catch (error) {
    replyAndClean(message, 'Failed, try !firstname or !lastname', timer);
    console.error(error);
  }
};

export default handleLastName;

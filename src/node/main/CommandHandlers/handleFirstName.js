import logErrorToFile from '../Logging/logError.js';
import replyAndClean from '../CleanAfter/replyAndClean.js';
import parseUserFirstNameData from '../parsers/ParseUserFirstNameData.js';
import getUserFirstName from '../FetchData/getUserFirstName.js';
import truncateForDiscord from '../Helpers/truncMessage.js';

const handleFirstName = async (message, args, token) => {
  let firstName = args.shift();
  let lastName = args.shift();
  if (firstName == undefined) {
    replyAndClean(message, 'Please enter a name to Query');
    return;
  }
  try {
    const data = await getUserFirstName(token, firstName, lastName);
    const response = parseUserFirstNameData(data);
    replyAndClean(message, truncateForDiscord(response));
  } catch (error) {
    replyAndClean(message, `Failed, maybe try !lastname`);
    console.error(error);
  }
};

export default handleFirstName;

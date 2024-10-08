import logErrorToFile from '../ErrorLogging/logError.js';
import replyAndClean from '../CleanAfter/replyAndClean.js';
import parseUserFirstNameData from '../parsers/ParseUserFirstNameData.js';
import getUserFirstName from '../FetchData/getUserFirstName.js';
import truncateForDiscord from '../Helpers/truncMessage.js';

const handleFirstName = async (message, args, token) => {
  let firstName = args.shift();
  let lastName = args.shift();
  if (firstName == undefined) {
    replyAndClean(message, 'Please enter a name to Query', timer);
    return;
  }
  try {
    const data = await getUserFirstName(token, firstName, lastName);
    const response = parseUserFirstNameData(data);
    replyAndClean(message, truncateForDiscord(response), timer);
  } catch (error) {
    replyAndClean(message, `Failed, maybe try !lastname`, timer);
    console.error(error);
  }
};

export default handleFirstName;

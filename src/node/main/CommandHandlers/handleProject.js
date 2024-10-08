import logErrorToFile from '../ErrorLogging/logError.js';
import replyAndClean from '../CleanAfter/replyAndClean.js';
import getProjectInfo from '../FetchData/getProjectInfo.js';
import parseProjectInfo from '../parsers/ParseProjectInfo.js';

const handleProject = async (message, args) => {
  let projectName = args.shift();
  if (projectName == undefined) {
    replyAndClean(message, 'Please enter project name!', timer);
    return;
  }
  try {
    const data = await getProjectInfo();
    const response = parseProjectInfo(data, projectName);
    replyAndClean(message, response, timer);
  } catch (error) {
    replyAndClean(message, 'Wrong project name!', timer);
    console.log(error);
  }
};

export default handleProject;

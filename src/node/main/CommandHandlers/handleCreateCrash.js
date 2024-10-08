import { logErrorToFile } from '../Logging/logError.js';
import replyAndClean from '../CleanAfter/replyAndClean.js';

const handleCreateCrash = async (message) => {
  try {
    console.log('Throwing Error!');
    throw new Error('This is a simulated crash error!');
  } catch (error) {
    replyAndClean(message, 'This is a simulated crash error!');
    replyAndClean(message, 'Sending data to S3 error.log container...');
    logErrorToFile(error);
    console.log(error);
  }
};

export default handleCreateCrash;

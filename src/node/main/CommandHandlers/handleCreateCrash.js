import logErrorToFile from '../ErrorLogging/logError.js';
import replyAndClean from '../CleanAfter/replyAndClean.js';

const handleCreateCrash = async (message) => {
  try {
    console.log('Throwing Error!');
    throw new Error('This is a simulated crash error!');
  } catch (error) {
    replyAndClean(message, 'This is a simulated crash error!', timer);
    replyAndClean(message, 'Sending data to S3 error.log container...', timer);
    logErrorToFile(error);
    console.log(error);
  }
};

export default handleCreateCrash;

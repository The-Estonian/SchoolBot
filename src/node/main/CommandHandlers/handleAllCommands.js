import dotenv from 'dotenv';
dotenv.config();

import helpInfo from '../Helpers/helpInfo.js';
import replyAndClean from '../CleanAfter/replyAndClean.js';
import handleRemove from './handleRemove.js';
import handleCreateCrash from './handleCreateCrash.js';
import handleSprint from './handleSprint.js';
import handleUserId from './handleUserId.js';
import handleFirstName from './handleFirstName.js';
import handleLastName from './handleLastName.js';
import handleProject from './handleProject.js';
import fetchToken from '../AuthToken/authToken.js';
import { commandLogging } from '../Logging/logError.js';

// init token and constants
const token = await fetchToken();

const handleAllCommands = (message) => {
  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  commandLogging(message.author.id, command);
  switch (command) {
    // Remove x amount of messages from channel
    case 'remove':
      if (message.author.id != '552485072880533507') return;
      handleRemove(message, args);
      break;

    // Create an error to test server crash logging to AWS S3 bucket
    case 'crash':
      if (message.author.id != '552485072880533507') return;
      handleCreateCrash(message);
      break;

    // sprint
    case 'sprint':
      handleSprint(message, args, token);
      break;

    case 'userid':
      handleUserId(message, args, token);
      break;

    // first name
    case 'firstname':
      handleFirstName(message, args, token);
      break;

    // last name
    case 'lastname':
      handleLastName(message, args, token);
      break;

    // project
    case 'project':
      handleProject(message, args);
      break;

    // kiitus
    case 'kiitus':
      let name = args.shift();
      let kiitus = `
${name} sa oled nii tubli! ;)`;
      replyAndClean(message, `\`\`\`${kiitus}\`\`\``);
      break;

    // help
    case 'help':
      replyAndClean(message, `\`\`\`${helpInfo()}\`\`\``);
      break;
  }
};

export default handleAllCommands;

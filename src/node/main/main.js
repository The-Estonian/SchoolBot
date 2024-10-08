import dotenv from 'dotenv';
import { Client } from 'discord.js';
dotenv.config();

import hasAuthorization from './HasAuthorization/hasAuthorization.js';
import restrictToChannels from './RestrictToChannels/restrictToChannels.js';
import fetchToken from './AuthToken/authToken.js';
import helpInfo from './Helpers/helpInfo.js';
import replyAndClean from './CleanAfter/replyAndClean.js';
import logErrorToFile from './ErrorLogging/logError.js';
import handleRemove from './CommandHandlers/handleRemove.js';
import handleCreateCrash from './CommandHandlers/handleCreateCrash.js';
import handleSprint from './CommandHandlers/handleSprint.js';
import handleUserId from './CommandHandlers/handleUserId.js';
import handleFirstName from './CommandHandlers/handleFirstName.js';
import handleLastName from './CommandHandlers/handleLastName.js';
import handleProject from './CommandHandlers/handleProject.js';

// init token and constants
const token = await fetchToken();

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  logErrorToFile(error).catch((err) =>
    console.error('Failed to log error:', err)
  );
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  logErrorToFile(reason).catch((err) =>
    console.error('Failed to log error:', err)
  );
});

// bot
const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'MessageContent'],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const channel = client.channels.cache.get('1257316921565646878');
  channel.send(
    `\`\`\`Social-Manager updated to version: ${
      process.env.GIT_COMMIT || 'Failed to fetch version.'
    }\`\`\``
  );
});

client.on('messageCreate', async (message) => {
  // restrictions, bot, channel, command, user:
  if (message.author.bot) return;
  // if (!restrictToChannels(message)) return;
  if (!message.content.startsWith('!')) return;
  if (!hasAuthorization(message)) return;

  // command list
  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  switch (command) {
    // Remove x amount of messages from channel
    case 'remove':
      handleRemove(message, args);
      break;

    // Create an error to test server crash logging to AWS S3 bucket
    case 'crash':
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
});

client.login(process.env.DISCORD_TOKEN);

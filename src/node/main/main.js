import dotenv from 'dotenv';
import { Client } from 'discord.js';
import { exec } from 'child_process';
dotenv.config();

import hasAuthorization from './HasAuthorization/hasAuthorization.js';
import restrictToChannels from './RestrictToChannels/restrictToChannels.js';
import fetchToken from './AuthToken/authToken.js';
import getSprintData from './FetchData/getSprintData.js';
import getUserIdData from './FetchData/getUserIdData.js';
import getUserFirstName from './FetchData/getUserFirstName.js';
import getUserLastName from './FetchData/getUserLastName.js';
import truncateForDiscord from './Helpers/truncMessage.js';
import parseUserFirstNameData from './parsers/ParseUserFirstNameData.js';
import parseUserIdData from './parsers/ParseUserIdData.js';
import parseProjectInfo from './parsers/ParseProjectInfo.js';
import parseSprintData from './parsers/ParseSprintData.js';
import parseUserLastNameData from './parsers/ParseUserLastNameData.js';
import helpInfo from './Helpers/helpInfo.js';
import replyAndClean from './CleanAfter/replyAndClean.js';
import logErrorToFile from './ErrorLogging/logError.js';

// init token and constants
const token = await fetchToken();
const timer = 30000;

const getProjectInfo = async () => {
  const response = await fetch('https://01.kood.tech/api/object/johvi', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
};

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

  // get git hash
  exec('git rev-parse HEAD', (err, stdout, stderr) => {
    if (err) {
      // If there's an error, log it and send an error message to the channel
      console.error(`Error fetching Git commit hash: ${err}`);
      channel.send('Error fetching Git commit hash.');
      return;
    }
    const commitHash = stdout.trim();
    channel.send(`Social-Manager updated to version ${commitHash}`);
  });
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
    case 'remove':
      try {
        let messageAmount = parseInt(args.shift());
        if (messageAmount == undefined || isNaN(messageAmount)) {
          replyAndClean(
            message,
            'Please enter a number on how many messages to remove',
            timer
          );
          break;
        }
        if (messageAmount > 100) messageAmount = 100;
        await message.channel.bulkDelete(messageAmount + 1, true);
        replyAndClean(
          message,
          `Removed last ${messageAmount} messages!`,
          timer
        );
      } catch (error) {
        replyAndClean(message, 'Error removing rows', timer);
        logErrorToFile(error);
        console.log(error);
      }
      break;

    // Create an error to test server crash logging to AWS S3 bucket
    case 'crash':
      try {
        // smth that crashes
        console.log('Throwing Error!');
        throw new Error('This is a simulated crash error!');
      } catch (error) {
        replyAndClean(message, 'This is a simulated crash error!', timer);
        replyAndClean(
          message,
          'Sending data to S3 error.log container...',
          timer
        );
        logErrorToFile(error);
        console.log(error);
      }
      break;
    // sprint
    case 'sprint':
      let eventId = args.shift();
      if (eventId == undefined) {
        replyAndClean(message, 'Please enter a valid eventId!', timer);
        break;
      }
      try {
        const data = await getSprintData(token, eventId);
        const response = parseSprintData(data);
        if (response.length > 0) {
          replyAndClean(message, response, timer);
        } else {
          replyAndClean(message, 'Event not found!', timer);
          break;
        }
      } catch (error) {
        replyAndClean(message, 'Invalid EventId provided.', timer);
        console.error(error);
      }
      break;

    case 'userid':
      let userId = args.shift();
      if (userId == undefined || isNaN(userId)) {
        replyAndClean(message, 'Please enter id to query!', timer);
        break;
      }
      try {
        const data = await getUserIdData(token, userId);
        const response = parseUserIdData(data);
        replyAndClean(message, response, timer);
      } catch (error) {
        replyAndClean(message, 'Invalid UserId provided.', timer);
        console.error(error);
      }
      break;

    // first name
    case 'firstname':
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
      break;

    // last name
    case 'lastname':
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
      break;

    // project
    case 'project':
      let projectName = args.shift();
      if (projectName == undefined) {
        replyAndClean(message, 'Please enter project name!', timer);
        break;
      }
      try {
        const data = await getProjectInfo();
        const response = parseProjectInfo(data, projectName);
        replyAndClean(message, response, timer);
      } catch (error) {
        replyAndClean(message, 'Wrong project name!', timer);
        console.log(error);
      }
      break;

    // kiitus
    case 'kiitus':
      let name = args.shift();
      let kiitus = `
${name} sa oled nii tubli! ;)`;
      replyAndClean(message, `\`\`\`${kiitus}\`\`\``, timer);
      break;

    // help
    case 'help':
      replyAndClean(message, `\`\`\`${helpInfo()}\`\`\``, timer * 2);
      break;
  }
});

client.login(process.env.DISCORD_TOKEN);

import dotenv from 'dotenv';
import { Client } from 'discord.js';
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

// init token
const token = await fetchToken();

const getProjectInfo = async () => {
  const response = await fetch('https://01.kood.tech/api/object/johvi', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
};

// bot
const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'MessageContent'],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  // restrictions, bot, channel, command, user:
  if (message.author.bot) return;
  if (!restrictToChannels(message)) return;
  if (!message.content.startsWith('!')) return;
  // if (!hasAuthorization(message)) return;

  // command list
  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  switch (command) {
    // sprint
    case 'sprint':
      let eventId = args.shift();
      if (eventId == undefined) {
        message.reply('Please enter a valid eventId as well!');
        break;
      }
      try {
        const data = await getSprintData(token, eventId);
        const response = parseSprintData(data);

        if (response.length > 0) {
          message.reply(response);
        } else {
          message.reply('Event not found!');
          break;
        }
      } catch (error) {
        message.reply('Invalid EventId provided.');
        console.error(error);
      }
      break;
    case 'userid':
      let userId = args.shift();
      if (userId == undefined) {
        message.reply('Please enter userId to query!');
        break;
      }
      try {
        const data = await getUserIdData(token, userId);
        const response = parseUserIdData(data);
        message.reply(response);
      } catch (error) {
        message.reply('Invalid UserId provided.');
        console.error(error);
      }
      break;

    // first name
    case 'firstname':
      let firstName = args.shift();
      let lastName = args.shift();
      if (firstName == undefined) {
        message.reply('Please enter a name to Query');
        return;
      }
      try {
        const data = await getUserFirstName(token, firstName, lastName);
        const response = parseUserFirstNameData(data);
        message.reply(truncateForDiscord(response));
      } catch (error) {
        message.reply(
          'Query did not succeed, please provide a Last name as well!'
        );
        console.error(error);
      }
      break;

    // last name
    case 'lastname':
      let lName = args.shift();
      if (lName == undefined) {
        message.reply('Please enter last name to Query');
        return;
      }
      try {
        const data = await getUserLastName(token, lName);
        const response = parseUserLastNameData(data);
        message.reply(truncateForDiscord(response));
      } catch (error) {
        message.reply(
          'Query did not succeed, please try !firstname or !userid as well!'
        );
        console.error(error);
      }
      break;

    // project
    case 'project':
      let projectName = args.shift();
      if (projectName == undefined) {
        message.reply('Please enter project name!');
        break;
      }
      try {
        const data = await getProjectInfo();
        const response = parseProjectInfo(data, projectName);
        message.reply(response);
      } catch (error) {
        message.reply('Wrong project name!');
        console.log(error);
      }
      break;

    // kiitus
    case 'kiitus':
      let name = args.shift();
      let kiitus = `
${name} sa oled nii tubli! ;)`;
      message.reply(`\`\`\`${kiitus}\`\`\``);
      break;

    // help
    case 'help':
      message.reply(`\`\`\`${helpInfo()}\`\`\``);
      break;
  }
});

client.login(process.env.DISCORD_TOKEN);

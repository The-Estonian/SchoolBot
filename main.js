import dotenv from 'dotenv';
import { Client } from 'discord.js';
dotenv.config();

import hasAuthorization from './HasAuthorization/hasAuthorization.js';
import restrictToChannels from './RestrictToChannels/restrictToChannels.js';
import fetchToken from './AuthToken/authToken.js';
import capitalizeFirstLetter from './Helpers/capitalize.js';
import getSprintData from './FetchData/getSprintData.js';
import getUserData from './FetchData/getUserData.js';
import getUserName from './FetchData/getUserName.js';

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
  // if (!restrictToChannels(message)) return;
  if (!message.content.startsWith('!')) return;
  // if (!hasAuthorization(message)) return;

  // command list
  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  switch (command) {
    // sprint command, needs eventId: returns
    case 'sprint':
      let eventId = args.shift();
      if (eventId == undefined) {
        message.reply('Please enter a valid eventId as well!');
        break;
      }
      try {
        const data = await getSprintData(token, eventId);
        let queryLength = data?.data?.event_by_pk?.path.split('/');
        let returnData;
        if (queryLength.length == 5) {
          returnData = data?.data?.event_by_pk?.path.split('/')[4];
        } else {
          returnData = data?.data?.event_by_pk?.path.split('/')[3];
        }
        let returnString = capitalizeFirstLetter(returnData) + '\n';
        const date = new Date(data?.data?.event_by_pk?.startAt);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        returnString +=
          'Starting at: ' + date.toLocaleDateString('en-GB', options) + '\n';
        if (data?.data?.event_by_pk?.usersRelation.length == 0) {
          returnString += 'Currently registered users: \n';

          data?.data?.event_by_pk?.registrations[0]?.users?.forEach(
            (element) => {
              returnString += element.id + '\n';
            }
          );
        }
        data?.data?.event_by_pk?.usersRelation.forEach((element) => {
          returnString += element.userLogin + ': level ' + element.level + '\n';
        });
        if (returnString.length > 0) {
          message.reply(returnString);
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
        let returnData = `
        Received user data:
----------------------------------`;
        const data = await getUserData(token, userId);
        let userData = data?.data?.user_public_view[0];
        returnData += `
ID:         ${userData.id}
Login:      ${userData.login}
First Name: ${userData.firstName}
Last Name:  ${userData.lastName}
----------------------------------\n`;
        returnData += `Gained levels in modules:
----------------------------------\n`;
        userData.events.forEach((row) => {
          if (row.level > 0) {
            let path = row.event.path.split('/');
            path = path[path.length - 1];
            if (path == 'div-01') {
              path = 'Kood / Jõhvi';
            }
            path = capitalizeFirstLetter(path);
            returnData += path + ' ' + 'level: ' + row.level + '\n';
          }
        });
        message.reply(returnData);
      } catch (error) {
        message.reply('Invalid UserId provided.');
        console.error(error);
      }
      break;
    case 'name':
      let firstName = args.shift();
      let lastName = args.shift();
      if (firstName == undefined) {
        message.reply('Please enter a name to Query');
      }
      try {
        let returnData = `
        Received user data:
----------------------------------`;
        const data = await getUserName(token, firstName, lastName);
        if (data.errors != undefined) {
          message.reply(
            'Query did not succeed, please provide different name!'
          );
          console.log('DATA: ', data.errors);
          return;
        }
        console.log('DATA: ', data);

        data?.data?.user_public_view.forEach((item) => {
          returnData += `
ID:         ${item.id}
Login:      ${item.login}
First Name: ${item.firstName}
Last Name:  ${item.lastName}
---------------------`;
        });

        message.reply(returnData);
      } catch (error) {
        message.reply(
          'Query did not succeed, please provide a Last name as well!'
        );
        console.error(error);
      }
      break;

    // get project info
    case 'project':
      let projectName = args.shift();
      if (projectName == undefined) {
        message.reply('Please enter project name!');
        break;
      }
      try {
        const data = await getProjectInfo();

        let datastream = data.children['div-01'].children[projectName];

        let projLabel = capitalizeFirstLetter(datastream.name);
        let groupMax = datastream.attrs.groupMax;
        let groupMin = datastream.attrs.groupMin;
        let auditRatio = datastream.attrs.requiredAuditRatio;
        let expGained = datastream.attrs.baseXp / 1000 + 'kb';
        let prevProj = capitalizeFirstLetter(
          datastream.attrs.requirements.objects[0].split('/')[1]
        );
        let auditReq = `${datastream.attrs.validations[0].required} out of ${
          datastream.attrs.validations[0].required *
          datastream.attrs.validations[0].ratio
        }`;
        let projLanguage = datastream.attrs.language;
        let spacer = Math.max(
          projLabel.length,
          groupMax.toString().length,
          groupMin.toString().length,
          auditRatio.toString().length,
          expGained.length,
          prevProj.length,
          auditReq.length,
          projLanguage.length
        );
        if (spacer < 15) spacer = 15;
        let strecher = 0;
        if (spacer > 15) strecher = spacer - 15;

        message.reply(`\`\`\`
┌────────────────────────────┬────────────────${'─'.repeat(strecher)}┐
│ Project name:              │ ${projLabel}${' '.repeat(
          spacer - projLabel.length
        )}│
├────────────────────────────┼────────────────${'─'.repeat(strecher)}┤
│ Max members:               │ ${groupMax}${' '.repeat(
          spacer - groupMax.toString().length
        )}│
├────────────────────────────┼────────────────${'─'.repeat(strecher)}┤
│ Min members:               │ ${groupMin}${' '.repeat(
          spacer - groupMin.toString().length
        )}│
├────────────────────────────┼────────────────${'─'.repeat(strecher)}┤
│ Min audit ratio:           │ ${auditRatio}${' '.repeat(
          spacer - auditRatio.toString().length
        )}│
├────────────────────────────┼────────────────${'─'.repeat(strecher)}┤
│ Experience:                │ ${expGained}${' '.repeat(
          spacer - expGained.length
        )}│
├────────────────────────────┼────────────────${'─'.repeat(strecher)}┤
│ Required previous project: │ ${prevProj}${' '.repeat(
          spacer - prevProj.length
        )}│
├────────────────────────────┼────────────────${'─'.repeat(strecher)}┤
│ User audits requirement:   │ ${auditReq}${' '.repeat(
          spacer - auditReq.length
        )}│
├────────────────────────────┼────────────────${'─'.repeat(strecher)}┤
│ Language requirement:      │ ${projLanguage}${' '.repeat(
          spacer - projLanguage.length
        )}│
└────────────────────────────┴────────────────${'─'.repeat(strecher)}┘\`\`\``);
      } catch (error) {
        message.reply('Wrong project name!');
        console.log(error);
      }
      break;
    case 'kiitus':
      let name = args.shift();
      let kiitus = `
${name} sa oled nii tubli! ;)`;

      message.reply(`\`\`\`${kiitus}\`\`\``);
      break;
    case 'help':
      let helpMessage = `
WIP
!sprint <id> to get the current sprinters data
!userid <id> to get user data with the given id
!user <name> to get all user with the given first name
!user <name> <lastname> to get user with the name and lastname
!project <name> to get project info`;

      message.reply(`\`\`\`${helpMessage}\`\`\``);
      break;
  }
});

client.login(process.env.DISCORD_TOKEN);

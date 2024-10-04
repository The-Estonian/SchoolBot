import dotenv from 'dotenv';
import { Client } from 'discord.js';
dotenv.config();

import hasAuthorization from './HasAuthorization/hasAuthorization.js';
import restrictToChannels from './RestrictToChannels/restrictToChannels.js';

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// school auth

// fetch token
const fetchToken = async () => {
  const base64Encode = (login, password) => {
    return Buffer.from(`${login}:${password}`).toString('base64');
  };

  const authHeader = `Basic ${base64Encode(
    process.env.LOGIN,
    process.env.PASSWORD
  )}`;

  const response = await fetch('https://01.kood.tech/api/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch token: ${response.statusText}`);
  }

  return await response.json();
};

const token = await fetchToken();

// fetch sprint data
const getData = async (eventId) => {
  // const token = await fetchToken();
  const response = await fetch(
    'https://01.kood.tech/api/graphql-engine/v1/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        query: `query querySprinters {
  event_by_pk(id:${eventId}){
    path
    startAt
    registrations{
      users{
        id
      }
    }
    usersRelation{
      userLogin
      level
    }
  }
}`,
      }),
    }
  );
  return await response.json();
};

// fetch user data

const getUserData = async (userId) => {
  // const token = await fetchToken();
  const response = await fetch(
    'https://01.kood.tech/api/graphql-engine/v1/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        query: `query {
  user_public_view(where:{id: {_in: [${userId}]}}){
    id
    login
    firstName
    lastName
    events{
      level
      event{
        path
      }
    }
  }
}`,
      }),
    }
  );
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
  if (!hasAuthorization(message)) return;

  // command list
  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  switch (command) {
    case 'sprint':
      let eventId = args.shift();
      if (eventId == undefined) {
        message.reply('Please enter the eventId as well!');
        break;
      }
      try {
        const data = await getData(eventId);
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
        message.reply('An error occurred while fetching sprint data.');
        console.error(error);
      }
      break;
    case 'user':
      if (message.author.id != '552485072880533507') {
        message.reply('Not authorized!');
        return;
      }
      let userId = args.shift();
      if (userId == undefined) {
        message.reply('Please enter userId to query!');
        break;
      }
      try {
        let returnData = `
        Received user data:
----------------------------------`;
        const data = await getUserData(userId);
        let userData = data?.data?.user_public_view[0];
        returnData += `
ID: ${userData.id}
Login: ${userData.login}
First Name: ${userData.firstName}
Last Name: ${userData.lastName}
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
        message.reply('An error occurred while fetching user data.');
        console.error(error);
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
!sprint <id> to get the current sprinters data`;

      message.reply(`\`\`\`${helpMessage}\`\`\``);
      break;
  }
});

client.login(process.env.DISCORD_TOKEN);

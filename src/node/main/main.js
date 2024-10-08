import { Client } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

import hasAuthorization from './HasAuthorization/hasAuthorization.js';
import restrictToChannels from './RestrictToChannels/restrictToChannels.js';
import fetchToken from './AuthToken/authToken.js';
import logErrorToFile from './ErrorLogging/logError.js';
import handleAllCommands from './CommandHandlers/handleAllCommands.js';

// global error handling
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

// bot client
const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'MessageContent'],
});

// greeting on start
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

  // handle commands
  handleAllCommands(message);
});

client.on('guildMemberRemove', async (member) => {
  const channel = client.channels.cache.get('1257316921565646878');
  channel.send(
    `\`\`\`Ahh great, someone left! Let's see now... AHA ${member.user.tag} you scoundrel, let me see where i put your credentials... What was the site again, Autolaen24.ee right?\`\`\``
  );
});

client.on('guildMemberAdd', async (member) => {
  const channel = client.channels.cache.get('1257316921565646878');
  channel.send(
    `\`\`\`Welcome to the server, ${member.user.tag} ! Please give me a second while i fetch your credentials to be saved for later. Toodeloo\`\`\``
  );
});

client.login(process.env.DISCORD_TOKEN);

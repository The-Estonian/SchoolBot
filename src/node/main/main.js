import { Client } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

import hasAuthorization from './HasAuthorization/hasAuthorization.js';
import restrictToChannels from './RestrictToChannels/restrictToChannels.js';
import { logErrorToFile, userLogging } from './Logging/logError.js';
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
  intents: ['Guilds', 'GuildMessages', 'MessageContent', 'GuildMembers'],
});

// greeting on start
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const channel = client.channels.cache.get('1257316921565646878');
  if (process.env.GIT_COMMIT) {
    channel.send(
      `\`\`\`Social-Manager updated to version: ${
        process.env.GIT_COMMIT || 'Running on local development server.'
      }\`\`\``
    );
  } else {
    channel.send(`\`\`\`Development server online.\`\`\``);
  }
});

// Bot commands
client.on('messageCreate', async (message) => {
  // restrictions, bot, channel, command, user:
  if (message.author.bot) return;
  if (!restrictToChannels(message)) return;
  if (!message.content.startsWith('!')) return;
  if (!hasAuthorization(message)) return;

  // handle all commands
  handleAllCommands(message);
});

// Client leaves the server
client.on('guildMemberRemove', async (member) => {
  const channel = await client.channels.fetch('1292497677250072588');
  console.log('User left!');

  await userLogging(member.user.tag, 'left-server');
  channel.send(`User <@${member.id}> ${member.user.tag}! Left the server!`);
});

// Client joins the server
client.on('guildMemberAdd', async (member) => {
  const channel = await client.channels.fetch('1292497677250072588');

  await userLogging(member.user.tag, 'joined-server');

  channel.send(`New user joined the server: <@${member.id}>!`);

  const visitorAreaCategory = member.guild.channels.cache.find(
    (category) =>
      category.name === 'VISITOR-AREA' && category.type === 'GUILD_CATEGORY'
  );

  if (visitorAreaCategory) {
    const generalChannel = visitorAreaCategory.children.find(
      (channel) => channel.name === 'general' && channel.type === 'GUILD_TEXT'
    );
    if (generalChannel) {
      const visitorRole = member.guild.roles.cache.find(
        (role) => role.name === 'Visitor'
      );
      if (visitorRole) {
        await member.roles.add(visitorRole);
        channel.send(
          `${member.user.tag} was assigned the @visitor role automatically`
        );
      }
    } else {
      const schoolMember = member.guild.roles.cache.find(
        (role) => role.name === 'K/J'
      );
      if (schoolMember) {
        await member.roles.add(schoolMember);
        channel.send(
          `${member.user.tag} was assigned the @K/J role automatically`
        );
      }
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

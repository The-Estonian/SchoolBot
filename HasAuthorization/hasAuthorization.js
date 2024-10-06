import replyAndClean from '../CleanAfter/replyAndClean.js';

const hasAuthorization = (message) => {
  if (!message.member.roles.cache.has('1292431434388340757')) {
    replyAndClean(message, 'Not Authorized!', 5000);
    const formattedDate = message.createdAt.toLocaleString('en-US', {
      day: '2-digit', // Day with leading zero (e.g., 06)
      month: '2-digit', // Month with leading zero (e.g., 10 for October)
      year: 'numeric', // Full year (e.g., 2024)
      hour: '2-digit', // 2-digit hour (e.g., 09, 22)
      minute: '2-digit', // 2-digit minute (e.g., 05, 45)
      hour12: false, // 24-hour format (set to true for 12-hour format)
    });
    message.client.channels.cache
      .get('1292497677250072588')
      .send(
        `\`\`\`${formattedDate}: ${message.author.tag} -> ${message.content
          .slice(1)
          .trim()
          .split(/ +/)
          .shift()
          .toLowerCase()}\`\`\``
      );
    return false;
  }
  return true;
};

export default hasAuthorization;

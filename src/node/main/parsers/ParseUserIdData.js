import capitalizeFirstLetter from '../Helpers/capitalize.js';

const parseUserIdData = (data) => {
  let userData = data?.data?.user_public_view[0];
  let spacer = Math.max(
    userData.id.toString().length,
    userData.login.length,
    userData.firstName.length,
    userData.lastName.length,
    userData.canAccessPlatform.length,
    userData.canBeAuditor.length
  );
  if (spacer < 13) spacer = 13;
  let strecher = 0;
  if (spacer > 13) strecher = spacer - 13;

  let returnData = `\`\`\`
        Received user data:
┌──────────────────────┬──────────────${'─'.repeat(strecher)}┐
│ ID:                  │ ${userData.id}${' '.repeat(
    spacer - userData.id.toString().length
  )}│
├──────────────────────┼──────────────${'─'.repeat(strecher)}┤
│ Login:               │ ${userData.login}${' '.repeat(
    spacer - userData.login.length
  )}│
├──────────────────────┼──────────────${'─'.repeat(strecher)}┤
│ First Name:          │ ${userData.firstName}${' '.repeat(
    spacer - userData.firstName.length
  )}│
├──────────────────────┼──────────────${'─'.repeat(strecher)}┤
│ Last Name:           │ ${userData.lastName}${' '.repeat(
    spacer - userData.lastName.length
  )}│
├──────────────────────┼──────────────${'─'.repeat(strecher)}┤
│ Can access platform: │ ${userData.canAccessPlatform}${' '.repeat(
    spacer - userData.lastName.length
  )}│
├──────────────────────┼──────────────${'─'.repeat(strecher)}┤
│ Can be Auditor:      │ ${userData.canBeAuditor}${' '.repeat(
    spacer - userData.lastName.length
  )}│
├──────────────────────┴──────────────${'─'.repeat(strecher)}┤
│   Gained levels in modules:   ${' '.repeat(strecher)}│
├─────────────────────────────────────${'─'.repeat(strecher)}┤\n`;
  let levelSpacer = 30;
  userData.events.forEach((row) => {
    if (row.level > 0) {
      let path = row.event.path.split('/');
      path = path[path.length - 1];
      if (path == 'div-01') {
        path = 'Kood / Jõhvi';
      }
      path = capitalizeFirstLetter(path);
      let compileString = `│  ${path} level: ${row.level}`;
      if (compileString.length > levelSpacer) {
        levelSpacer = compileString.length;
      }
      returnData += `│ ${path} ${' '.repeat(
        levelSpacer - compileString.length
      )}level: ${row.level}   │\n`;
    }
  });

  returnData += `└───────────────────────────────┘\`\`\``;

  return returnData;
};
export default parseUserIdData;

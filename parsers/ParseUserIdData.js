import capitalizeFirstLetter from '../Helpers/capitalize.js';

const parseUserIdData = (data) => {
  let returnData = `
        Received user data:
----------------------------------`;
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
  return returnData;
};
export default parseUserIdData;

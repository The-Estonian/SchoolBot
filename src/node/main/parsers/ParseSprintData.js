import capitalizeFirstLetter from '../Helpers/capitalize.js';

const parseSprintData = (data) => {
  let queryLength = data?.data?.event_by_pk?.path?.split('/');

  let returnData;
  let returnString;
  if (queryLength.length == 5) {
    returnData = data?.data?.event_by_pk?.path?.split('/')[4];
  } else {
    returnData = data?.data?.event_by_pk?.path?.split('/')[3];
    if (returnData == undefined) return '';
  }
  const date = new Date(data?.data?.event_by_pk?.startAt);
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  returnString += `
    Project: ${capitalizeFirstLetter(
      returnData
    )}  Starting at: ${date.toLocaleDateString('en-GB', options)}\n`;
  if (data?.data?.event_by_pk?.usersRelation.length == 0) {
    returnString += 'Currently registered users: \n';

    data?.data?.event_by_pk?.registrations[0]?.users?.forEach((element) => {
      returnString += element.id + '\n';
    });
  }
  if (data?.data?.event_by_pk?.groups.length > 0) {
    returnString += '┌─────────────────────────────────────────────┐';
    let captain = data?.data?.event_by_pk?.groups;

    for (let x = 0; x < captain.length; x++) {
      let captainMedian = Math.floor((24 - captain[x].captainLogin.length) / 2);
      returnString += `
│ Captain: ${captain[x].captainLogin
        .padStart(captainMedian + captain[x].captainLogin.length)
        .padEnd(34)} │
├─────────────────────────────────────────────┤`;
      for (let i = 0; i < captain[x].members.length; i++) {
        returnString += `
│   Members: ${captain[x].members[i].userLogin.padEnd(32)} │\n`;
        if (i != captain[x].members.length - 1) {
          returnString += `├─────────────────────────────────────────────┤`;
        } else {
          returnString += `└─────────────────────────────────────────────┘`;
          if (x != captain.length - 1) {
            returnString += '\n┌─────────────────────────────────────────────┐';
          }
        }
      }
    }
  } else {
    data?.data?.event_by_pk?.usersRelation.forEach((element) => {
      returnString += element.userLogin + ': level ' + element.level + '\n';
    });
  }
  return `\`\`\`${returnString}\`\`\``;
};

export default parseSprintData;

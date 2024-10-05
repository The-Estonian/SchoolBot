import capitalizeFirstLetter from '../Helpers/capitalize.js';

const parseSprintData = (data) => {
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

    data?.data?.event_by_pk?.registrations[0]?.users?.forEach((element) => {
      returnString += element.id + '\n';
    });
  }
  data?.data?.event_by_pk?.usersRelation.forEach((element) => {
    returnString += element.userLogin + ': level ' + element.level + '\n';
  });
  return returnString;
};

export default parseSprintData;
